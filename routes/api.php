<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmployeeAuthController;

Route::post('/employee/login', [EmployeeAuthController::class, 'login'])->name('api.employee.login');
Route::post('/employee/logout', [EmployeeAuthController::class, 'logout']);
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [EmployeeAuthController::class, 'me']);
});
