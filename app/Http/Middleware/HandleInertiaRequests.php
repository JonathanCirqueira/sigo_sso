<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'flash' => [
                'new_client' => $request->session()->get('new_client') ?? (is_array($request->session()->get('flash')) ? ($request->session()->get('flash')['new_client'] ?? null) : null),
                'success' => $request->session()->get('success') ?? (is_array($request->session()->get('flash')) ? ($request->session()->get('flash')['success'] ?? null) : null),
                'error' => $request->session()->get('error') ?? (is_array($request->session()->get('flash')) ? ($request->session()->get('flash')['error'] ?? null) : null),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
