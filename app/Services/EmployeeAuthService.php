<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class EmployeeAuthService
{
    /**
     * Handle employee login
     *
     * @param array $credentials
     * @return array
     */
    public function login(array $credentials)
    {
        $email = $credentials['email'] ?? null;
        $password = $credentials['password'] ?? null;

        // Find employee by email - note the capitalized 'Email' based on your me() method
        $employee = Employee::where('Email', $email)->first();

        if (!$employee || !Hash::check($password, $employee->password)) {
            throw new \Exception('Invalid credentials');
        }

        // Create token using Passport
        $token = $employee->createToken('EmployeeToken')->accessToken;

        return [
            'token' => $token,
            'user' => [
                'id' => $employee->id,
                'first_name' => $employee->{'first_name'},
                'last_name' => $employee->{'last_name'},
                'email' => $employee->Email,
                'role' => $employee->Role,
            ]
        ];
    }

    /**
     * Handle employee logout
     *
     * @param Employee $employee
     * @return void
     */
    public function logout($employee)
    {
        // Revoke all tokens
        $employee->tokens->each(function ($token) {
            $token->revoke();
        });
    }
}
