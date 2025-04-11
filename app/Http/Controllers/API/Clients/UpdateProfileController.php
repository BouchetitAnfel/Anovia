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

    public function UploadPhoto (Request $request){
        $client = Auth::user();
        $validated = $request->validate([
            'profile_photo' => 'sometimes|image|mimes:jpeg,jpg,png,gif'
        ]);

        if(!$request->hasFile('profile_photo')){
            return response([
                'message' => 'Fail no photo updated',
            ],401);
        }

        $updatedClient =$this->clientservice->UploadPhoto($client,$request->file('profile_photo'));
        return response()->json([
            'message' => 'Profile photo uploaded successfully',
            'data' => [
                'client' => $updatedClient,
                'profile_photo_url' => url($updatedClient->profile_photo)
            ]
        ]);

    }

}
