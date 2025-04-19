<?php

namespace App\Listeners;

use App\Events\LowStockEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
// If you have a notification system:
// use App\Notifications\LowStockNotification;
// use App\Models\User;

class HandleLowStockAlert implements ShouldQueue
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
    public function handle(LowStockEvent $event): void
    {
        // Log the low stock event
        Log::warning('Low stock alert for product ID: ' . $event->stock->id_product .
                    ' (Current Quantity: ' . $event->currentQuantity .
                    ', Threshold: ' . $event->threshold . ')');

        // Example: Send notifications to administrators
        // $admins = User::where('role', 'admin')->get();
        // Notification::send($admins, new LowStockNotification($event->stock, $event->currentQuantity, $event->threshold));

        // You could implement automatic reordering here
        // Or other business logic for low stock situations
    }
}
