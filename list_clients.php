<?php
require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$clients = \Laravel\Passport\Client::all(['id', 'name', 'redirect_uris', 'secret', 'personal_access_client', 'password_client', 'revoked']);
print_r($clients->toArray());
