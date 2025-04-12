<?php

namespace App\Services;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class ClientAuthService
{
    /**
     *
     * @param array $credentials
     * @return array
     */


    public function register(array $data): array
    {
        $validatedData = validator($data, [
            'first_name' => 'required',
            'last_name' => 'required',
            'email' => 'required|email|unique:clients,email',
            'password' => 'required|min:8',
            'phone_number'=>'required|between:10,12'
        ])->validate();

        $client = Client::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'phone_number'=>$validatedData['phone_number']
        ]);

        $token = $client->createToken('ClientToken', ['client-api'])->accessToken;

        return [
            'message' => 'Registered successfully',
            'token' => $token
        ];
    }



    public function login(array $credentials): array
    {
        $email = $credentials['email'] ?? null;
        $password = $credentials['password'] ?? null;

        $client = client::where('Email', $email)->first();

        if (!$client) {
            throw new \Exception('User Not found');
        }
        if (!Hash::check($password, $client->password)) {
            throw new \Exception('Invalid password');
        }

        $token = $client->createToken('clientToken', ['client-api'])->accessToken;

        return [
            'token' => $token,
        ];
    }

    public function logout(Request $request)
    {

        $client = $request->user();
        $client->token()->revoke();

        return response()->json(['message' => 'Client User Logged out successfully']);
    }
}
