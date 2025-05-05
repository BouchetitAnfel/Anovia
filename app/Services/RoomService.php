<?php
namespace App\Services;

use App\Models\Room;



class RoomService{
    public function RoomsList()
    {
        return Room::all();
    }

}
