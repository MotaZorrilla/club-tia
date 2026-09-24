<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\PollVote;
use App\Models\User;
use Illuminate\Http\Request;

class PollController extends Controller
{
    public function getActivePoll()
    {
        $poll = Poll::where('is_active', true)->first();
        if (!$poll) {
            return response()->json(['error' => 'No active poll'], 404);
        }

        return response()->json($poll->getStats());
    }

    public function vote(Request $request, $id)
    {
        $request->validate([
            'option_id' => 'required|string',
        ]);

        $poll = Poll::findOrFail($id);
        $userId = session('current_user_id');
        $user = $userId ? User::find($userId) : null;

        if (!$user) {
            return response()->json([
                'success' => false,
                'requires_auth' => true,
                'message' => '¡Debes identificarte o registrarte para participar en la encuesta escolar! 🚀',
            ], 401);
        }

        // Check if user already voted in this poll
        $hasVoted = PollVote::where('poll_id', $poll->id)
            ->where(function($q) use ($user, $request) {
                $q->where('user_id', $user->id)
                  ->orWhere('ip_address', $request->ip());
            })->exists();

        PollVote::create([
            'poll_id' => $poll->id,
            'option_id' => $request->option_id,
            'user_id' => $user->id,
            'voter_name' => $user->name,
            'ip_address' => $request->ip(),
        ]);

        // Award 15 XP if first time or participation reward
        $xpEarned = 15;
        $user->xp_points += $xpEarned;
        $user->level = max(1, floor($user->xp_points / 250) + 1);
        
        $badges = $user->badges ?? [];
        if (!in_array('votante_activo', $badges)) {
            $badges[] = 'votante_activo';
            $user->badges = $badges;
        }
        $user->save();

        return response()->json([
            'success' => true,
            'message' => "¡Voto registrado en tiempo real! +{$xpEarned} XP ganados ⭐",
            'stats' => $poll->getStats(),
            'user_xp' => $user->xp_points,
            'user_level' => $user->level,
        ]);
    }

    public function reset(Request $request, $id)
    {
        $poll = Poll::findOrFail($id);
        $poll->votes()->delete();

        // Seed 1 vote per option for clean preview
        foreach ($poll->options as $opt) {
            PollVote::create([
                'poll_id' => $poll->id,
                'option_id' => $opt['id'],
                'voter_name' => 'Voto de Inicio',
                'ip_address' => '127.0.0.1',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Encuesta reiniciada correctamente',
            'stats' => $poll->getStats(),
        ]);
    }

    public function updateQuestion(Request $request, $id)
    {
        $request->validate([
            'question' => 'required|string|max:255',
        ]);

        $poll = Poll::findOrFail($id);
        $poll->update([
            'question' => $request->question,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Pregunta de la encuesta actualizada',
            'stats' => $poll->getStats(),
        ]);
    }
}
