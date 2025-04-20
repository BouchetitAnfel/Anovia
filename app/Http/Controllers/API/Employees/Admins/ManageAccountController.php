<?php

namespace App\Http\Controllers\API\Employees\Admins;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Employee; // Make sure this import matches your model's actual namespace
use App\Services\EmployeeUpdateService;

class ManageAccountController extends Controller
{
    protected $employeeUpdateService;

    // Inject the service in the constructor
    public function __construct(EmployeeUpdateService $employeeUpdateService)
    {
        $this->employeeUpdateService = $employeeUpdateService;
        // Assuming you're applying your admin middleware here or in routes
        // $this->middleware('admin');
    }

    public function modify(Request $request, $employeeId)
    {
        // Find the employee to modify
        $employee = Employee::findOrFail($employeeId);

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
}
