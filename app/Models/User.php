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
        if (empty($this->avatar)) {
            return '🤖';
        }

        // If avatar is already stored directly as an emoji, return it
        if (mb_strlen($this->avatar, 'UTF-8') <= 4) {
            return $this->avatar;
        }

        return match ($this->avatar) {
            'robot' => '🤖',
            'astronaut' => '🚀',
            'brain' => '🧠',
            'scientist' => '🔬',
            'coder' => '💻',
            'ninja' => '🥷',
            'gamer' => '🎮',
            'cat' => '🐱',
            'fox' => '🦊',
            'bolt' => '⚡',
            'artist' => '🎨',
            'star' => '🌟',
            'cyborg' => '🦾',
            'owl' => '🦉',
            'dino' => '🦖',
            'wizard' => '🧙‍♂️',
            default => '🤖',
        };
    }

    public static function getAvailableAvatars(): array
    {
        return [
            ['emoji' => '🤖', 'name' => 'Robot'],
            ['emoji' => '🚀', 'name' => 'Cohete'],
            ['emoji' => '🧠', 'name' => 'Cerebro'],
            ['emoji' => '🐱', 'name' => 'Gato Hacker'],
            ['emoji' => '🦊', 'name' => 'Zorro'],
            ['emoji' => '⚡', 'name' => 'Rayo Tech'],
            ['emoji' => '🎨', 'name' => 'Artista Digital'],
            ['emoji' => '🔬', 'name' => 'Científico'],
            ['emoji' => '👾', 'name' => 'Arcade Gamer'],
            ['emoji' => '🌟', 'name' => 'Estrella'],
            ['emoji' => '🦾', 'name' => 'Ciborg'],
            ['emoji' => '💻', 'name' => 'Ingeniero'],
            ['emoji' => '🦉', 'name' => 'Búho Sabio'],
            ['emoji' => '🦖', 'name' => 'Dino Bot'],
            ['emoji' => '🧙‍♂️', 'name' => 'Mago Digital'],
        ];
    }
}
