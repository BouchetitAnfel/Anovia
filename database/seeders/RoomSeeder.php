<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;'); 
        DB::table('rooms')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        Room::factory()->count(10)->create();
    }
}