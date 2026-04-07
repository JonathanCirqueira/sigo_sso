<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Passport\ClientRepository;
use Inertia\Inertia;

class AdminClientController extends Controller
{
    protected $clients;

    public function __construct(ClientRepository $clients)
    {
        $this->clients = $clients;
    }

    public function index()
    {
        $allClients = \Laravel\Passport\Client::orderBy('created_at', 'desc')->get();
        $allClients->makeVisible(['secret', 'plain_secret']);
        
        return Inertia::render('admin/clients/index', [
            'clients' => $allClients
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|max:255',
            'redirect' => 'required|url',
        ]);

        // Creating a Confidential Client used for Authorization Code Grant.
        // It requires a secret but natively supports PKCE when used with public frontends.
        $client = $this->clients->createAuthorizationCodeGrantClient(
            $request->name,
            [$request->redirect], // Passport expects an array of redirect URIs
            true // confidential
        );
        
        // Save the plain secret to the persistent column
        $client->forceFill([
            'plain_secret' => $client->plainSecret
        ])->save();

        // We return to the frontend with the plainSecret via session/flash or direct response
        // In Inertia, we can redirect back with the secret just once
        return back()->with('flash', [
            'new_client' => [
                'id' => $client->id,
                'name' => $client->name,
                'secret' => $client->plainSecret,
                'redirect' => $client->redirect
            ]
        ]);
    }
    public function destroy($clientId)
    {
        $client = \Laravel\Passport\Client::findOrFail($clientId);
        $client->delete();

        return back()->with('flash', [
            'success' => 'Aplicativo cliente removido com sucesso.'
        ]);
    }

    public function regenerate($clientId)
    {
        $client = \Laravel\Passport\Client::findOrFail($clientId);
        
        $client->forceFill([
            'secret' => $newSecret = \Illuminate\Support\Str::random(40),
            'plain_secret' => $newSecret,
        ])->save();

        return back()->with('flash', [
            'new_client' => [
                'id' => $client->id,
                'name' => $client->name,
                'secret' => $newSecret,
                'redirect' => $client->redirect,
                'regenerated' => true
            ]
        ]);
    }
}
