import { Link } from '@inertiajs/react';
import { Palette, ShieldCheck, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: '/settings/profile',
        icon: User,
    },
    {
        title: 'Segurança',
        href: '/settings/security',
        icon: ShieldCheck,
    },
    {
        title: 'Aparência',
        href: '/settings/appearance',
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="px-4 py-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <Heading
                    title="Configurações"
                    description="Gerencie as configurações da sua conta e preferências de visualização"
                />
            </div>
            
            <Separator className="my-8" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="w-full max-w-xs lg:w-64">
                    <nav className="flex flex-col space-y-1">
                        {sidebarNavItems.map((item) => {
                             const Icon = item.icon as any;
                             const active = isCurrentOrParentUrl(item.href);
                             return (
                                <Link
                                    key={typeof item.href === 'string' ? item.href : JSON.stringify(item.href)}
                                    href={typeof item.href === 'string' ? item.href : (item.href as any).url}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                        active 
                                            ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100" 
                                            : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/50 dark:hover:text-neutral-100"
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <div className="flex-1 lg:max-w-4xl">
                    <div className="space-y-12">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
