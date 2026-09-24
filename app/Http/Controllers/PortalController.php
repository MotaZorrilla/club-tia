<?php

namespace App\Http\Controllers;

use App\Models\ClassLesson;
use App\Models\Poll;
use App\Models\User;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function index(Request $request)
    {
        $userId = session('current_user_id', 1);
        $currentUser = User::find($userId) ?? User::first();
        $allUsers = User::all();

        $lessons = ClassLesson::orderBy('island_number')->get();
        $activePoll = Poll::where('is_active', true)->first();
        $pollStats = $activePoll ? $activePoll->getStats() : null;

        $communityStats = [
            'total_explorers' => User::where('role', 'alumno')->count() + 18, // 20 estimados iniciales
            'completed_missions' => 42,
            'badges_awarded' => 87,
            'active_islands' => 5,
        ];

        return view('portal.index', compact('currentUser', 'allUsers', 'lessons', 'activePoll', 'pollStats', 'communityStats'));
    }

    public function lesson($slug)
    {
        $userId = session('current_user_id', 1);
        $currentUser = User::find($userId) ?? User::first();
        $allUsers = User::all();

        $lesson = ClassLesson::where('slug', $slug)->firstOrFail();
        $allLessons = ClassLesson::orderBy('island_number')->get();

        return view('portal.lesson', compact('lesson', 'currentUser', 'allUsers', 'allLessons'));
    }

    public function completeLesson(Request $request, $slug)
    {
        $userId = session('current_user_id', 1);
        $user = User::find($userId) ?? User::first();
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

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => '¡Misión completada! Ganaste +' . $xpToAdd . ' XP 🌟',
                'new_xp' => $user->xp_points,
                'new_level' => $user->level,
                'badge' => $lesson->badge_name,
            ]);
        }

        return back()->with('success', '¡Misión completada! Ganaste +' . $xpToAdd . ' XP');
    }
}
