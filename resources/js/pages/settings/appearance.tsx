import { Head } from '@inertiajs/react';
import AppearanceToggleTab from '@/components/appearance-tabs';
import Heading from '@/components/heading';

export default function Appearance() {
    return (
        <>
            <Head title="Configurações de Aparência" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Configurações de Aparência"
                    description="Personalize o tema visual da sua conta"
                />

                <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        Tema
                    </p>
                    <AppearanceToggleTab />
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Aparência',
            href: '/settings/appearance',
        },
    ],
};
