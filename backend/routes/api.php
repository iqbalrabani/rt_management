<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\HouseController;
use App\Http\Controllers\HouseResidentHistoryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ExpenditureController;
use App\Http\Controllers\ReportController;

// Residents
Route::prefix('residents')->group(function () {
    Route::get('/', [ResidentController::class, 'index']);
    Route::post('/', [ResidentController::class, 'store']);
    Route::put('/{id}', [ResidentController::class, 'update']);
    // Tambahkan route GET detail, DELETE jika diperlukan.
});

// Houses
Route::apiResource('houses', HouseController::class);

// House Resident Histories
Route::apiResource('house-histories', HouseResidentHistoryController::class);

// Payments
Route::apiResource('payments', PaymentController::class);

// Expenditures
Route::apiResource('expenditures', ExpenditureController::class);

// Reports (sudah disediakan sebelumnya)
Route::get('reports/summary', [ReportController::class, 'monthlySummary']);
Route::get('reports/monthly/{year}/{month}', [ReportController::class, 'monthlyDetail']);