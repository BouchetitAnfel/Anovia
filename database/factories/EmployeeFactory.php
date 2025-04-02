<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName,
            'last_name'  => $this->faker->lastName,
            'email'      => $this->faker->unique()->safeEmail,
            'adresse'    => $this->faker->address,
            'ccp'        => $this->faker->randomNumber(5, true),
            'role'       => $this->faker->randomElement(['admin', 'manager', 'receptionist']),
            'hire_date'  => $this->faker->date,
            'password'   => Hash::make('password123'),
        ];
    }
}
