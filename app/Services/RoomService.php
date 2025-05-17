<?php
namespace App\Services;

use App\Models\Room;
use Illuminate\Validation\ValidationException;



class RoomService{
    public function RoomsList()
    {
        return Room::all();
    }

    public function updateRoomState(int $roomId, string $room_state)
    {
        Room::where('id', $roomId)->update(['room_state' => $room_state]);
        return Room::findOrFail($roomId);
    }

}
