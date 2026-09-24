<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('class_lessons', function (Blueprint $table) {
            $table->id();
            $table->integer('island_number')->default(1);
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('subtitle');
            $table->string('icon')->default('🚀');
            $table->string('badge_name')->default('Insignia de Explorador');
            $table->boolean('is_unlocked')->default(false);
            $table->integer('xp_reward')->default(50);
            $table->integer('duration_minutes')->default(45);
            $table->text('description');
            $table->json('content')->nullable(); // Mini-games, activities, questions
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_lessons');
    }
};
