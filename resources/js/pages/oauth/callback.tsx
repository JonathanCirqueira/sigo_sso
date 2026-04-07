import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, AlertCircle, Copy, ArrowRight } from 'lucide-react';

export default function OAuthCallback() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [tokenData, setTokenData] = useState<any>(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');

            // Step D: Capture code and state
            const savedState = sessionStorage.getItem('pkce_state');
            const codeVerifier = sessionStorage.getItem('pkce_verifier');

            if (!code || !state || state !== savedState) {
                setStatus('error');
                setErrorMessage('Resposta inválida do servidor ou CSRF (state) inválido.');
                return;
            }

            try {
                // Step E: Implement POS token request with code_verifier
                const response = await fetch('/oauth/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        grant_type: 'authorization_code',
                        client_id: urlParams.get('client_id') || sessionStorage.getItem('last_client_id') || '019d62a3-0551-7072-aad7-73ca2ba7a539', // Fallback or retrieve from URL
                        redirect_uri: window.location.origin + '/oauth/callback',
                        code: code,
                        code_verifier: codeVerifier,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    setTokenData(data);
                    setStatus('success');
                } else {
                    setStatus('error');
                    setErrorMessage(data.message || 'Falha ao trocar o código por token.');
                }
            } catch (error) {
                setStatus('error');
                setErrorMessage('Erro de rede ao conectar com o Sigo SSO.');
            }
        };

        handleCallback();
    }, []);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copiado para a área de transferência!');
    };

    return (
        <>
            <Head title="Sigo SSO — Token Callback" />

            <div className="flex min-h-screen items-center justify-center p-6 bg-[#f8fafc] dark:bg-[#0f172a]">
                <Card className="w-full max-w-2xl border-0 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            {status === 'loading' && <Loader2 className="h-10 w-10 text-primary animate-spin" />}
                            {status === 'success' && <CheckCircle2 className="h-10 w-10 text-green-500" />}
                            {status === 'error' && <AlertCircle className="h-10 w-10 text-red-500" />}
                        </div>
                        <CardTitle className="text-2xl">
                            {status === 'loading' && 'Processando Autorização...'}
                            {status === 'success' && 'Autenticação Realizada!'}
                            {status === 'error' && 'Erro na Autenticação'}
                        </CardTitle>
                        <CardDescription>
                            {status === 'loading' && 'Trocando o código de autorização pelo token de acesso.'}
                            {status === 'success' && 'Os tokens foram gerados com sucesso.'}
                            {status === 'error' && errorMessage}
                        </CardDescription>
                    </CardHeader>

                    {status === 'success' && tokenData && (
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Access Token</Label>
                                        <Badge variant="outline">Bearer</Badge>
                                    </div>
                                    <div className="group relative">
                                        <pre className="p-4 bg-muted rounded-lg text-[11px] overflow-x-auto whitespace-pre-wrap break-all border h-32">
                                            {tokenData.access_token}
                                        </pre>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-2 top-2 h-8 w-8"
                                            onClick={() => copyToClipboard(tokenData.access_token)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground uppercase">Expira em</Label>
                                        <p className="text-sm font-medium">{Math.floor(tokenData.expires_in / 60)} minutos</p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <Label className="text-xs text-muted-foreground uppercase">Token Type</Label>
                                        <p className="text-sm font-medium capitalize">{tokenData.token_type}</p>
                                    </div>
                                </div>

                                {tokenData.refresh_token && (
                                    <div className="space-y-2 pt-2 border-t">
                                        <Label className="text-xs text-muted-foreground uppercase">Refresh Token</Label>
                                        <code className="block p-3 bg-muted/30 rounded border text-xs break-all">
                                            {tokenData.refresh_token.substring(0, 50)}...
                                        </code>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    )}

                    {status !== 'loading' && (
                        <CardFooter className="flex justify-center border-t py-4">
                            <Button variant="ghost" onClick={() => window.location.href = '/pkce-demo'}>
                                Voltar para Demo
                            </Button>
                            {status === 'success' && (
                                <Button className="ml-3 gap-2" variant="default" onClick={() => window.location.href = '/dashboard'}>
                                    Acessar Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            )}
                        </CardFooter>
                    )}
                </Card>
            </div>
        </>
    );
}

OAuthCallback.layout = {
    title: 'Sigo SSO Callback',
    description: 'Processamento de token OAuth2',
};
