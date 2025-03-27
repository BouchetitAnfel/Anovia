<?php

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Clients\ClientAuthController;
use App\Http\Controllers\API\Employees\EmployeeAuthController;

Route::post('/employee/login', [EmployeeAuthController::class, 'login'])->name('api.employee.login');
Route::post('/employee/logout', [EmployeeAuthController::class, 'logout']);
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [EmployeeAuthController::class, 'me']);
});


Route::post('/client/register', [ClientAuthController::class, 'register']);
Route::post('/client/login', [ClientAuthController::class, 'login']);
Route::post('/client/logout', [ClientAuthController::class, 'logout']);
Route::get('/profile', [ClientAuthController::class, 'profile']);

/*Route::middleware('auth:client-api')->group(function () {
    Route::get('/profile', [ClientAuthController::class, 'profile']);
});*/
