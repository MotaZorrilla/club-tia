<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassLesson extends Model
{
    protected $fillable = [
        'island_number',
        'slug',
        'title',
        'subtitle',
        'icon',
        'badge_name',
        'is_unlocked',
        'xp_reward',
        'duration_minutes',
        'description',
        'content',
    ];

    protected $casts = [
        'is_unlocked' => 'boolean',
        'content' => 'array',
        'island_number' => 'integer',
        'xp_reward' => 'integer',
        'duration_minutes' => 'integer',
    ];
}
