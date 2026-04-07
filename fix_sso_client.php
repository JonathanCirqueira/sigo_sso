<?php
use Laravel\Passport\Client;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$clientId = '019d63d0-cdd5-7252-8536-d60c898c42e8';
$client = Client::find($clientId);

if ($client) {
    echo "Current Redirect URIs: " . json_encode($client->redirect_uris) . "\n";
    
    // Corrigindo a URI de redirect e o secret
    $client->redirect_uris = ["http://localhost:8001/auth/callback"];
    $client->secret = 'PRqs19ZsBcQcICj11yyWOnqtQQIpiHW43vVsjsTF';
    $client->save();

    echo "Status: Client updated successfully!\n";
    echo "New Redirect URIs: " . json_encode($client->redirect_uris) . "\n";
} else {
    echo "Status: Client $clientId not found!\n";
}
