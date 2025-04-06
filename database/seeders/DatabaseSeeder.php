<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\ClientSeeder;  // Make sure the ClientSeeder is registered

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            ClientSeeder::class,  // Register ClientSeeder here
        ]);
    }
}
