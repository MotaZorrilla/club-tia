<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClubSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'updated_by',
    ];

    /**
     * Get a setting by key, or return default
     */
    public static function get(string $key, ?string $default = null): ?string
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting by key
     */
    public static function set(string $key, ?string $value, ?int $userId = null): static
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'updated_by' => $userId]
        );
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
