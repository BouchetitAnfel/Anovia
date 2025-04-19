<?php

namespace App\Http\Controllers\API\Employees\Admins;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class CreateAccountController extends Controller
{
    public function CreateAccount(Request $request)
    {
        $validatedData = $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'Email' => 'required|email|unique:employees,Email',
            'Adresse' => 'required',
            'ccp' => 'required',
            'Role' => 'required',
            'hire_date' => 'required|date',
            'password' => 'required|min:8'
        ]);

        $employee = Employee::create([
            'first_name' => $validatedData['first_name'],
            'last_name' => $validatedData['last_name'],
            'Email' => $validatedData['Email'],
            'Adresse' => $validatedData['Adresse'],
            'ccp' => $validatedData['ccp'],
            'Role' => $validatedData['Role'],
            'hire_date' => $validatedData['hire_date'],
            'password' => Hash::make($validatedData['password']),
        ]);

        return response()->json([
            'message' => 'Employee account created successfully',
            'employee_id' => $employee->id
        ], 201);
    }
}