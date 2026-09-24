<?php

namespace Tests\Feature;

use App\Models\ClassLesson;
use App\Models\Poll;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_portal_index_loads_successfully(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('CLUB T.I.A.');
        $response->assertSee('Monte Carmelo');
        $response->assertSee('Misión 01: El Despegue de la IA');
        $response->assertSee('Misión 02: El Detective de Libros');
        $response->assertSee('Misión 03: Los Secretos de la Web');
        $response->assertSee('Misión 04: El Gimnasio Matemático');
        $response->assertSee('Misión 05: Entrena a tu Mascota Robot');
    }

    public function test_mission_1_page_loads_successfully(): void
    {
        $response = $this->get('/mision/el-despegue-de-la-ia');

        $response->assertStatus(200);
        $response->assertSee('Misión 01: El Despegue de la IA');
        $response->assertSee('¿Inteligencia Artificial o Humano?');
        $response->assertSee('Glosario Mágico');
    }

    public function test_live_poll_api_returns_active_poll_with_stats(): void
    {
        $response = $this->getJson('/api/polls/active');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'id',
            'question',
            'total_votes',
            'options' => [
                '*' => ['id', 'text', 'emoji', 'color', 'votes', 'percentage']
            ]
        ]);
    }

    public function test_voting_in_poll_registers_vote_and_awards_xp(): void
    {
        $poll = Poll::first();

        $response = $this->postJson("/api/polls/{$poll->id}/vote", [
            'option_id' => 'opt_1'
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true
        ]);
    }

    public function test_completing_mission_awards_xp_and_badge(): void
    {
        $user = User::first();
        session(['current_user_id' => $user->id]);

        $response = $this->postJson('/mision/el-despegue-de-la-ia/completar');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'xp_points' => $user->xp_points + 100
        ]);
    }
}
