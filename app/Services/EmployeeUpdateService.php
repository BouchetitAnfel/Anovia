<?php

namespace App\services;

use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeUpdateService{
    public function UpdateEmployeeInformation(Employee $employee, array $data){

        foreach($data as $key => $value){
            if($key === 'password'){
                $employee->password = Hash::make($value);
            }else{
                $employee->$key = $value;
            }
        }

        $employee->save();
        return $employee;
    }


}

