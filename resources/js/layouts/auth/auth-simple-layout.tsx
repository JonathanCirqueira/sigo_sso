import { Link } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-background p-4 md:p-8">
            {/* Subtle background texture */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(95,94,97,0.04)_0%,_transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(200,207,211,0.04)_0%,_transparent_60%)]" />

            <div className="relative z-10 w-full max-w-sm">
                {/* Wordmark topo */}
                <div className="mb-6 flex justify-center">
                    <Link
                        href={home()}
                        className="group flex items-center gap-2 opacity-70 transition-opacity hover:opacity-100"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground/10 transition-colors group-hover:bg-foreground/15">
                            <ShieldCheck className="h-4 w-4 text-foreground" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-foreground">
                            Sigo SSO
                        </span>
                    </Link>
                </div>

                {/* Card principal */}
                {children}

                {/* Footer legal */}
                <p className="mt-6 text-center text-[11px] text-muted-foreground/50">
                    Ao continuar, você concorda com os{' '}
                    <a
                        href="#"
                        className="underline underline-offset-2 hover:text-muted-foreground"
                    >
                        Termos de Serviço
                    </a>{' '}
                    e a{' '}
                    <a
                        href="#"
                        className="underline underline-offset-2 hover:text-muted-foreground"
                    >
                        Política de Privacidade
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}
