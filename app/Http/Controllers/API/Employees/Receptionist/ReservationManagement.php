<?php

namespace App\Http\Controllers\Api\Employees\Receptionist;

use App\Models\Client;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ReservationService;
use Illuminate\Support\Facades\Auth;
use App\Services\RoomService;


class ReservationManagement extends Controller
{

    protected $reservationService;
    protected $roomService;

    public function __construct(ReservationService $reservationService , RoomService $roomService)
    {
        $this->reservationService = $reservationService;
        $this->roomService = $roomService;
    }





    //index rahi to get all the reservation out there
    public function index()
    {
        $reservations = $this->reservationService->getAllReservations();

        return response()->json([
            'status' => 'success',
            'data' => $reservations
        ]);
    }

    //show methode is to get the reservation details by id
    public function show($id)
    {
        $reservation = $this->reservationService->getReservationById($id);

        if (!$reservation) {
            return response()->json([
                'status' => 'error',
                'message' => 'Reservation not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $reservation
        ]);
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'date_checkin' => 'required|date',
            'date_checkout' => 'required|date|after:date_checkin',
            'client_id' => 'required|exists:clients,id',
        ]);

        $client = Client::findOrFail($validated['client_id']);
        $receptionistId = Auth::id();
        try {
            $reservation = $this->reservationService->createReservation(
                $validated['room_id'],
                $validated['date_checkin'],
                $validated['date_checkout'],
                $client,
                $receptionistId
            );

            return response()->json($reservation, 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 409);
        }
    }

    public function updateRoomState(Request $request, $id)
    {
        $reservation = Reservation::find($id);
        if(!$reservation){
            return response()->json([
                'status' =>'error',
                'message'=>'Cannot find the reservation you are looking for'
            ],404);
        }
        $validated = $request->validate([
            'room_state' => 'required|string'
        ]);
        $updatedreservation = $this->reservationService->updateRoomState($reservation,$validated['room_state']);

        return response()->json([
            'message' => 'Room state updated',
            'Updated reservation' => $updatedreservation
        ]);
    }


    public function checkIn(Request $request, $id)
    {
        $receptionistId = Auth::id();


        try {
            $reservation = $this->reservationService->checkIn($id,  $receptionistId);

            return response()->json([
                'message' => 'Check-in successful.',
                'reservation' => $reservation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Check-in failed.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function checkOut(Request $request, $id)
    {
        $receptionistId = Auth::id();


        try {
            $reservation = $this->reservationService->checkOut($id,$receptionistId);

            return response()->json([
                'message' => 'Check-out successful.',
                'reservation' => $reservation
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Check-out failed.',
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function RoomsList()
    {
        $data = $this->roomService->RoomsList();
        return response()->json($data);
    }


    public function cancel($id, Request $request)
    {
        $request->validate([
            'receptionist_id' => 'required|exists:employees,id',
        ]);

        $reservation = Reservation::findOrFail($id);

        try {
            $cancelled = $this->reservationService->cancelReservation($reservation, $request->receptionist_id);

            return response()->json([
                'status' => 'success',
                'message' => 'Reservation cancelled successfully.',
                'canceled_reservation' => $cancelled,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cancellation failed.',
                'error' => $e->getMessage(),
            ], 400);
        }
    }


    public function delete($id)
    {
        $reservation = Reservation::findOrFail($id);
        $this->reservationService->deleteReservation($reservation);

        return response()->json([
            'status' => 'success',
            'message' => 'Reservation deleted successfully.'
        ]);
    }
}
