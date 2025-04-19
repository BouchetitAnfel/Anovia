<?php

namespace App\Listeners;

use App\Events\HighStockEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
// If you have a notification system:
// use App\Notifications\HighStockNotification;
// use App\Models\User;

class HandleHighStockAlert implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(HighStockEvent $event): void
    {
        // Log the high stock event
        Log::warning('High stock alert for product ID: ' . $event->stock->id_product .
                    ' (Current Quantity: ' . $event->currentQuantity .
                    ', Threshold: ' . $event->threshold . ')');

        // Example: Send notifications to inventory managers
        // $managers = User::where('role', 'inventory_manager')->get();
        // Notification::send($managers, new HighStockNotification($event->stock, $event->currentQuantity, $event->threshold));
    }
}
