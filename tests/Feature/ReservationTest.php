<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Client;
use App\Models\Room;
use Laravel\Passport\Passport;
use Carbon\Carbon;

class ReservationTest extends TestCase
{
    public function testCreateReservation()
    {
        // Create a test client and room
        $client = Client::factory()->create();
        $room = Room::factory()->create(['price_per_night' => 100]);

        // Authenticate using Passport
        Passport::actingAs($client);

        $response = $this->postJson('/api/reservations', [
            'room_id'      => $room->id,
            'date_checkin' => Carbon::now()->addDays(2)->toDateString(),
            'date_checkout'=> Carbon::now()->addDays(5)->toDateString(),
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'reservation' => ['id', 'client_id', 'room_id', 'date_reservation', 'date_checkin', 'date_checkout', 'reservation_status', 'total_price']
                ]);
    }
}
