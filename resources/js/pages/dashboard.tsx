import { Head, router } from '@inertiajs/react';
import {
    AppWindow,
    Github,
    Info,
    Plus,
    Slack,
    Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

// ─── Types ────────────────────────────────────────────────────────────────────

type ConnectedApp = {
    id: string;
    name: string;
    category: string;
    description: string;
    icon?: LucideIcon;
    iconColor?: string;
    connectedAt: string;
};

type Props = {
    /**
     * Lista de aplicativos autorizados, recebida do Laravel via Inertia.
     * Exemplo no controller:
     *   return Inertia::render('dashboard', ['connectedApps' => $apps]);
     */
    connectedApps?: ConnectedApp[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

// ─── App Card ─────────────────────────────────────────────────────────────────

function AppCard({
    app,
    onRevoke,
}: {
    app: ConnectedApp;
    onRevoke: (id: string) => void;
}) {
    const Icon = app.icon ?? AppWindow;

    return (
        <Card className="group flex flex-col gap-0 border-0 bg-card py-0 shadow-[0_2px_12px_rgba(42,52,57,0.05)] transition-shadow hover:shadow-[0_4px_20px_rgba(42,52,57,0.09)] dark:shadow-none dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
            <CardHeader className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm"
                        style={{ background: `${app.iconColor}1a` }}
                    >
                        <Icon
                            className="h-5 w-5"
                            style={{ color: app.iconColor ?? '#5f5e61' }}
                        />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="truncate text-sm font-semibold">
                            {app.name}
                        </CardTitle>
                        <Badge
                            variant="secondary"
                            className="mt-0.5 rounded-full px-2 py-0 text-[10px] font-medium"
                        >
                            {app.category}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-0">
                <CardDescription className="flex-1 text-xs leading-relaxed">
                    {app.description}
                </CardDescription>
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] text-muted-foreground">
                        Conectado em {formatDate(app.connectedAt)}
                    </p>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full text-xs font-medium opacity-80 transition-opacity hover:opacity-100"
                        onClick={() => onRevoke(app.id)}
                    >
                        Revogar Acesso
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard({ connectedApps = [] }: Props) {
    const apps = connectedApps;

    const handleRevoke = (appId: string) => {
        /**
         * Enviar para a rota Laravel que revoga o token OAuth do app.
         */
        router.delete(`/oauth/clients/${appId}/tokens`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="px-4 py-8 max-w-7xl mx-auto">
            <Head title="Dashboard — Sigo SSO" />

            {/* Header da seção */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Gerencie os aplicativos que possuem acesso à sua conta Sigo.
                    </p>
                </div>
            </div>

            {/* Grid de Apps ou Empty State */}
            {apps.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {apps.map((app) => (
                        <AppCard
                            key={app.id}
                            app={app}
                            onRevoke={handleRevoke}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/30 py-24 px-6 text-center shadow-inner">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10 opacity-20" />
                        <AppWindow className="h-16 w-16 text-muted-foreground/20" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Tudo pronto para começar!
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground leading-relaxed">
                        Você ainda não autorizou nenhum aplicativo. Quando conectar um app via SSO, ele aparecerá aqui para sua gestão e controle.
                    </p>
                </div>
            )}

            {/* Alert informativo */}
            <Alert className="mt-8 border border-border/40 bg-secondary/40">
                <Info className="h-4 w-4 text-muted-foreground" />
                <AlertTitle className="text-sm font-medium">
                    Sobre as conexões
                </AlertTitle>
                <AlertDescription className="mt-1 text-xs text-muted-foreground">
                    Aplicativos com acesso à sua conta podem ler dados conforme
                    as permissões aprovadas. Revogue o acesso a qualquer momento
                    sem afetar sua conta principal.
                </AlertDescription>
            </Alert>
        </div>
    );
}

Dashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/',
        },
        {
            title: 'Aplicativos Conectados',
            href: '#',
        },
    ],
});
