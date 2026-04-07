<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Protected by Laravel Passport (Bearer Token)
|--------------------------------------------------------------------------
| These routes are guarded by the 'api' guard which uses Passport as driver.
| To test: GET /api/user with header: Authorization: Bearer {access_token}
*/

Route::middleware('auth:api')->group(function () {
    // Returns the authenticated user's data — primary validation endpoint.
    Route::get('/user', function (Request $request) {
        return response()->json([
            'id'         => $request->user()->id,
            'name'       => $request->user()->name,
            'email'      => $request->user()->email,
            'created_at' => $request->user()->created_at,
        ]);
    });
});

