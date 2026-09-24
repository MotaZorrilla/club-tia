<?php

namespace App\Http\Controllers;

use App\Models\ClassLesson;
use App\Models\ClubSetting;
use App\Models\Poll;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortalController extends Controller
{
    public function index(Request $request)
    {
        $leaderboard = User::where('role', 'alumno')
            ->orderByDesc('xp_points')
            ->take(5)
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'avatar_emoji' => $u->getAvatarEmoji(),
                'grade' => $u->grade,
                'xp_points' => $u->xp_points,
                'level' => $u->level,
                'rank' => $u->rank,
            ]);

        $lessons = ClassLesson::orderBy('island_number')->get();
        $activePoll = Poll::where('is_active', true)->first();
        $pollStats = $activePoll ? $activePoll->getStats() : null;

        $communityStats = [
            'total_explorers' => User::where('role', 'alumno')->count(),
            'completed_missions' => 42,
            'badges_awarded' => 87,
            'active_islands' => 5,
        ];

        return Inertia::render('Portal/Index', [
            'lessons' => $lessons,
            'activePoll' => $activePoll ? [
                'id' => $activePoll->id,
                'question' => $activePoll->question,
                'category' => $activePoll->category,
                'options' => $activePoll->options,
                'stats' => $pollStats,
            ] : null,
            'communityStats' => $communityStats,
            'leaderboard' => $leaderboard,
        ]);
    }

    public function about()
    {
        $userId = session('current_user_id');
        $currentUser = $userId ? User::find($userId) : null;

        $settings = [
            'mision' => ClubSetting::get('mision', 'Acercar la tecnología de la información y la inteligencia artificial a los estudiantes del Colegio Monte Carmelo, transformándolos de consumidores pasivos a creadores de software, entrenadores de algoritmos y pensadores críticos con ética digital.'),
            'vision' => ClubSetting::get('vision', 'Consolidar al Club T.I.A. como el living lab escolar de referencia en pensamiento computacional e inteligencia artificial de Ciudad Guayana, integrando ConTech, modelos de lenguaje (NotebookLM) y desarrollo web bajo un modelo de presupuesto US$ 0 en equipamiento.'),
            'bienvenida' => ClubSetting::get('bienvenida', '¡Bienvenidos al Club T.I.A. de la U. E. Colegio Monte Carmelo! Dejamos de ser consumidores pasivos de pantallas para convertirnos en creadores de software.'),
            'valores' => json_decode(ClubSetting::get('valores', '[]'), true),
        ];

        return Inertia::render('Portal/About', [
            'settings' => $settings,
            'isFacilitador' => $currentUser && $currentUser->role === 'facilitador',
        ]);
    }

    public function lesson($slug)
    {
        $lesson = ClassLesson::where('slug', $slug)->firstOrFail();
        $allLessons = ClassLesson::orderBy('island_number')->get(['id', 'slug', 'title', 'island_number', 'icon', 'is_unlocked']);

        return Inertia::render('Portal/Lesson', [
            'lesson' => $lesson,
            'allLessons' => $allLessons,
        ]);
    }

    public function completeLesson(Request $request, $slug)
    {
        $userId = session('current_user_id');
        $user = $userId ? User::find($userId) : null;

        if (!$user) {
            return response()->json([
                'success' => false,
                'requires_auth' => true,
                'message' => '¡Debes registrarte para guardar tu progreso de misión y ganar XP!',
            ], 401);
        }

        $lesson = ClassLesson::where('slug', $slug)->firstOrFail();

        // Award XP
        $xpToAdd = $lesson->xp_reward;
        $user->xp_points += $xpToAdd;

        // Add badge if not already present
        $badges = $user->badges ?? [];
        $badgeSlug = 'badge_mision_' . $lesson->island_number;
        if (!in_array($badgeSlug, $badges)) {
            $badges[] = $badgeSlug;
            $user->badges = $badges;
        }

        // Calculate Level
        $user->level = max(1, floor($user->xp_points / 250) + 1);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => '¡Misión completada! Ganaste +' . $xpToAdd . ' XP 🌟',
            'new_xp' => $user->xp_points,
            'new_level' => $user->level,
            'badge' => $lesson->badge_name,
        ]);
    }
}
