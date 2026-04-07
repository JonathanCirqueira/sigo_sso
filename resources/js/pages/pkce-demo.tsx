import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowRight, Key, Code } from 'lucide-react';

export default function PKCEDemo() {
    const [clientId, setClientId] = useState('');
    const [loading, setLoading] = useState(false);

    // Step A: Create logic to generate a code_verifier (random string 43-128 chars)
    const generateCodeVerifier = () => {
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        return b64url(array);
    };

    // Step B: Generate code_challenge from verifier (Base64 URL-safe, SHA256)
    const generateCodeChallenge = async (verifier: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const digest = await window.crypto.subtle.digest('SHA-256', data);
        return b64url(new Uint8Array(digest));
    };

    const b64url = (bytes: Uint8Array) => {
        return btoa(String.fromCharCode(...bytes))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    // Step C: Redirect to /oauth/authorize
    const startPKCEFlow = async () => {
        if (!clientId) {
            alert('Por favor, informe o Client ID gerado no seeder.');
            return;
        }

        setLoading(true);

        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        const state = Math.random().toString(36).substring(2);

        // Store verifier and state in session storage for the callback
        sessionStorage.setItem('pkce_verifier', verifier);
        sessionStorage.setItem('pkce_state', state);

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            redirect_uri: window.location.origin + '/oauth/callback',
            code_challenge: challenge,
            code_challenge_method: 'S256',
            state: state,
        });

        window.location.href = `/oauth/authorize?${params.toString()}`;
    };

    return (
        <>
            <Head title="PKCE Demo — Sigo SSO" />

            <div className="flex min-h-screen items-center justify-center p-6 bg-[#f8fafc] dark:bg-[#0f172a]">
                <Card className="w-full max-w-md border-0 shadow-2xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Shield className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl">Demonstração do Fluxo PKCE</CardTitle>
                        <CardDescription>
                            Simule o fluxo de Login com Sigo SSO (OAuth2 + PKCE)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="client-id">Client ID</Label>
                            <div className="relative">
                                <Input
                                    id="client-id"
                                    placeholder="UUID do cliente gerado no seeder"
                                    value={clientId}
                                    onChange={(e) => setClientId(e.target.value)}
                                    className="pl-10"
                                />
                                <Code className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Verifique a saída do comando `migrate --seed` ou consulte a tabela `oauth_clients`.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3 rounded-lg border p-4 bg-muted/50">
                                <Key className="mt-1 h-5 w-5 text-primary" />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Fluxo de Segurança</p>
                                    <p className="text-xs text-muted-foreground">
                                        Será gerado um <strong>code_verifier</strong> local e um <strong>code_challenge</strong> (S256) será enviado para o servidor.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button 
                            className="w-full gap-2" 
                            size="lg" 
                            onClick={startPKCEFlow}
                            disabled={loading}
                        >
                            {loading ? 'Redirecionando...' : 'Iniciar Fluxo OAuth'}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PKCEDemo.layout = {
    title: 'PKCE Demo',
    description: 'Demonstração de fluxo PKCE com Sigo SSO',
};
