<?php

namespace App\Http\Controllers\API\Clients;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ClientAuthService;

class ClientAuthController extends Controller
{
    protected $authService;

    public function __construct(ClientAuthService $authService)
    {
        $this->authService = $authService;
    }


    public function register(Request $request)
    {
        try {
            $result = $this->authService->register(
                $request->only('first_name', 'last_name' , 'email', 'password','phone_number')
            );
            return response()->json($result, 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
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


    public function profile(Request $request)
    {
        $client = $request->user();

        return response()->json([
            'id' => $client->id,
            'first_name' => $client->first_name,
            'last_name' => $client->last_name,
            'email' => $client->email,
            'phone_number' => $client->phone_number,
            'profile_photo'=> $client->profile_photo
        ]);
    }


    public function logout(Request $request)
    {
        $this->authService->logout($request);
        return response()->json(['message' => 'Successfully logged out']);
    }
}
