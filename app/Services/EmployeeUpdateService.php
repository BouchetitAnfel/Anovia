<?php

namespace App\Services;

use App\Models\Employee;
use Illuminate\Support\Facades\Hash;

class EmployeeUpdateService
{
    public function updateEmployeeInformation(Employee $employee, array $data)
    {
        $allowedFields = ['first_name', 'last_name', 'email', 'ccp', 'password', 'hire_date', 'address'];

        foreach($data as $key => $value){
            if(!in_array($key, $allowedFields)) {
                continue; // Skip fields not in the allowed list
            }

            if($key === 'password'){
                $employee->password = Hash::make($value);
            } else {
                $employee->$key = $value;
            }
        }

        $employee->save();
        return $employee;
    }
}
