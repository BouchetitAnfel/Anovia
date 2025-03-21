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
            ['Email' => 'john@example.com'],
            [
                'first_name' => 'John',
                'last_name'  => 'Doe',
                'Adresse'    => '123 Main St',
                'ccp'        => '123456',
                'Role'       => 'admin',
                'hire_date'  => '2023-01-01',
                'password'   => Hash::make('mysecretpassword'),
            ]
        );

    }
}
