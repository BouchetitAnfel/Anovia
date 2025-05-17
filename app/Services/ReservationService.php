<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;


class ReservationService
{

    public function getAllReservations()
    {
        return Reservation::with(['client', 'room'])
                    ->orderBy('date_checkin', 'desc')
                    ->get();
    }

    public function getReservationById($id)
    {
        return Reservation::with(['client', 'room'])->findOrFail($id);
    }

    //this to udate the room state llreceptionist manually
    public function updateRoomState(Reservation $reservation, string $roomState)
    {
        $updatedReservation = DB::transaction(function() use ($reservation , $roomState) {
            $reservation->update([
                'room_state' => $roomState,
                'receptionist_id' => Auth::id(),
            ]);

            return $reservation->fresh();
        });

        return $updatedReservation;

    }




    public function checkIn($reservationId, $receptionistId)
    {
        return DB::transaction(function () use ($reservationId, $receptionistId) {
            $reservation = Reservation::findOrFail($reservationId);

            if ($reservation->reservation_status !== 'pending') {
                throw new \Exception('Reservation is not in a pending state.');
            }

            $reservation->update([
                'date_checkin' => now(),
                'reservation_status' => 'checked_in',
                'receptionist_id' => $receptionistId,
                'room_state' => 'occupied',
            ]);
            return $reservation;
        });
    }
    public function checkOut($reservationId, $receptionistId)
    {
        return DB::transaction(function () use ($reservationId, $receptionistId) {
            $reservation = Reservation::findOrFail($reservationId);

            if ($reservation->reservation_status !== 'checked_in') {
                throw new \Exception('Reservation is not in a checked-in state.');
            }

            $reservation->update([
                'date_checkout' =>now(),
                'reservation_status' => 'checked_out',
                'receptionist_id' => $receptionistId,
                'room_state' => 'Dirty',
            ]);

            return $reservation;
        });
    }




    public function createReservation($roomId, $dateCheckin, $dateCheckout, $client , $receptionistId)
    {
        $room = Room::findOrFail($roomId);

        $isAvailable = !Reservation::where('room_id', $room->id)
            ->where('date_checkin', '<', $dateCheckout)
            ->where('date_checkout', '>', $dateCheckin)
            ->exists();

        if (!$isAvailable) {
            throw new \Exception('Room is not available for the selected dates');
        }

        $checkin = Carbon::parse($dateCheckin);
        $checkout = Carbon::parse($dateCheckout);
        $days = $checkin->diffInDays($checkout);
        $totalPrice = $room->price_per_night * $days;

        $reservation = Reservation::create([
            'client_id' => $client->id,
            'name_client' => $client->first_name . ' ' . $client->last_name,
            'room_id' => $room->id,
            'date_reservation' => now(),
            'date_checkin' => $dateCheckin,
            'date_checkout' => $dateCheckout,
            'receptionist_id' => $receptionistId,
            'reservation_status' => 'Checked_In',
            'total_price' => $totalPrice,
            'room_state' => 'Occupied',
        ]);


        return $reservation;
    }


    public function RoomsList()
    {
        return Room::all();
    }


    public function cancelReservation(Reservation $reservation, $receptionistId)
    {
        if (!in_array($reservation->reservation_status, ['pending', 'confirmed', 'checked_in'])) {
            throw new \Exception("Only PENDING, CONFIRMED, or CHECKED_IN reservations can be cancelled.");
        }

        return DB::transaction(function () use ($reservation, $receptionistId) {
            $reservation->update([
                'reservation_status' => 'canceled',
                'receptionist_id' => $receptionistId,
                'updated_at' => now(),
                'room_state'=>'Dirty'
            ]);

            return $reservation;
        });
    }

    public function deleteReservation(Reservation $reservation)
    {
        $reservation->delete();
    }
}
