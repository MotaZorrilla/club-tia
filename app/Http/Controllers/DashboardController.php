<?php

namespace App\Http\Controllers;

use App\Models\ClassLesson;
use App\Models\ClubSetting;
use App\Models\Poll;
use App\Models\PollVote;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = session('current_user_id');
        $user = $userId ? User::find($userId) : null;

        if (!$user) {
            $registeredUsers = User::orderByDesc('xp_points')->get()->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'role' => $u->role,
                    'grade' => $u->grade,
                    'section' => $u->section,
                    'specialty' => $u->specialty,
                    'avatar_emoji' => $u->getAvatarEmoji(),
                    'xp_points' => $u->xp_points,
                    'level' => $u->level,
                    'rank' => $u->rank,
                ];
            });

            return Inertia::render('Dashboard/Login', [
                'users' => $registeredUsers,
            ]);
        }

        $allUsers = User::orderByDesc('xp_points')->get()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'grade' => $u->grade,
                'section' => $u->section,
                'specialty' => $u->specialty,
                'avatar' => $u->avatar,
                'avatar_emoji' => $u->getAvatarEmoji(),
                'xp_points' => $u->xp_points,
                'level' => $u->level,
                'rank' => $u->rank,
                'badges' => $u->badges ?? [],
                'created_at' => $u->created_at->format('d/m/Y'),
            ];
        });

        $activePoll = Poll::where('is_active', true)->first();
        $pollStats = $activePoll ? $activePoll->getStats() : null;

        $settings = [
            'mision' => ClubSetting::get('mision', 'Acercar la tecnología y la inteligencia artificial a los estudiantes del Colegio Monte Carmelo.'),
            'vision' => ClubSetting::get('vision', 'Consolidar al Club T.I.A. como el living lab escolar de referencia en Ciudad Guayana.'),
            'bienvenida' => ClubSetting::get('bienvenida', '¡Bienvenidos al Club T.I.A.! Dejamos de ser consumidores para ser creadores.'),
            'valores' => json_decode(ClubSetting::get('valores', '[]'), true),
        ];

        $lessons = ClassLesson::orderBy('island_number')->get();

        $kpis = [
            'total_students' => User::where('role', 'alumno')->count(),
            'total_votes' => PollVote::count(),
            'total_xp_awarded' => User::sum('xp_points'),
            'total_lessons' => ClassLesson::count(),
        ];

        return Inertia::render('Dashboard/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'grade' => $user->grade,
                'section' => $user->section,
                'specialty' => $user->specialty,
                'avatar' => $user->avatar,
                'avatar_emoji' => $user->getAvatarEmoji(),
                'xp_points' => $user->xp_points,
                'level' => $user->level,
                'rank' => $user->rank,
                'badges' => $user->badges ?? [],
            ],
            'kpis' => $kpis,
            'students' => $allUsers,
            'activePoll' => $activePoll ? [
                'id' => $activePoll->id,
                'question' => $activePoll->question,
                'options' => $activePoll->options,
                'stats' => $pollStats,
            ] : null,
            'settings' => $settings,
            'lessons' => $lessons,
        ]);
    }

    public function updateClubSettings(Request $request)
    {
        $userId = session('current_user_id');
        $user = $userId ? User::find($userId) : null;

        if (!$user || $user->role !== 'facilitador') {
            return response()->json(['error' => 'Solo el Facilitador puede editar la información institucional.'], 403);
        }

        $request->validate([
            'mision' => 'required|string',
            'vision' => 'required|string',
            'bienvenida' => 'nullable|string',
            'valores' => 'nullable|array',
        ]);

        ClubSetting::set('mision', $request->mision, $user->id);
        ClubSetting::set('vision', $request->vision, $user->id);

        if ($request->has('bienvenida')) {
            ClubSetting::set('bienvenida', $request->bienvenida, $user->id);
        }

        if ($request->has('valores')) {
            ClubSetting::set('valores', json_encode($request->valores), $user->id);
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => '¡Misión, Visión e Ideario Institucional actualizados con éxito! 🎯',
            ]);
        }

        return redirect()->back()->with('success', '¡Misión, Visión e Ideario Institucional actualizados con éxito!');
    }

    public function awardXp(Request $request)
    {
        $currentUserId = session('current_user_id');
        $currentUser = $currentUserId ? User::find($currentUserId) : null;

        if (!$currentUser || !in_array($currentUser->role, ['facilitador', 'colaborador'])) {
            return response()->json(['error' => 'No autorizado para otorgar puntos de mérito.'], 403);
        }

        $request->validate([
            'student_id' => 'required|exists:users,id',
            'xp_amount' => 'required|integer|min:5|max:500',
            'reason' => 'required|string|max:200',
        ]);

        $student = User::findOrFail($request->student_id);
        $student->xp_points += $request->xp_amount;
        $student->level = max(1, floor($student->xp_points / 250) + 1);
        $student->save();

        return response()->json([
            'success' => true,
            'message' => "¡+{$request->xp_amount} XP otorgados a {$student->name} por: {$request->reason}! ⭐",
            'student_id' => $student->id,
            'new_xp' => $student->xp_points,
            'new_level' => $student->level,
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        $currentUserId = session('current_user_id');
        $currentUser = $currentUserId ? User::find($currentUserId) : null;

        if (!$currentUser || $currentUser->role !== 'facilitador') {
            return response()->json(['error' => 'Solo el Facilitador puede modificar los perfiles y méritos del Club.'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:100',
            'role' => 'required|string|in:alumno,colaborador,facilitador',
            'grade' => 'nullable|string|max:50',
            'section' => 'nullable|string|max:20',
            'specialty' => 'nullable|string|max:100',
            'avatar' => 'required|string',
            'xp_points' => 'required|integer|min:0',
            'password' => 'nullable|string|min:4',
        ]);

        $targetUser = User::findOrFail($id);
        $targetUser->name = trim($request->name);
        $targetUser->role = $request->role;
        $targetUser->grade = $request->grade;
        $targetUser->section = $request->section;
        $targetUser->specialty = $request->specialty;
        $targetUser->avatar = $request->avatar;
        $targetUser->xp_points = (int) $request->xp_points;
        $targetUser->level = max(1, floor($targetUser->xp_points / 250) + 1);

        if ($request->filled('password')) {
            $targetUser->password = Hash::make($request->password);
        }

        $targetUser->save();

        $userData = [
            'id' => $targetUser->id,
            'name' => $targetUser->name,
            'email' => $targetUser->email,
            'role' => $targetUser->role,
            'grade' => $targetUser->grade,
            'section' => $targetUser->section,
            'specialty' => $targetUser->specialty,
            'avatar' => $targetUser->avatar,
            'avatar_emoji' => $targetUser->getAvatarEmoji(),
            'xp_points' => $targetUser->xp_points,
            'level' => $targetUser->level,
            'rank' => $targetUser->rank,
            'badges' => $targetUser->badges ?? [],
            'created_at' => $targetUser->created_at->format('d/m/Y'),
        ];

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => "¡Perfil de {$targetUser->name} actualizado con éxito!",
                'user' => $userData,
            ]);
        }

        return redirect()->back()->with('success', "¡Perfil de {$targetUser->name} actualizado con éxito!");
    }
}
