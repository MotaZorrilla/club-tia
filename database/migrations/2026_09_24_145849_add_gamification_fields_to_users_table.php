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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('alumno'); // alumno, colaborador, facilitador
            $table->string('grade')->nullable(); // 4° Primaria, 5° Primaria, 1° Año, etc.
            $table->string('avatar')->default('robot'); // robot, astronaut, scientist, coder, ninja
            $table->integer('xp_points')->default(100);
            $table->integer('level')->default(1);
            $table->json('badges')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'grade', 'avatar', 'xp_points', 'level', 'badges']);
        });
    }
};
