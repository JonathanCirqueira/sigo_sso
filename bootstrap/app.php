<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Providers\PassportServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withProviders([
        PassportServiceProvider::class,
    ])
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'check.admin' => \App\Http\Middleware\CheckAdmin::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'oauth/token',
        ]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Força o retorno em JSON para todas as exceptions, ou nas rotas api/oauth
        // Dessa forma as requisições que quebram nunca retornam a página HTML crua.
        $exceptions->shouldRenderJsonWhen(function (\Illuminate\Http\Request $request, \Throwable $e) {
            // If it's an Inertia request, let Inertia handle it (redirects, modals, etc.)
            if ($request->hasHeader('X-Inertia')) {
                return false;
            }

            // Machine-to-machine endpoints (API and OAuth protocol) should always return JSON.
            if ($request->is('api/*') || ($request->is('oauth/*') && !$request->is('oauth/authorize'))) {
                return true;
            }

            // For everything else, follow the request preference (Accept: application/json)
            return $request->expectsJson();
        });
    })->create();

