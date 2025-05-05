<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\API\Clients\ClientAuthController;
use App\Http\Controllers\API\Clients\ReservationController;
use App\Http\Controllers\API\Clients\UpdateProfileController;
use App\Http\Controllers\API\Employees\EmployeeAuthController;
use App\Http\Controllers\API\Employees\Admins\CreateAccountController;
use App\Http\Controllers\API\Employees\Admins\ManageAccountController;
use App\Http\Controllers\API\Employees\Admins\StockManagementController;
use App\Http\Controllers\Api\Employees\Receptionist\ReservationManagement;

//employee
Route::post('/login', [EmployeeAuthController::class, 'login'])->name('api.employee.login');
Route::middleware('auth:api')->group(function () {
    Route::get('/profile',  [EmployeeAuthController::class, 'me']);
    Route::post('/logout', [EmployeeAuthController::class, 'logout']);
});

//admin
Route::middleware(['auth:api', RoleMiddleware::class.':admin'])->group( function(){
    Route::post('/Admin/CreateAccount', [CreateAccountController::class, 'CreateAccount']);
    Route::post('/employees/{employeeId}/modify', [ManageAccountController::class, 'modify']);
    Route::get('/employees/Listemployees',[ManageAccountController::class,'listemployees']);
    Route::delete('/employees/{employeeId}', [ManageAccountController::class, 'delete']);

    Route::post('/Admin/Stock/AddStock', [StockManagementController::class, 'AddStock']);
    Route::get('/Admin/Stock/List' ,[StockManagementController::class, 'StockList']);

});


//receptionist
Route::middleware(['auth:api', RoleMiddleware::class.':receptionist'])->group(function(){
    Route::get('/reservations', [ReservationManagement::class, 'index']);
    Route::get('/reservations/{id}', [ReservationManagement::class, 'show']);
    Route::patch('/reservations/{id}/room-state', [ReservationManagement::class, 'updateRoomState']);
    Route::post('/reservations/{id}/check-in', [ReservationManagement::class, 'checkIn']);
    Route::post('/reservations/{id}/check-out', [ReservationManagement::class, 'checkOut']);
    Route::put('/reservations/{id}/cancel', [ReservationManagement::class, 'cancel']);
    Route::delete('/reservations/{id}/delete', [ReservationManagement::class, 'delete']);
    Route::post('/reservations/create' ,[ReservationManagement::class,'create']);
    Route::get('/rooms',[ReservationManagement::class,'RoomsList']);
});



//client auth
Route::post('/client/register', [ClientAuthController::class, 'register']);
Route::post('/client/login', [ClientAuthController::class, 'login']);
Route::middleware('auth:client-api')->group(function () {
    Route::get('/client/profile', [ClientAuthController::class, 'profile']);
    Route::post('/client/logout', [ClientAuthController::class, 'logout']);
});


//modify profile client
route::middleware('auth:client-api')->group(function (){
    Route::put('/Client/UpdateProfile',[UpdateProfileController::class , 'UpdateProfile']);
    Route::post('/Client/UploadPhoto',[UpdateProfileController::class , 'Uploadphoto']);
});


//reservation client
Route::middleware('auth:client-api')->prefix('reservations')->group(function () {
    Route::post('/NewReservation', [ReservationController::class, 'store']);
    Route::get('/ListReservation', [ReservationController::class, 'listReservations']);
    Route::delete('/Cancel/{id}', [ReservationController::class, 'cancel']);
});




