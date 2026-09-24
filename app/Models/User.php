<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'grade',
        'avatar',
        'xp_points',
        'level',
        'badges',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'badges' => 'array',
            'xp_points' => 'integer',
            'level' => 'integer',
        ];
    }

    public function isFacilitador(): bool
    {
        return $this->role === 'facilitador';
    }

    public function isColaborador(): bool
    {
        return $this->role === 'colaborador';
    }

    public function isAlumno(): bool
    {
        return $this->role === 'alumno';
    }

    public function getAvatarEmoji(): string
    {
        return match ($this->avatar) {
            'robot' => '🤖',
            'astronaut' => '🚀',
            'scientist' => '🔬',
            'coder' => '💻',
            'ninja' => '🥷',
            'gamer' => '🎮',
            default => '🤖',
        };
    }
}
