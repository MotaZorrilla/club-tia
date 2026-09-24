<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollVote;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function switchUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        session(['current_user_id' => $user->id]);

        return redirect()->route('dashboard')->with('success', "Bienvenido de vuelta, {$user->name} ({$user->role})");
    }

    public function login(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'password' => 'required|string',
        ]);

        $user = User::findOrFail($request->user_id);

        if (!Hash::check($request->password, $user->password)) {
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Clave de acceso incorrecta. Verifica tu contraseña escolar.',
                ], 422);
            }

            return redirect()->back()->withErrors(['password' => 'Clave de acceso incorrecta.']);
        }

        session(['current_user_id' => $user->id]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => "¡Bienvenido, {$user->name}!",
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'grade' => $user->grade,
                    'section' => $user->section,
                    'specialty' => $user->specialty,
                    'avatar_emoji' => $user->getAvatarEmoji(),
                    'xp_points' => $user->xp_points,
                    'level' => $user->level,
                ],
            ]);
        }

        return redirect()->route('dashboard')->with('success', "¡Bienvenido de vuelta, {$user->name}!");
    }

    public function logout(Request $request)
    {
        session()->forget('current_user_id');

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Has cerrado sesión.',
            ]);
        }

        return redirect()->route('portal.index')->with('info', 'Has cerrado sesión.');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'role' => 'nullable|string|in:alumno,colaborador',
            'grade' => 'nullable|string|max:50',
            'section' => 'nullable|string|max:20',
            'specialty' => 'nullable|string|max:100',
            'avatar' => 'required|string',
            'password' => 'nullable|string|min:4',
            'vote_option_id' => 'nullable|string',
        ]);

        $role = $request->role === 'colaborador' ? 'colaborador' : 'alumno';
        $sanitizedName = preg_replace('/[^a-zA-Z0-9]/', '', $request->name);
        $prefix = $role === 'colaborador' ? 'docente' : 'explorador';
        $email = strtolower($sanitizedName ?: $prefix) . rand(100, 999) . '@montecarmelo.edu.ve';
        $password = $request->filled('password') ? $request->password : 'carmelo2026';

        $user = User::create([
            'name' => trim($request->name),
            'email' => $email,
            'password' => Hash::make($password),
            'role' => $role,
            'grade' => $role === 'colaborador' ? ($request->grade ?? 'Docente / Colaborador') : ($request->grade ?? '5° Grado Primaria'),
            'section' => $role === 'colaborador' ? null : ($request->section ?? 'A'),
            'specialty' => $role === 'colaborador' ? ($request->specialty ?? 'Docencia General') : null,
            'avatar' => $request->avatar ?: ($role === 'colaborador' ? '👩‍🏫' : '🤖'),
            'xp_points' => $role === 'colaborador' ? 200 : 100,
            'level' => 1,
            'badges' => $role === 'colaborador' ? ['bienvenida_docente'] : ['bienvenida_tia'],
        ]);

        session(['current_user_id' => $user->id]);

        $voteStats = null;
        $votedMessage = '';

        // If registration was triggered from the live poll, record the vote immediately!
        if ($request->filled('vote_option_id')) {
            $activePoll = Poll::where('is_active', true)->first();
            if ($activePoll) {
                PollVote::create([
                    'poll_id' => $activePoll->id,
                    'option_id' => $request->vote_option_id,
                    'user_id' => $user->id,
                    'voter_name' => $user->name,
                    'ip_address' => $request->ip(),
                ]);

                $user->xp_points += 15;
                $user->badges = array_merge($user->badges, ['votante_activo']);
                $user->save();

                $voteStats = $activePoll->getStats();
                $votedMessage = ' y tu voto escolar ha sido registrado (+15 XP)';
            }
        }

        $welcomeSubject = $role === 'colaborador' ? "Prof. {$user->name}" : $user->name;
        $successMsg = "¡Bienvenido al Club T.I.A., {$welcomeSubject}! Has ganado tus primeros {$user->xp_points} XP{$votedMessage} 🌟";

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => $successMsg,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'grade' => $user->grade,
                    'section' => $user->section,
                    'specialty' => $user->specialty,
                    'avatar' => $user->avatar,
                    'avatar_emoji' => $user->getAvatarEmoji(),
                    'xp_points' => $user->xp_points,
                    'level' => $user->level,
                ],
                'stats' => $voteStats,
            ]);
        }

        return redirect()->back()->with('success', $successMsg);
    }

    public function updateAvatar(Request $request)
    {
        $userId = session('current_user_id');
        $user = $userId ? User::find($userId) : null;

        if (!$user) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        $request->validate([
            'avatar' => 'required|string',
        ]);

        $user->avatar = $request->avatar;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Avatar actualizado con éxito ' . $user->getAvatarEmoji(),
            'avatar' => $user->avatar,
            'avatar_emoji' => $user->getAvatarEmoji(),
        ]);
    }
}
