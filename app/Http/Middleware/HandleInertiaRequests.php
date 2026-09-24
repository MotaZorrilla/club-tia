<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $userId = session('current_user_id');
        $currentUser = $userId ? \App\Models\User::find($userId) : null;

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $currentUser ? [
                    'id' => $currentUser->id,
                    'name' => $currentUser->name,
                    'email' => $currentUser->email,
                    'role' => $currentUser->role,
                    'grade' => $currentUser->grade,
                    'section' => $currentUser->section,
                    'specialty' => $currentUser->specialty,
                    'avatar' => $currentUser->avatar,
                    'avatar_emoji' => $currentUser->getAvatarEmoji(),
                    'xp_points' => $currentUser->xp_points,
                    'level' => $currentUser->level,
                    'rank' => $currentUser->rank,
                    'badges' => $currentUser->badges ?? [],
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'available_avatars' => \App\Models\User::getAvailableAvatars(),
        ];
    }
}
