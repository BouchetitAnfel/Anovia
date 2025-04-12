<?php
namespace app\services;

use App\Models\Client;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;


class ClientUpdateService {

    public function UpdateProfileInformation (Client $client , array $data){

        foreach($data as $key => $value){
            if($key === 'password'){
                $client->password = Hash::make($value);
            }else{
                $client->$key = $value;
            }
        }



        /*  if(isset($data['first_name'])) {
                $client->first_name = $data['first_name'];
            }
            if(isset($data['last_name'])){
                $client->last_name = $data['last_name'];
            }
            if(isset($data['email'])){
                $client->email = $data['email'];
            }
            if(isset($data['phone_number'])){
                $client->phone_number = $data['phone_number'];
            }
            if(isset($data['password'])){
                $client->password = Hash::make($data['password']);
            }
        */
            $client->save();
            return $client;
    }



    public function UploadPhoto (Client $client , $photoFile){
        if ($client->profile_photo) {
            Storage::disk('public')->delete(str_replace('storage/', '', $client->profile_photo));
        }

        $filename = time() . '_' . $photoFile->getClientOriginalName();
        $photoFile->storeAs('profile_photos', $filename, 'public');

        $client->profile_photo = 'storage/profile_photos/' . $filename;
        $client->save();

        return $client;
    }

}
