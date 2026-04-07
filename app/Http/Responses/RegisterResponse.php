<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false], 201);
        }

        $redirect = redirect()->intended(route('dashboard'));

        if ($request->header('X-Inertia')) {
            return \Inertia\Inertia::location($redirect->getTargetUrl());
        }

        return $redirect;
    }
}
