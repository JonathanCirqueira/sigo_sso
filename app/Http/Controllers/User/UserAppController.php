<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Passport\RefreshToken;
use Inertia\Inertia;

class UserAppController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Eager load the client relationship to get the app name
        $tokens = $user->tokens()->with('client')->where('revoked', false)->get();
        
        // Group tokens by client to represent "Apps"
        $apps = $tokens->groupBy('client_id')->map(function ($group) {
            $first = $group->first();
            return [
                'client_id' => $first->client->id,
                'name' => $first->client->name,
                'redirect' => $first->client->redirect,
                'connected_since' => $first->created_at,
            ];
        })->values();

        return Inertia::render('user/apps/index', [
            'apps' => $apps
        ]);
    }

    public function revoke(Request $request, $clientId)
    {
        $user = $request->user();
        
        // Find all active tokens for this user and this specific client
        $tokens = $user->tokens()->where('client_id', $clientId)->where('revoked', false)->get();
        
        foreach ($tokens as $token) {
            // Directly revoke the access token using the model's method
            $token->revoke();
            
            // Revoke all refresh tokens associated with this access token
            RefreshToken::where('access_token_id', $token->id)->update(['revoked' => true]);
        }

        return back()->with('flash', [
            'success' => 'Acesso revogado com sucesso.'
        ]);
    }
}
