import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { store, destroy, regenerate } from '@/routes/admin/clients';
import { Copy, PlusCircle, Check, Trash2, ShieldAlert, RefreshCw, CheckCircle2, AlertCircle, Link as LinkIcon, ExternalLink, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Client {
    id: string;
    name: string;
    redirect: string;
    secret: string;
    plain_secret: string;
    created_at: string;
}

interface FlashProps {
    new_client?: {
        id: string;
        name: string;
        secret: string;
        redirect: string;
        regenerated?: boolean;
    };
    success?: string;
}

export default function AdminClients({ clients }: { clients: Client[] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        redirect: '',
    });

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedSecret, setCopiedSecret] = useState<string | null>(null);
    const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
    const [tempSecrets, setTempSecrets] = useState<Record<string, string>>({});

    const flash = usePage().props.flash as FlashProps;

    useEffect(() => {
        if (flash?.new_client) {
            setTempSecrets(prev => ({
                ...prev,
                [flash.new_client!.id]: flash.new_client!.secret
            }));
            // Automagically make it visible if it was just generated/regenerated
            const newVisible = new Set(visibleSecrets);
            newVisible.add(flash.new_client.id);
            setVisibleSecrets(newVisible);
        }
    }, [flash?.new_client]);

    const handleCopy = (text: string, type: 'id' | 'secret') => {
        navigator.clipboard.writeText(text);
        if (type === 'id') {
            setCopiedId(text);
            setTimeout(() => setCopiedId(null), 2000);
        } else {
            setCopiedSecret(text);
            setTimeout(() => setCopiedSecret(null), 2000);
        }
    };

    const toggleSecretVisibility = (id: string) => {
        const newVisible = new Set(visibleSecrets);
        if (newVisible.has(id)) {
            newVisible.delete(id);
        } else {
            newVisible.add(id);
        }
        setVisibleSecrets(newVisible);
    };

    const submitCreate: FormEventHandler = (e) => {
        e.preventDefault();
        post(store().url, {
            onSuccess: () => {
                reset();
                setIsCreateDialogOpen(false);
            },
        });
    };

    const handleDeleteClient = (id: string) => {
        router.delete(destroy(id).url);
    };

    return (
        <div className="container mx-auto p-6 flex flex-col gap-8 max-w-6xl">
            <Head title="Gerenciar Clients OAuth" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Clientes OAuth2</h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        Configure os identificadores e segredos para as aplicações que usarão este SSO.
                    </p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="font-semibold shadow-sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Novo Aplicativo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Registrar Novo Aplicativo</DialogTitle>
                            <DialogDescription>
                                Forneça os detalhes básicos para gerar as credenciais de acesso.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitCreate} className="space-y-4 py-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome do Projeto Cliente</Label>
                                <Input
                                    id="name"
                                    placeholder="Ex: App de Finanças"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    autoFocus
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="redirect">URL de Redirecionamento (Callback)</Label>
                                <Input
                                    id="redirect"
                                    placeholder="https://app.example.com/auth/callback"
                                    value={data.redirect}
                                    onChange={(e) => setData('redirect', e.target.value)}
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Esta é a URL absoluta do seu projeto onde o SSO enviará o código de autorização.
                                </p>
                                <InputError message={errors.redirect} />
                            </div>
                            <div className="pt-2 flex justify-end">
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? 'Gerando...' : 'Criar e Gerar Credenciais'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>


            {/* List of Clients */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {clients.length === 0 ? (
                    <Card className="col-span-full border-dashed border-2 bg-muted/20 py-12">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                            <PlusCircle className="h-8 w-8 text-muted-foreground/50" />
                            <p className="text-muted-foreground font-medium">Nenhum aplicativo configurado.</p>
                            <Button variant="link" onClick={() => setIsCreateDialogOpen(true)}>Começar agora</Button>
                        </div>
                    </Card>
                ) : (
                    clients.map((client) => {
                        const effectiveSecret = tempSecrets[client.id] || client.plain_secret || client.secret;
                        const isRecentlyUpdated = flash?.new_client?.id === client.id;

                        return (
                            <Card key={client.id} className={`flex flex-col group border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md bg-card ${isRecentlyUpdated ? 'ring-2 ring-emerald-500 shadow-emerald-500/10' : ''}`}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                                {client.name}
                                            </CardTitle>
                                        </div>

                                        <div className="flex gap-1">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Remover "{client.name}"?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Isso invalidará imediatamente o acesso deste aplicativo ao SSO.
                                                            Os usuários não conseguirão mais autenticar através dele.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Não, Manter</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteClient(client.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                            Remover Permanentemente
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-3">
                                    <div className="p-4 rounded-xl bg-muted/40 border border-muted-foreground/10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                                <ExternalLink className="h-3 w-3" />
                                                Credenciais
                                            </h4>
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>

                                        <div className="space-y-3">
                                            {/* Client ID Display */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between px-0.5">
                                                    <span className="text-[11px] font-medium text-muted-foreground">CLIENT_ID</span>
                                                    <button
                                                        onClick={() => handleCopy(client.id, 'id')}
                                                        className="text-[10px] lowercase text-primary hover:underline font-medium"
                                                    >
                                                        {copiedId === client.id ? 'Copiado!' : 'Copiar ID'}
                                                    </button>
                                                </div>
                                                <code className="block w-full font-mono text-[11px] bg-background/60 p-2 rounded border border-muted-foreground/10 truncate">
                                                    {client.id}
                                                </code>
                                            </div>

                                            {/* Client Secret Management */}
                                            <div className="space-y-1.5 pt-1 border-t border-muted/30">
                                                <div className="flex items-center justify-between px-0.5">
                                                    <span className="text-[11px] font-medium text-muted-foreground uppercase">CLIENT_SECRET</span>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleCopy(effectiveSecret, 'secret')}
                                                            className="text-[10px] lowercase text-primary hover:underline font-medium"
                                                        >
                                                            {copiedSecret === effectiveSecret ? 'Copiado!' : 'Copiar Secret'}
                                                        </button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <button title="Regerar segredo (Irreversível)" className="text-muted-foreground hover:text-primary transition-colors">
                                                                    <RefreshCw className="h-2.5 w-2.5" />
                                                                </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Regerar Segredo de "{client.name}"?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        O segredo atual será <strong>invalidado imediatamente</strong>.
                                                                        Você precisará atualizar o projeto cliente com o novo valor gerado para que ele volte a funcionar.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Não, Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => router.post(regenerate(client.id).url)}
                                                                        className="bg-primary hover:bg-primary/90"
                                                                    >
                                                                        Gerar Novo Segredo
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                                <div className="relative group/secret flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <code className="flex-1 block font-mono text-[11px] bg-background/60 p-2 rounded border border-muted-foreground/10 truncate">
                                                            {visibleSecrets.has(client.id) ? effectiveSecret : '••••••••••••••••••••••••••••••••••••••••'}
                                                        </code>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 shrink-0"
                                                            onClick={() => toggleSecretVisibility(client.id)}
                                                            title={visibleSecrets.has(client.id) ? "Ocultar Secret" : "Visualizar Secret"}
                                                        >
                                                            {visibleSecrets.has(client.id) ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                        </Button>
                                                    </div>

                                                    {visibleSecrets.has(client.id) && isRecentlyUpdated && (
                                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-600 dark:text-emerald-400 font-bold animate-in zoom-in-95">
                                                            <CheckCircle2 className="h-3 w-3" />
                                                            Segredo Atualizado!
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
