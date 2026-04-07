<?php

namespace App\Http\Controllers\Auth\OAuth;

use Illuminate\Http\Request;
use Laravel\Passport\Http\Controllers\AuthorizationController as PassportAuthorizationController;
use Laravel\Passport\Contracts\AuthorizationViewResponse;
use Laravel\Passport\Bridge\User as BridgeUser;
use League\OAuth2\Server\RequestTypes\AuthorizationRequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;

class AuthorizationController extends PassportAuthorizationController
{
    /**
     * Authorize a client to access the user's account.
     *
     * @param  \Psr\Http\Message\ServerRequestInterface  $psrRequest
     * @param  \Illuminate\Http\Request  $request
     * @param  \Psr\Http\Message\ResponseInterface  $psrResponse
     * @param  \Laravel\Passport\Contracts\AuthorizationViewResponse  $viewResponse
     * @return \Symfony\Component\HttpFoundation\Response|\Laravel\Passport\Contracts\AuthorizationViewResponse
     */
    public function authorize(
        ServerRequestInterface $psrRequest,
        Request $request,
        ResponseInterface $psrResponse,
        AuthorizationViewResponse $viewResponse
    ): Response|AuthorizationViewResponse {
        $authRequest = $this->withErrorHandling(
            fn (): AuthorizationRequestInterface => $this->server->validateAuthorizationRequest($psrRequest),
            ($psrRequest->getQueryParams()['response_type'] ?? null) === 'token'
        );

        if ($this->guard->guest()) {
            $this->promptForLogin($request);
        }

        $user = $this->guard->user();
        $authRequest->setUser(new BridgeUser($user->getAuthIdentifier()));

        $scopes = $this->parseScopes($authRequest);
        $client = $this->clients->find($authRequest->getClient()->getIdentifier());

        // Forçamos a exibição da tela se:
        // 1. O parâmetro 'prompt' for 'consent'
        // 2. OU se for um dos clientes de teste específicos
        $testClients = [
            '019d63d0-cdd5-7252-8536-d60c898c42e8', // sigoteste
            '019d6848-c33d-71db-ad2d-ac131a24d300', // Sigo_teste01 (ID atual do usuário)
        ];
        
        $isTestClient = in_array($client->id, $testClients);
        $forceConsent = $request->input('prompt') === 'consent' || $isTestClient;

        if (!$forceConsent &&
            ($client->skipsAuthorization($user, $scopes) || $this->hasGrantedScopes($user, $client, $scopes))) {
            return $this->approveRequest($authRequest, $psrResponse);
        }

        $authToken = $request->session()->get('authToken') ?? Str::random();
        $request->session()->put('authToken', $authToken);
        $request->session()->put('authRequest', $authRequest);

        return $viewResponse->withParameters([
            'client' => $client,
            'user' => $user,
            'scopes' => $scopes,
            'request' => $request,
            'authToken' => $authToken,
            'state' => $request->input('state'),
        ]);
    }
}
