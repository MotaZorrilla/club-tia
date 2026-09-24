<?php

namespace Tests\Feature;

use App\Models\ClassLesson;
use App\Models\Poll;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_portal_index_renders_inertia_with_lessons_and_poll(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Portal/Index')
            ->has('lessons', 5)
            ->has('activePoll')
            ->has('leaderboard')
        );
    }

    public function test_about_page_renders_mission_and_vision(): void
    {
        $response = $this->get('/nosotros');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Portal/About')
            ->has('settings.mision')
            ->has('settings.vision')
        );
    }

    public function test_mission_page_renders_inertia_component(): void
    {
        $response = $this->get('/mision/el-despegue-de-la-ia');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Portal/Lesson')
            ->where('lesson.slug', 'el-despegue-de-la-ia')
        );
    }

    public function test_guest_cannot_vote_in_poll_without_registration(): void
    {
        $poll = Poll::first();

        $response = $this->postJson("/api/polls/{$poll->id}/vote", [
            'option_id' => 'opt_1'
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'requires_auth' => true,
        ]);
    }

    public function test_student_can_register_with_emoji_avatar_and_auto_vote(): void
    {
        $poll = Poll::first();

        $response = $this->postJson('/usuarios/registro', [
            'name' => 'Valeria Tech',
            'grade' => '6° Grado Primaria',
            'avatar' => '🚀',
            'vote_option_id' => 'opt_2',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'user' => [
                'name' => 'Valeria Tech',
                'role' => 'alumno',
                'xp_points' => 115, // 100 welcome + 15 vote
            ]
        ]);

        $this->assertDatabaseHas('users', [
            'name' => 'Valeria Tech',
            'avatar' => '🚀',
            'xp_points' => 115,
        ]);
    }

    public function test_authenticated_user_can_vote_and_earn_xp(): void
    {
        $user = User::where('role', 'alumno')->first();
        session(['current_user_id' => $user->id]);

        $poll = Poll::first();

        $initialXp = $user->xp_points;

        $response = $this->postJson("/api/polls/{$poll->id}/vote", [
            'option_id' => 'opt_1'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'xp_points' => $initialXp + 15,
        ]);
    }

    public function test_dashboard_redirects_unauthenticated_user(): void
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/');
    }

    public function test_dashboard_renders_for_facilitator(): void
    {
        $facilitador = User::where('role', 'facilitador')->first();
        session(['current_user_id' => $facilitador->id]);

        $response = $this->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Index')
            ->where('user.role', 'facilitador')
            ->has('kpis')
            ->has('students')
        );
    }
}
