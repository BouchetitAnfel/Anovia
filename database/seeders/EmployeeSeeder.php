<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    public function run()
    {
        Employee::updateOrCreate(
            ['Email' => '3bda9a@example.com'],
            [
                'first_name' => '3bda9a',
                'last_name'  => 'yoo',
                'Adresse'    => 'AinTouta',
                'ccp'        => '12345',
                'Role'       => 'manager',
                'hire_date'  => now(),
                'password'   => Hash::make('password123'),
            ]
        );

    }
}
