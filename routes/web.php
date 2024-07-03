<?php

use App\Http\Controllers\MarkerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::get('/marker/all', [MarkerController::class, 'all'])->name('marker.all');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/marker/store', [MarkerController::class, 'store'])->name('marker.store');
    Route::post('/marker/update/{id}', [MarkerController::class, 'update'])->name('marker.update');
    Route::post('/marker/destroy/{id}', [MarkerController::class, 'destroy'])->name('marker.destroy');
});

require __DIR__.'/auth.php';
