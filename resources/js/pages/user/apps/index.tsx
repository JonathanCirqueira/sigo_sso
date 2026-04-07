import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Trash2, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface ConnectedApp {
    client_id: string;
    name: string;
    redirect: string;
    connected_since: string;
}

interface PageProps {
    apps: ConnectedApp[];
    flash?: {
        success?: string;
    };
}

export default function UserApps({ apps = [], flash }: PageProps) {
    const { delete: destroy, processing } = useForm();

    const revokeAccess = (clientId: string) => {
        destroy(`/dashboard/apps/${clientId}`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Meus Aplicativos" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Meus Aplicativos Autorizados</h1>
                    <p className="text-muted-foreground">
                        Gerencie os aplicativos externos que possuem permissão para acessar sua conta.
                    </p>
                </div>

                {flash?.success && (
                    <div className="mb-4 rounded border-l-4 border-green-500 bg-green-500/10 p-4 text-green-700 dark:bg-green-500/20 dark:text-green-300">
                        {flash.success}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {apps.map((app) => (
                        <Card key={app.client_id} className="flex flex-col justify-between">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    {app.name}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Conectado em: {app.connected_since ? new Date(app.connected_since).toLocaleDateString() : 'N/A'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground truncate" title={app.redirect}>
                                    Acesso restrito em: {(() => {
                                        try {
                                            // Handle multiple redirects separated by commas
                                            const firstUrl = app.redirect.split(',')[0].trim();
                                            return new URL(firstUrl).hostname;
                                        } catch (e) {
                                            return 'Domínio desconhecido';
                                        }
                                    })()}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-4 border-t">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive" className="w-full">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Revogar Acesso
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                                <ShieldAlert className="h-5 w-5" />
                                                Revogar Permissão
                                            </DialogTitle>
                                            <DialogDescription>
                                                Você tem certeza que deseja revogar o acesso do aplicativo <strong>{app.name}</strong>?
                                                Ele não poderá mais acessar seus dados em nome da sua conta e você será deslogado de sessões futuras lá.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter className="mt-4">
                                            <Button 
                                                variant="destructive" 
                                                onClick={() => revokeAccess(app.client_id)} 
                                                disabled={processing}
                                            >
                                                Sim, Revogar Acesso
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardFooter>
                        </Card>
                    ))}

                    {apps.length === 0 && (
                        <div className="col-span-full border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
                            <ShieldAlert className="h-8 w-8 text-muted-foreground/50" />
                            <p>Você não concedeu permissão de login a nenhum aplicativo recentemente.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
