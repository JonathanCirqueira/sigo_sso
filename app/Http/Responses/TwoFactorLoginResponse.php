<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\TwoFactorLoginResponse as TwoFactorLoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorLoginResponse implements TwoFactorLoginResponseContract
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
