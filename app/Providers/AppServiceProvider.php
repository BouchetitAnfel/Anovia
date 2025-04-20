<?php

namespace App\Providers;

use Laravel\Passport\Passport;

use App\Events\LowStockEvent;
use App\Events\HighStockEvent;
use App\Listeners\HandleLowStockAlert;
use App\Listeners\HandleHighStockAlert;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));
        Passport::tokensCan([
            'client-api' => 'Client API access',
            'api' => 'Employee API access'
        ]);

        Event::listen(
            LowStockEvent::class,
            HandleLowStockAlert::class
        );

        Event::listen(
            HighStockEvent::class,
            HandleHighStockAlert::class
        );
    }
}
