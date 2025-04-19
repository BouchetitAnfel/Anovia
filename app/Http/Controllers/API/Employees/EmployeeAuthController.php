<?php

namespace App\Http\Controllers\API\Employees;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\EmployeeAuthService;
use Illuminate\Http\JsonResponse;

class EmployeeAuthController extends Controller
{
    protected $authService;

    public function __construct(EmployeeAuthService $authService)
    {
        $this->authService = $authService;
    }


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


    public function logout(Request $request)
    {
        return $this->authService->logout($request);
    }


    public function me(Request $request)
    {
        $employee = $request->user();

        return response()->json([
            'id' => $employee->id,
            'first_name' => $employee->first_name,
            'last_name' => $employee->last_name,
            'email'=>$employee->email,
            'role'=>$employee->role
        ]);
    }
}