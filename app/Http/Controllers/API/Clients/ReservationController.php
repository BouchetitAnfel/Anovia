<?php


namespace App\Http\Controllers\API\Clients;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Client;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ReservationController extends Controller
{

    public function store(Request $request)
    {
        $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'date_checkin' => 'required|date|after_or_equal:today',
            'date_checkout' => 'required|date|after:date_checkin',
        ]);

        $client = Auth::user();

        $room = Room::findOrFail($request->room_id);

        $isAvailable = !Reservation::where('room_id', $room->id)
            ->where('date_checkin', '<', $request->date_checkout)
            ->where('date_checkout', '>', $request->date_checkin)
            ->exists();

        if (!$isAvailable) {
            return response()->json(['message' => 'Room is not available for the selected dates'], 400);
        }

        $checkin = Carbon::parse($request->date_checkin);
        $checkout = Carbon::parse($request->date_checkout);
        $days = $checkin->diffInDays($checkout);
        $totalPrice = $room->price_per_night * $days;

        $reservation = Reservation::create([
            'client_id' => $client->id,
            'name_client' => $client->first_name . ' ' . $client->last_name,
            'room_id' => $room->id,
            'date_reservation' => now(),
            'date_checkin' => $request->date_checkin,
            'date_checkout' => $request->date_checkout,
            'receptionist_id' => null,
            'reservation_status' => 'pending',
            'total_price' => $totalPrice,
        ]);

        return response()->json([
            'message' => 'Reservation created successfully',
            'reservation' => $reservation
        ], 201);
    }

    public function listReservations()
    {
        /** @var \App\Models\Client $client */
        $client = Auth::user();
        $reservations = $client->reservations()->with('room')->get();

        return response()->json(['reservations' => $reservations]);
    }

    public function cancel($id)
    {
        $reservation = Reservation::where('client_id', Auth::id())->findOrFail($id);

        if ($reservation->reservation_status === 'canceled') {
            return response()->json(['message' => 'Reservation is already canceled'], 400);
        }

        $reservation->update(['reservation_status' => 'canceled']);

        return response()->json(['message' => 'Reservation canceled successfully']);
    }
}
