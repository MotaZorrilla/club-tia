<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function switchUser($id)
    {
        $user = User::findOrFail($id);
        session(['current_user_id' => $user->id]);

        return back()->with('info', "Sesión cambiada a: {$user->name} ({$user->role})");
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'role' => 'required|in:alumno,colaborador,facilitador',
            'grade' => 'nullable|string|max:50',
            'avatar' => 'required|string',
        ]);

        $email = strtolower(str_replace(' ', '', $request->name)) . rand(10, 99) . '@montecarmelo.edu.ve';

        $user = User::create([
            'name' => $request->name,
            'email' => $email,
            'password' => Hash::make('carmelo2026'),
            'role' => $request->role,
            'grade' => $request->grade ?? '5° Primaria',
            'avatar' => $request->avatar,
            'xp_points' => 100,
            'level' => 1,
            'badges' => ['bienvenida_tia'],
        ]);

        session(['current_user_id' => $user->id]);

        return back()->with('success', "¡Bienvenido al Club T.I.A., {$user->name}! Has ganado tus primeros 100 XP 🌟");
    }
}
