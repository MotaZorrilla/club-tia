<?php

use App\Http\Controllers\PortalController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Portal Principal
Route::get('/', [PortalController::class, 'index'])->name('portal.index');

// Misiones / Lecciones
Route::get('/mision/{slug}', [PortalController::class, 'lesson'])->name('portal.lesson');
Route::post('/mision/{slug}/completar', [PortalController::class, 'completeLesson'])->name('portal.completeLesson');

// Gestión de Usuarios (Demo Switcher y Registro)
Route::post('/usuarios/cambiar/{id}', [UserController::class, 'switchUser'])->name('users.switch');
Route::post('/usuarios/registro', [UserController::class, 'register'])->name('users.register');

// Live Polling API (Encuestas en Tiempo Real)
Route::get('/api/polls/active', [PollController::class, 'getActivePoll'])->name('polls.active');
Route::post('/api/polls/{id}/vote', [PollController::class, 'vote'])->name('polls.vote');
Route::post('/api/polls/{id}/reset', [PollController::class, 'reset'])->name('polls.reset');
