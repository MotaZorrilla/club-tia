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
        Schema::create('polls', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->string('category')->default('aula');
            $table->json('options'); // [['id' => 'opt_1', 'text' => '...', 'emoji' => '...', 'color' => '...']]
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('poll_votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poll_id')->constrained('polls')->onDelete('cascade');
            $table->string('option_id');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('voter_name')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poll_votes');
        Schema::dropIfExists('polls');
    }
};
