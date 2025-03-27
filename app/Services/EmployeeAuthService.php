<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;


class EmployeeAuthService
{
    /**
     *
     * @param array $credentials
     * @return array
     */
    public function login(array $credentials)
    {
        $email = $credentials['email'] ?? null;
        $password = $credentials['password'] ?? null;

        $employee = Employee::where('Email', $email)->first();

        if (!$employee) {
            throw new \Exception('Employee not found');
        }

        if (!Hash::check($password, $employee->password)) {
            throw new \Exception('Invalid password');
        }

        $token = $employee->createToken('EmployeeToken')->accessToken;

        return [
            'token' => $token,
            'redirect' => $this->redirectionTo($employee->role)
        ];
    }

    function redirectionTo ($role) {
        switch ($role){
            case 'admin':
                return '/admin/dashborad';
            case 'manager' :
                return '/manager/dashborad';
            case 'receptionist' :
                return '/receptionist/dashboard';
            case  'housekeeper';
                return '/housekeeper/dashboard';
        }
    }
    /**
     *
     * @param Employee $employee
     * @return void
     */
    public function logout(Request $request)
    {
        $employee = $request->user();

        if ($employee) {
                $employee->tokens->each(function ($token) {
                $token->revoke();
            });

            return response()->json(['message' => 'Logged out successfully']);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

}
