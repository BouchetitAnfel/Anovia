<?php
namespace Database\Factories;

use App\Models\Room;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    protected $model = Room::class;

    public function definition()
    {
        return [
            'room_number' => $this->faker->unique()->numberBetween(100, 999),
            'room_type' => $this->faker->randomElement(['single', 'double', 'suite']),
            'hors_service' => $this->faker->boolean(),
            'price_per_night' => $this->faker->numberBetween(50, 500),
        ];
    }
}
