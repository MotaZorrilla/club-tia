<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\PortalController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Portal Principal & Misión/Visión
Route::get('/', [PortalController::class, 'index'])->name('portal.index');
Route::get('/nosotros', [PortalController::class, 'about'])->name('portal.about');

// Misiones / Lecciones
Route::get('/mision/{slug}', [PortalController::class, 'lesson'])->name('portal.lesson');
Route::post('/mision/{slug}/completar', [PortalController::class, 'completeLesson'])->name('portal.completeLesson');

// Dashboards por Rol
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::post('/dashboard/mision-vision', [DashboardController::class, 'updateClubSettings'])->name('dashboard.updateClubSettings');
Route::post('/dashboard/award-xp', [DashboardController::class, 'awardXp'])->name('dashboard.awardXp');

// Autenticación y Perfil de Usuario
Route::post('/usuarios/registro', [UserController::class, 'register'])->name('users.register');
Route::post('/usuarios/avatar', [UserController::class, 'updateAvatar'])->name('users.avatar');
Route::post('/usuarios/cambiar/{id}', [UserController::class, 'switchUser'])->name('users.switch');
Route::post('/usuarios/logout', [UserController::class, 'logout'])->name('users.logout');

// Live Polling API (Encuestas en Tiempo Real)
Route::get('/api/polls/active', [PollController::class, 'getActivePoll'])->name('polls.active');
Route::post('/api/polls/{id}/vote', [PollController::class, 'vote'])->name('polls.vote');
Route::post('/api/polls/{id}/reset', [PollController::class, 'reset'])->name('polls.reset');
Route::post('/api/polls/{id}/question', [PollController::class, 'updateQuestion'])->name('polls.question');

// Sitemap XML Dinámico para Motores de Búsqueda
Route::get('/sitemap.xml', function () {
    $lessons = \App\Models\ClassLesson::orderBy('island_number')->get();
    $baseUrl = rtrim(url('/'), '/');

    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

    // Página Principal (Home)
    $xml .= '<url>';
    $xml .= '<loc>' . htmlspecialchars($baseUrl . '/') . '</loc>';
    $xml .= '<lastmod>' . date('Y-m-d') . '</lastmod>';
    $xml .= '<changefreq>daily</changefreq>';
    $xml .= '<priority>1.0</priority>';
    $xml .= '</url>';

    // Misión & Visión
    $xml .= '<url>';
    $xml .= '<loc>' . htmlspecialchars($baseUrl . '/nosotros') . '</loc>';
    $xml .= '<lastmod>' . date('Y-m-d') . '</lastmod>';
    $xml .= '<changefreq>weekly</changefreq>';
    $xml .= '<priority>0.8</priority>';
    $xml .= '</url>';

    // Misiones ERCA
    foreach ($lessons as $lesson) {
        $xml .= '<url>';
        $xml .= '<loc>' . htmlspecialchars($baseUrl . '/mision/' . $lesson->slug) . '</loc>';
        $xml .= '<lastmod>' . $lesson->updated_at->format('Y-m-d') . '</lastmod>';
        $xml .= '<changefreq>monthly</changefreq>';
        $xml .= '<priority>0.7</priority>';
        $xml .= '</url>';
    }

    $xml .= '</urlset>';

    return response($xml, 200)->header('Content-Type', 'application/xml');
})->name('sitemap');

