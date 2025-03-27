<?php

namespace App\Services;

use App\Models\Client;
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'password' => 'required|min:8'
        ])->validate();

        $client = Client::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $token = $client->createToken('ClientToken', ['client-api'])->accessToken;

        return [
            'message' => 'Client registered successfully',
            'token' => $token
        ];
    }



    public function login(array $credentials): array
    {
        $email = $credentials['email'] ?? null;
        $password = $credentials['password'] ?? null;

        $client = client::where('Email', $email)->first();

        if (!$client) {
            throw new \Exception('User not found');
        }
        if (!Hash::check($password, $client->password)) {
            throw new \Exception('Invalid password');
        }
        $token = $client->createToken('UserToken')->accessToken;

        return [
            'token' => $token,
            'client' => $client
        ];
    }
}
