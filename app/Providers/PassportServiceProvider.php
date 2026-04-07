<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Laravel\Passport\Passport;

class PassportServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Passport::ignoreRoutes();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configurePassport();
    }

    /**
     * Configure Passport settings and views.
     */
    private function configurePassport(): void
    {
        // Use our custom Inertia authorization view instead of the default Blade view.
        // The view receives: client (id, name, logo?), scopes[], authToken, state.
        Passport::authorizationView(function (array $params) {
            return Inertia::render('auth/authorize', [
                'client'    => $params['client'],
                'scopes'    => $params['scopes'],
                'authToken' => $params['authToken'],
                'state'     => $params['request']->state,
            ]);
        });

        // Define token lifetimes.
        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));
    }
}
