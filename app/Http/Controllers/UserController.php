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
            'login' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
            'password' => 'required|string',
        ]);

        $user = null;

        if ($request->filled('user_id')) {
            $user = User::find($request->user_id);
        } elseif ($request->filled('login')) {
            $identifier = trim($request->login);
            $user = User::whereRaw('LOWER(email) = ?', [strtolower($identifier)])
                ->orWhereRaw('LOWER(name) = ?', [strtolower($identifier)])
                ->first();
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            $errMsg = 'Credenciales incorrectas. Verifica tu usuario/correo y contraseña escolar.';
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => $errMsg,
                ], 422);
            }

            return redirect()->back()->withErrors(['password' => $errMsg]);
        }

        \Illuminate\Support\Facades\Auth::login($user, true);
        session(['current_user_id' => $user->id]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => "¡Bienvenido, {$user->name}!",
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
                    'badges' => $user->badges ?? [],
                ],
            ]);
        }

        return redirect()->route('dashboard')->with('success', "¡Bienvenido de vuelta, {$user->name}!");
    }

    public function logout(Request $request)
    {
        \Illuminate\Support\Facades\Auth::logout();
        session()->forget('current_user_id');
        $request->session()->invalidate();
        $request->session()->regenerateToken();

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
            'email' => 'nullable|string|max:150',
            'role' => 'nullable|string|in:alumno,colaborador',
            'grade' => 'nullable|string|max:50',
            'section' => 'nullable|string|max:20',
            'specialty' => 'nullable|string|max:100',
            'avatar' => 'required|string',
            'password' => 'nullable|string|min:4',
            'vote_option_id' => 'nullable|string',
        ]);

        $role = $request->role === 'colaborador' ? 'colaborador' : 'alumno';
        $rawEmail = trim($request->input('email', ''));

        // If email provided has no '@', append escolar domain
        if (!empty($rawEmail)) {
            if (!str_contains($rawEmail, '@')) {
                $rawEmail = strtolower(preg_replace('/[^a-zA-Z0-9._-]/', '', $rawEmail)) . '@montecarmelo.edu.ve';
            }
        } else {
            $sanitizedName = preg_replace('/[^a-zA-Z0-9]/', '', $request->name);
            $prefix = $role === 'colaborador' ? 'docente' : 'explorador';
            $rawEmail = strtolower($sanitizedName ?: $prefix) . rand(100, 999) . '@montecarmelo.edu.ve';
        }

        // Check if email already registered
        $existing = User::where('email', $rawEmail)->first();
        if ($existing) {
            $msg = 'Este correo o usuario ya se encuentra registrado. Inicia sesión con tu clave.';
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json(['success' => false, 'message' => $msg], 422);
            }
            return redirect()->back()->withErrors(['email' => $msg]);
        }

        $passwordToHash = $request->filled('password') ? $request->password : 'carmelo2026';

        $user = User::create([
            'name' => trim($request->name),
            'email' => $rawEmail,
            'password' => Hash::make($passwordToHash),
            'role' => $role,
            'grade' => $role === 'colaborador' ? ($request->grade ?? 'Docente / Colaborador') : ($request->grade ?? '5° Grado Primaria'),
            'section' => $role === 'colaborador' ? null : ($request->section ?? 'A'),
            'specialty' => $role === 'colaborador' ? ($request->specialty ?? 'Docencia General') : null,
            'avatar' => $request->avatar ?: ($role === 'colaborador' ? '👩‍🏫' : '🤖'),
            'xp_points' => $role === 'colaborador' ? 200 : 100,
            'level' => 1,
            'badges' => $role === 'colaborador' ? ['bienvenida_docente'] : ['bienvenida_tia'],
        ]);

        \Illuminate\Support\Facades\Auth::login($user, true);
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
                    'email' => $user->email,
                    'role' => $user->role,
                    'grade' => $user->grade,
                    'section' => $user->section,
                    'specialty' => $user->specialty,
                    'avatar' => $user->avatar,
                    'avatar_emoji' => $user->getAvatarEmoji(),
                    'xp_points' => $user->xp_points,
                    'level' => $user->level,
                    'badges' => $user->badges ?? [],
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
