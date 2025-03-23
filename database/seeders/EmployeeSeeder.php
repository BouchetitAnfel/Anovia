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
            ['Email' => '3bda9aWasmo@example.com'],
            [
                'first_name' => '3bda9a',
                'last_name'  => 'Wasmo',
                'Adresse'    => 'Ain Toutaa',
                'ccp'        => '1234567',
                'Role'       => 'manager',
                'hire_date'  => '2005-07-24',
                'password'   => Hash::make('mysecretpassword'),
            ]
        );

    }
}
