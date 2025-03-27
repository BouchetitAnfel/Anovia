<?php

namespace App\Http\Controllers\API\Employees;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\EmployeeAuthService;

class EmployeeAuthController extends Controller
{
    protected $authService;

    public function __construct(EmployeeAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Handle employee login request
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        try {
            $result = $this->authService->login(
                $request->only('email', 'password')
            );
            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 401);
        }

    }

    /**
     * Handle employee logout
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $this->authService->logout($request); // Pass the full request
        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Get the authenticated employee
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function me(Request $request)
    {
        $employee = $request->user();

        return response()->json([
            'id' => $employee->id,
            'first_name' => $employee->{'first_name'},
            'last_name' => $employee->{'last_name'},
        ]);
    }
}
