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
        $userId = session('current_user_id', 1);
        $user = User::find($userId);

        PollVote::create([
            'poll_id' => $poll->id,
            'option_id' => $request->option_id,
            'user_id' => $user ? $user->id : null,
            'voter_name' => $user ? $user->name : 'Explorador Anónimo',
            'ip_address' => $request->ip(),
        ]);

        // Award 15 XP to user for voting!
        if ($user) {
            $user->xp_points += 15;
            $user->level = max(1, floor($user->xp_points / 250) + 1);
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => '¡Voto registrado en tiempo real! +15 XP ganados ⭐',
            'stats' => $poll->getStats(),
            'user_xp' => $user ? $user->xp_points : null,
        ]);
    }

    public function reset(Request $request, $id)
    {
        $poll = Poll::findOrFail($id);
        $poll->votes()->delete();

        // Seed 1 vote per option for a clean preview
        foreach ($poll->options as $opt) {
            PollVote::create([
                'poll_id' => $poll->id,
                'option_id' => $opt['id'],
                'voter_name' => 'Demo Seed',
                'ip_address' => '127.0.0.1',
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Encuesta reiniciada para la demo',
            'stats' => $poll->getStats(),
        ]);
    }
}
