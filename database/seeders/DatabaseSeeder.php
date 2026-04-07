<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Laravel\Passport\Client;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a fixed test user
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        // 2. Create a Public Client (PKCE) for Passport 13 schema
        Client::updateOrCreate(
            ['id' => '019d634d-53d3-722f-9906-ede3a6b6ac2c'],
            [
                'owner_id' => null,
                'owner_type' => null,
                'name' => 'Sigo PKCE Demo',
                'secret' => '',
                'provider' => 'users',
                'redirect_uris' => [
                    'http://localhost:8001/auth/callback',
                    'http://localhost:8000/auth/callback'
                ],
                'grant_types' => ['authorization_code', 'refresh_token'],
                'revoked' => false,
            ]
        );

        $this->command->info('Test User synced: test@example.com / password');
        $this->command->info('Public Client (PKCE) synced for Demo.');
    }
}



