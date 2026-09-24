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

    public function logout(Request $request)
    {
        session()->forget('current_user_id');

        return redirect()->route('portal.index')->with('info', 'Has cerrado sesión.');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'grade' => 'nullable|string|max:50',
            'avatar' => 'required|string',
            'vote_option_id' => 'nullable|string',
        ]);

        $sanitizedName = preg_replace('/[^a-zA-Z0-9]/', '', $request->name);
        $email = strtolower($sanitizedName ?: 'explorador') . rand(100, 999) . '@montecarmelo.edu.ve';

        $user = User::create([
            'name' => trim($request->name),
            'email' => $email,
            'password' => Hash::make('carmelo2026'),
            'role' => 'alumno',
            'grade' => $request->grade ?? '5° Grado Primaria',
            'avatar' => $request->avatar ?: '🤖',
            'xp_points' => 100,
            'level' => 1,
            'badges' => ['bienvenida_tia'],
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

        $successMsg = "¡Bienvenido al Club T.I.A., {$user->name}! Has ganado tus primeros {$user->xp_points} XP{$votedMessage} 🌟";

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => $successMsg,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'role' => $user->role,
                    'grade' => $user->grade,
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
