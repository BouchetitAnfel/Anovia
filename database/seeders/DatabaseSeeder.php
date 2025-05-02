<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\RoomSeeder;
use Database\Seeders\StockSeeder;
use Database\Seeders\ClientSeeder;
use Database\Seeders\EmployeeSeeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            ClientSeeder::class,
            StockSeeder::class,
            EmployeeSeeder::class,
            RoomSeeder::class
        ]);
    }
}
