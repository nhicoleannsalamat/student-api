<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('students', StudentController::class)
        ->only(['index', 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class)
            ->except(['index', 'show']);
    });
});