<?php

namespace Database\Factories;


use App\Models\Stock;
use Illuminate\Database\Eloquent\Factories\Factory;
class StockFactory extends Factory
{
    protected $model = Stock::class;

    public function definition(): array
    {
        return [
            'qte' => $this->faker->numberBetween(1, 100),
            'id_product' => $this->faker->numberBetween(1, 10),
            'product_type' => $this->faker->randomElement(['furniture', 'electronics', 'supplies']),
            'qualite' => $this->faker->randomElement(['High', 'Medium', 'Low']),
            'id_manager' => $this->faker->optional()->numberBetween(1, 5),
            'date_enter' => $this->faker->date(),
            'location' => $this->faker->city,
        ];
    }
}
