<?php

namespace App\Http\Controllers\API\Employees\Admins;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Employee;
use App\Services\EmployeeUpdateService;

class ManageAccountController extends Controller
{
    protected $employeeUpdateService;

    public function __construct(EmployeeUpdateService $employeeUpdateService)
    {
        $this->employeeUpdateService = $employeeUpdateService;
    }

    public function modify(Request $request, $employeeId)
    {
        $employee = Employee::where('id', $employeeId)->first();

        $validated = $request->validate([
            'first_name' => 'sometimes|string',
            'last_name' => 'sometimes|string',
            'email' => 'sometimes|unique:employees,email,' . $employee->id,
            'ccp' => 'sometimes|integer|digits_between:1,8',
            'password' => 'sometimes|min:8',
            'hire_date' => 'sometimes|date',
            'address' => 'sometimes|string'
        ]);

        $updatedEmployee = $this->employeeUpdateService->updateEmployeeInformation($employee, $validated);

        return response([
            'success' => true,
            'message' => 'Employee information has been updated successfully',
            'updated_information' => $updatedEmployee
        ], 200);
    }

    public function delete($employeeId){

        $employeeId = Employee::find($employeeId);
        $result = $this->employeeUpdateService->removeEmployee($employeeId);

        return response()->json([
            'message' => $result
        ]);
    }

    public function listemployees(){
        $employees = $this->employeeUpdateService->getAllEmployees();

        return response()->json([
            'success' => true,
            'The employees' => $employees
        ]);
    }
}
