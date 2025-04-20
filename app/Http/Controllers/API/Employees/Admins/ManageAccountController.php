<?php

namespace App\Http\Controllers\API\Employees\Admins;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\services\EmployeeUpdateService;

class ManageAccountController extends Controller{

    protected $employeeupdateservice;

    public function __construct(EmployeeUpdateService $employeeupdateservice){
        $this->$employeeupdateservice = $employeeupdateservice;
    }

    public function Modify (Request $request){
        $employee = auth::user();

        $validated = $request->validate([
            'first_name'=>'sometimes|string',
            'Last_name' =>'sometimes|string',
            'Email'=> 'sometimes|unique:employee,Eamail',
            'ccp'=>'sometimes|integer|max:8',
            'password'=>'sometimes|min:8',
            'hire_date'=>'sometimes|date',
            'Adresse'=>'sometimes|String'
        ]);

        $UpdatedEmployee = $this->employeeupdateservice->UpdateEmployeeInformation($employee, $validated);

        return response([
            'message' => true,
            'Your employee has been updated successefuly Mister Admin',
            'updated information' => $UpdatedEmployee
        ]);
    }
}
