import { Transition } from '@headlessui/react';
import { Form, Head, Link } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    mustVerifyEmail: boolean;
    status?: string;
    auth: {
        user: {
            name: string;
            email: string;
            email_verified_at: string | null;
        };
    };
};

export default function Profile({ mustVerifyEmail, status, auth }: Props) {

    return (
        <>
            <Head title="Configurações de Perfil" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Informações do Perfil"
                    description="Atualize as informações de perfil e o endereço de e-mail da sua conta"
                />

                <Form
                    {...ProfileController.update.form({
                        name: auth.user.name,
                        email: auth.user.email,
                    })}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ errors, processing, recentlySuccessful }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>

                                <Input
                                    id="name"
                                    name="name"
                                    className="mt-1 block w-full"
                                    required
                                    autoComplete="name"
                                />

                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>

                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    className="mt-1 block w-full"
                                    required
                                    autoComplete="username"
                                />

                                <InputError message={errors.email} />
                            </div>

                            {mustVerifyEmail && auth.user.email_verified_at === null && (
                                <div>
                                    <p className="mt-2 text-sm text-neutral-800">
                                        Seu endereço de e-mail não foi verificado.
                                        <Link
                                            href="/email/verification-notification"
                                            method="post"
                                            as="button"
                                            className="ml-1 rounded-md text-sm text-neutral-600 underline hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Clique aqui para reenviar o e-mail de verificação.
                                        </Link>
                                    </p>

                                    {status === 'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            Um novo link de verificação foi enviado para o seu endereço de e-mail.
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Salvar Perfil</Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">
                                        Salvo.
                                    </p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Perfil',
            href: '/settings/profile',
        },
    ],
};
