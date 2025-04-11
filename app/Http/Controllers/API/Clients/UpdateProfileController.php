<?php

namespace App\Http\Controllers\API\Clients;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\ClientUpdateService;
use Illuminate\Support\Facades\Auth;

class UpdateProfileController extends Controller
{
    protected $clientservice;

    public function __construct(ClientUpdateService $clientUpdateService){
        $this->clientservice = $clientUpdateService;
    }

    public function UpdateProfile (Request $request ){
        $client = Auth::user();

        $validated = $request->validate([
            'first_name'=>'sometimes|string',
            'last_name'=>'sometimes|string',
            'email'=>'sometimes|unique:clients,email',
            'phone_number'=>'sometimes|integer|unique:clients,phone_number' ,
            'password'=>'sometimes|min:8'
        ]);


        $updatedProfile = $this->clientservice->UpdateProfileInformation($client , $validated);

        return response([
            'success' => true,
            'message' => 'informations updated successfully',
            'updated information ' => $updatedProfile
        ]);


    }

}
