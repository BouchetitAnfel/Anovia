<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;


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

        $employee = Employee::where('Email', $email)->first();

        if (!$employee || !Hash::check($password, $employee->password)) {
            throw new \Exception('Invalid credentials');
        }

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
    public function logout(Request $request)
    {
        $employee = $request->user();

        if ($employee) {
        // Revoke all tokens
                $employee->tokens->each(function ($token) {
                $token->revoke();
            });

            return response()->json(['message' => 'Logged out successfully']);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

}
