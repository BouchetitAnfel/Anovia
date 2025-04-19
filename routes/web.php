<?php

use Illuminate\Support\Facades\Route;
Route::get('/{path?}', function () {
    return file_get_contents(public_path('index.html'));
})->where('path', '.*');