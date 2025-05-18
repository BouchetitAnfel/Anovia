<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    public function run()
    {   Employee::factory()->count(10)->create();
        Employee::create([
            'first_name' => 'Sara',
            'last_name' => 'Boulasel',
            'Email' => 'Sara@gmail.com',
            'Adresse' => 'Algiers',
            'ccp' => '987654',
            'Role' => 'housekeeper',
            'hire_date' => now(),
            'password' => Hash::make('password123'),
        ]);
        
    }
}
