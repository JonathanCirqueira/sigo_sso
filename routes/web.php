<?php

use App\Http\Controllers\Admin\AdminClientController;
use App\Http\Controllers\Auth\OAuth\AuthorizationController;
use App\Http\Controllers\User\UserAppController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // User Apps Dashboard
    Route::get('/dashboard/apps', [UserAppController::class, 'index'])->name('user.apps.index');
    Route::delete('/dashboard/apps/{clientId}', [UserAppController::class, 'revoke'])->name('user.apps.revoke');
});

// Admin Routes
Route::middleware(['auth', 'verified', 'check.admin'])->group(function () {
    Route::get('/admin/clients', [AdminClientController::class, 'index'])->name('admin.clients.index');
    Route::post('/admin/clients', [AdminClientController::class, 'store'])->name('admin.clients.store');
    Route::delete('/admin/clients/{clientId}', [AdminClientController::class, 'destroy'])->name('admin.clients.destroy');
    Route::post('/admin/clients/{clientId}/regenerate', [AdminClientController::class, 'regenerate'])->name('admin.clients.regenerate');
});

// OAuth2 / Passport Routes
Route::group([
    'as' => 'passport.',
    'prefix' => 'oauth',
    'namespace' => 'Laravel\Passport\Http\Controllers',
], function () {
    Route::post('/token', [
        'uses' => 'AccessTokenController@issueToken',
        'as' => 'token',
        'middleware' => 'throttle',
    ]);

    Route::get('/authorize', [AuthorizationController::class, 'authorize'])
        ->middleware('auth')
        ->name('authorizations.authorize');

    $guard = config('passport.guard', null);
    Route::middleware([$guard ? 'auth:'.$guard : 'auth'])->group(function () {
        Route::post('/authorize', [
            'uses' => 'ApproveAuthorizationController@approve',
            'as' => 'authorizations.approve',
        ]);

        Route::delete('/authorize', [
            'uses' => 'DenyAuthorizationController@deny',
            'as' => 'authorizations.deny',
        ]);
    });
});

// PKCE Demo — interactive page to test the full OAuth2 PKCE flow.
Route::inertia('/pkce-demo', 'pkce-demo')->name('pkce.demo');

// OAuth Callback — receives the authorization code after user approves.
Route::inertia('/oauth/callback', 'oauth/callback')->name('oauth.callback');

// Temporary route to list Passport clients for debugging.
Route::get('/debug-clients', function () {
    $clients = \Laravel\Passport\Client::all();
    $html = '<table border="1" style="border-collapse: collapse; width: 100%; font-family: sans-serif;">';
    $html .= '<thead><tr style="background: #f4f4f4;"><th>ID</th><th>Name</th><th>Secret</th><th>Redirect</th></tr></thead><tbody>';
    foreach ($clients as $client) {
        $html .= "<tr><td>{$client->id}</td><td>{$client->name}</td><td><code>{$client->secret}</code></td><td>{$client->redirect}</td></tr>";
    }
    $html .= '</tbody></table>';
    return $html;
})->name('debug.clients');

require __DIR__.'/settings.php';
