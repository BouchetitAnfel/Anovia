<?php
namespace App\Http\Controllers\Api\Employees\Housekeeper;

use App\Models\Room;
use Illuminate\Http\Request;
use App\Services\RoomService;
use App\Http\Controllers\Controller;
use App\Services\ReservationService;
use Illuminate\Validation\Rule;


class ManageRoomsController extends Controller{


    protected $reservationService;
    protected $roomService;
    public function __construct(ReservationService $reservationService , RoomService $roomService)
    {
        $this->reservationService = $reservationService;
        $this->roomService = $roomService;
    }

    public function List(){
        $data = $this->roomService->RoomsList();
        return response()->json(['data'=>$data]);
    }

    public function updateState(Request $request,int $roomId)
    {

        $validStates = ['Available' , 'Do not distrub' , 'Dirty' , 'Clean' , 'Reserved' , 'Late to checkout' , 'Out of order' , 'Stay over' , 'Occupied'];

        $validated = $request->validate([
            'room_state' => ['required', 'string', Rule::in($validStates)]
        ]);

        $room = $this->roomService->updateRoomState($roomId, $validated['room_state']);

        return response()->json([
            'message' => 'Room state updated successfully.',
            'room' => $room
        ]);
    }
}
