<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run()
    {
        Room::factory()->count(10)->create();  // Create 10 rooms
    }
}
