import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    ShieldCheck,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { home } from '@/routes';

// Props recebidas do Laravel via Inertia
type OAuthClient = {
    id: string;
    name: string;
    logo?: string;
};

type Props = {
    client: OAuthClient;
    scopes: string[];
    authToken?: string;
    state?: string;
};

// Mapeamento de escopos técnicos para descrições amigáveis
const SCOPE_LABELS: Record<string, string> = {
    profile: 'Ver nome e foto do perfil',
    email: 'Acessar endereço de e-mail',
    openid: 'Confirmar identidade com OpenID',
    permissions: 'Gerenciar permissões',
    'read:user': 'Ler dados do usuário',
    'write:user': 'Atualizar dados do usuário',
};

function scopeLabel(scope: string): string {
    return SCOPE_LABELS[scope] ?? scope;
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

export default function Authorize({ client, scopes, authToken, state }: Props) {
    const { auth } = usePage().props;

    const handleAuthorize = () => {
        // We use a standard form submission instead of Inertia (XHR)
        // to bypass CORS issues when the server redirects to a different origin.
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/oauth/authorize';

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            tokenInput.value = csrfToken;
            form.appendChild(tokenInput);
        }

        const data = {
            auth_token: authToken,
            state,
            client_id: client.id,
        };

        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
            }
        });

        document.body.appendChild(form);
        form.submit();
    };

    const handleCancel = () => {
        // Denying access also results in a redirect, so we use a standard form.
        // Laravel's DELETE method spoofing requires a POST with _method=DELETE.
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/oauth/authorize';

        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            const tokenInput = document.createElement('input');
            tokenInput.type = 'hidden';
            tokenInput.name = '_token';
            tokenInput.value = csrfToken;
            form.appendChild(tokenInput);
        }

        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = '_method';
        methodInput.value = 'DELETE';
        form.appendChild(methodInput);

        const data = {
            state,
            client_id: client.id,
        };

        Object.entries(data).forEach(([key, value]) => {
            if (value) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = value as string;
                form.appendChild(input);
            }
        });

        document.body.appendChild(form);
        form.submit();
    };

    return (
        <>
            <Head title="Pedido de Acesso — Sigo SSO" />

            <Card className="w-full border-0 shadow-[0_20px_40px_rgba(42,52,57,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                {/* Dual Avatars + Conexão */}
                <div className="flex flex-col items-center gap-4 px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3">
                        {/* Avatar Sigo SSO */}
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#5f5e61] shadow-sm dark:bg-[#c8cfd3]">
                            <ShieldCheck className="h-7 w-7 text-white dark:text-[#1a1f22]" />
                        </div>

                        {/* Conector */}
                        <div className="flex items-center gap-1">
                            <div className="h-px w-5 bg-border" />
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            </div>
                            <div className="h-px w-5 bg-border" />
                        </div>

                        {/* Avatar App externo */}
                        <Avatar className="h-14 w-14 rounded-xl border border-border/50 shadow-sm">
                            {client.logo && (
                                <AvatarImage
                                    src={client.logo}
                                    alt={client.name}
                                />
                            )}
                            <AvatarFallback className="rounded-xl bg-secondary text-sm font-semibold text-secondary-foreground">
                                {getInitials(client.name)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="space-y-1 text-center">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">
                            Pedido de Acesso
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            A aplicação{' '}
                            <span className="font-medium text-foreground">
                                {client.name}
                            </span>{' '}
                            deseja acessar sua conta Sigo SSO
                        </p>
                    </div>

                    {auth?.user && (
                        <Badge
                            variant="secondary"
                            className="gap-1.5 rounded-full px-3 py-1 text-xs"
                        >
                            <Avatar className="h-4 w-4">
                                <AvatarImage
                                    src={auth.user.avatar}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="text-[8px]">
                                    {getInitials(auth.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            {auth.user.email}
                        </Badge>
                    )}
                </div>

                <CardContent className="px-8 pt-6 pb-4">
                    <Separator className="mb-6" />

                    {/* Lista de Permissões */}
                    <div className="space-y-1">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Permissões Solicitadas
                        </p>
                        <ul className="space-y-3">
                            {scopes.length > 0 ? (
                                scopes.map((scope) => (
                                    <li
                                        key={scope}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5f5e61] dark:text-[#c8cfd3]" />
                                        <span className="text-sm text-foreground">
                                            {scopeLabel(scope)}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                // Permissões padrão se não houver escopos
                                <>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5f5e61] dark:text-[#c8cfd3]" />
                                        <span className="text-sm text-foreground">
                                            Ver nome e foto do perfil
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5f5e61] dark:text-[#c8cfd3]" />
                                        <span className="text-sm text-foreground">
                                            Acessar endereço de e-mail
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#5f5e61] dark:text-[#c8cfd3]" />
                                        <span className="text-sm text-foreground">
                                            Gerenciar permissões
                                        </span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    <Separator className="mt-6 mb-5" />

                    {/* Aviso de segurança */}
                    <Alert className="border-0 bg-secondary/50 px-4 py-3">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <AlertTitle className="text-xs font-medium text-foreground">
                            Acesso revogável a qualquer momento
                        </AlertTitle>
                        <AlertDescription className="text-xs text-muted-foreground">
                            Você pode remover esse acesso em{' '}
                            <span className="font-medium">
                                Configurações → Apps Conectados
                            </span>
                            .
                        </AlertDescription>
                    </Alert>
                </CardContent>

                {/* Botões de ação */}
                <CardFooter className="flex gap-3 border-t border-border/50 px-8 py-5">
                    <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 text-muted-foreground transition-colors hover:text-foreground"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="flex-1 gap-2 bg-[#5f5e61] text-white shadow-sm transition-all hover:bg-[#535255] hover:shadow-md active:scale-[0.98] dark:bg-[#c8cfd3] dark:text-[#1a1f22]"
                        onClick={handleAuthorize}
                        style={{
                            background:
                                'linear-gradient(135deg, #5f5e61 0%, #535255 100%)',
                        }}
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Autorizar
                    </Button>
                </CardFooter>
            </Card>

            {/* Protocolo OAuth */}
            <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Sigo Security Service — Protocolo OAuth 2.1
            </p>
        </>
    );
}

Authorize.layout = {
    title: 'Autorizar Acesso',
    description: 'Revise as permissões antes de autorizar',
};
