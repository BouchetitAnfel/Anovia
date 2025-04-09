<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\API\Clients\ClientAuthController;
use App\Http\Controllers\API\Clients\ReservationController;
use App\Http\Controllers\API\Employees\EmployeeAuthController;
use App\Http\Controllers\API\Employees\Admins\CreateAccountController;
use App\Http\Controllers\API\Employees\Admins\StockManagementController;

Route::post('/login', [EmployeeAuthController::class, 'login'])->name('api.employee.login');

Route::middleware('auth:api')->group(function () {
    Route::get('/profile', [EmployeeAuthController::class, 'me']);
    Route::post('/logout', [EmployeeAuthController::class, 'logout']);
});

Route::middleware(['auth:api', RoleMiddleware::class.':admin'])->group(function() {
    Route::post('/Admin/CreateAccount', [CreateAccountController::class, 'CreateAccount']);
    Route::post('/Admin/Stock/AddStock', [StockManagementController::class, 'AddStock']);
    Route::get('/Admin/Stock/List', [StockManagementController::class, 'StockList']);
});

Route::post('/client/register', [ClientAuthController::class, 'register']);
Route::post('/client/login', [ClientAuthController::class, 'login']);

Route::middleware('auth:client-api')->group(function () {
    Route::get('/Client/profile', [ClientAuthController::class, 'profile']);
    Route::post('/client/logout', [ClientAuthController::class, 'logout']);
});

Route::middleware('auth:client-api')->prefix('reservations')->group(function () {
    Route::post('/NewReservation', [ReservationController::class, 'store']);
    Route::get('/ListReservation', [ReservationController::class, 'listReservations']);
    Route::delete('/Cancel/{id}', [ReservationController::class, 'cancel']);
});