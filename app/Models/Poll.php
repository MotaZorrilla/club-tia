<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    protected $fillable = [
        'question',
        'category',
        'options',
        'is_active',
    ];

    protected $casts = [
        'options' => 'array',
        'is_active' => 'boolean',
    ];

    public function votes(): HasMany
    {
        return $this->hasMany(PollVote::class);
    }

    /**
     * Get real-time stats with vote counts and percentages for each option
     */
    public function getStats(): array
    {
        $votes = $this->votes;
        $totalVotes = $votes->count();
        $counts = [];

        foreach ($this->options as $opt) {
            $counts[$opt['id']] = 0;
        }

        foreach ($votes as $vote) {
            if (isset($counts[$vote->option_id])) {
                $counts[$vote->option_id]++;
            }
        }

        $results = [];
        foreach ($this->options as $opt) {
            $cnt = $counts[$opt['id']] ?? 0;
            $percentage = $totalVotes > 0 ? round(($cnt / $totalVotes) * 100, 1) : 0;
            $results[] = [
                'id' => $opt['id'],
                'text' => $opt['text'],
                'emoji' => $opt['emoji'] ?? '📊',
                'color' => $opt['color'] ?? '#3b82f6',
                'votes' => $cnt,
                'percentage' => $percentage,
            ];
        }

        return [
            'id' => $this->id,
            'question' => $this->question,
            'category' => $this->category,
            'total_votes' => $totalVotes,
            'options' => $results,
            'is_active' => $this->is_active,
        ];
    }
}
