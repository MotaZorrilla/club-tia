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

    public function test_dashboard_renders_login_for_unauthenticated_user(): void
    {
        $response = $this->get('/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard/Login')
            ->has('users')
        );
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

    public function test_sitemap_xml_returns_valid_urls(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml');
        $response->assertSee('/nosotros');
        $response->assertSee('/mision/el-despegue-de-la-ia');
    }

    public function test_facilitator_can_update_user_profile_and_xp(): void
    {
        $facilitator = User::where('role', 'facilitador')->first();
        session(['current_user_id' => $facilitator->id]);

        $student = User::where('role', 'alumno')->first();

        $response = $this->postJson("/dashboard/usuarios/{$student->id}/actualizar", [
            'name' => 'Sofía Editada',
            'role' => 'alumno',
            'grade' => '6° Grado Primaria',
            'section' => 'B',
            'specialty' => null,
            'avatar' => '🌟',
            'xp_points' => 750,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'user' => [
                'name' => 'Sofía Editada',
                'grade' => '6° Grado Primaria',
                'section' => 'B',
                'xp_points' => 750,
                'level' => 4, // floor(750/250) + 1 = 4
            ]
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $student->id,
            'name' => 'Sofía Editada',
            'section' => 'B',
            'xp_points' => 750,
        ]);
    }

    public function test_non_facilitator_cannot_update_user(): void
    {
        $student = User::where('role', 'alumno')->first();
        session(['current_user_id' => $student->id]);

        $otherStudent = User::where('role', 'alumno')->where('id', '!=', $student->id)->first();

        $response = $this->postJson("/dashboard/usuarios/{$otherStudent->id}/actualizar", [
            'name' => 'Hacked Name',
            'role' => 'facilitador',
            'avatar' => '💻',
            'xp_points' => 9999,
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_login_with_valid_password(): void
    {
        $user = User::where('role', 'alumno')->first();

        $response = $this->postJson('/usuarios/login', [
            'user_id' => $user->id,
            'password' => 'carmelo2026',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ]
        ]);

        $this->assertEquals($user->id, session('current_user_id'));
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        $user = User::where('role', 'alumno')->first();

        $response = $this->postJson('/usuarios/login', [
            'user_id' => $user->id,
            'password' => 'wrong_password_123',
        ]);

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
        ]);
    }

    public function test_student_and_teacher_registration_with_custom_password(): void
    {
        // 1. Registro de Estudiante con Grado, Sección y Clave
        $resStudent = $this->postJson('/usuarios/registro', [
            'name' => 'Estudiante Nuevo',
            'role' => 'alumno',
            'grade' => '4° Grado Primaria',
            'section' => 'C',
            'avatar' => '🚀',
            'password' => 'clave123',
        ]);

        $resStudent->assertStatus(200);
        $resStudent->assertJson([
            'success' => true,
            'user' => [
                'name' => 'Estudiante Nuevo',
                'role' => 'alumno',
                'grade' => '4° Grado Primaria',
                'section' => 'C',
                'xp_points' => 100,
            ]
        ]);

        // 2. Registro de Docente con Especialidad y Clave
        $resTeacher = $this->postJson('/usuarios/registro', [
            'name' => 'Prof. Ramón Gómez',
            'role' => 'colaborador',
            'specialty' => 'Matemáticas y Robótica',
            'avatar' => '👩‍🏫',
            'password' => 'docente2026',
        ]);

        $resTeacher->assertStatus(200);
        $resTeacher->assertJson([
            'success' => true,
            'user' => [
                'name' => 'Prof. Ramón Gómez',
                'role' => 'colaborador',
                'specialty' => 'Matemáticas y Robótica',
                'xp_points' => 200,
            ]
        ]);
    }
}
