<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false], 200);
        }

        $redirect = redirect()->intended(route('dashboard'));

        if ($request->header('X-Inertia')) {
            return \Inertia\Inertia::location($redirect->getTargetUrl());
        }

        return $redirect;
    }
}
