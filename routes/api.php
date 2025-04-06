<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Clients\ClientAuthController;
use App\Http\Controllers\API\Clients\ReservationController;
use App\Http\Controllers\API\Employees\EmployeeAuthController;
use App\Http\Controllers\Employees\Admins\CreateAccountController;

Route::post('/employee/login', [EmployeeAuthController::class, 'login'])->name('api.employee.login');
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [EmployeeAuthController::class, 'me']);
    Route::post('/employee/logout', [EmployeeAuthController::class, 'logout']);
});

Route::post('/CreateAccount', [CreateAccountController::class, 'CreateAccount']);



Route::post('/client/register', [ClientAuthController::class, 'register']);
Route::post('/client/login', [ClientAuthController::class, 'login']);
Route::middleware('auth:client-api')->group(function () {
    Route::get('/profile', [ClientAuthController::class, 'profile']);
    Route::post('/client/logout', [ClientAuthController::class, 'logout']);
});


Route::middleware('auth:api')->prefix('reservations')->group(function () {
    Route::post('/', [ReservationController::class, 'store']);
    Route::get('/', [ReservationController::class, 'listReservations']);
    Route::delete('/{id}', [ReservationController::class, 'cancel']);
});


