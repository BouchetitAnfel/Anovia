<?php

namespace App\Events;

use App\Models\Stock;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LowStockEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $stock;
    public $currentQuantity;
    public $threshold;

    /**
     * Create a new event instance.
     */
    public function __construct(Stock $stock, $currentQuantity, $threshold)
    {
        $this->stock = $stock;
        $this->currentQuantity = $currentQuantity;
        $this->threshold = $threshold;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('stock-alerts'),
        ];
    }
}
