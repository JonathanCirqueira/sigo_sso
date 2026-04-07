import { Form, Head, Link } from '@inertiajs/react';
import {
    Fingerprint,
    LogIn,
    ShieldCheck,
    UserRound,
} from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({ status, canResetPassword, canRegister }: Props) {
    return (
        <>
            <Head title="Entrar no Sigo SSO" />

            {status && (
                <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    {status}
                </div>
            )}

            <Card className="w-full border-0 shadow-[0_20px_40px_rgba(42,52,57,0.06)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                {/* Header — editorial focal point */}
                <div className="flex flex-col items-center gap-3 px-8 pt-8 pb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5f5e61] shadow-sm dark:bg-[#c8cfd3]">
                        <ShieldCheck className="h-6 w-6 text-white dark:text-[#1a1f22]" />
                    </div>
                    <div className="space-y-1 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Entrar no Sigo SSO
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Acesse sua conta corporativa com segurança
                        </p>
                    </div>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col"
                >
                    {({ processing, errors }) => (
                        <>
                            <CardContent className="grid gap-5 px-8 py-6">
                                {/* Email */}
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-foreground"
                                    >
                                        E-mail
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="seu@empresa.com"
                                        className="h-10 bg-card transition-all focus:ring-2 focus:ring-ring/30"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Senha */}
                                <div className="grid gap-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium text-foreground"
                                        >
                                            Senha
                                        </Label>
                                        {canResetPassword && (
                                            <Link
                                                href={request()}
                                                tabIndex={5}
                                                className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                                            >
                                                Esqueceu a senha?
                                            </Link>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-10 bg-card transition-all focus:ring-2 focus:ring-ring/30"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Lembrar */}
                                <div className="flex items-center gap-2.5">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                        className="rounded"
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="cursor-pointer text-sm text-muted-foreground"
                                    >
                                        Manter conectado
                                    </Label>
                                </div>

                                {/* Botão principal */}
                                <Button
                                    type="submit"
                                    className="mt-1 h-11 w-full gap-2 bg-[#5f5e61] text-white shadow-sm transition-all hover:bg-[#535255] hover:shadow-md active:scale-[0.98] dark:bg-[#c8cfd3] dark:text-[#1a1f22] dark:hover:bg-[#b8c0c4]"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                    style={{
                                        background:
                                            'linear-gradient(135deg, #5f5e61 0%, #535255 100%)',
                                    }}
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        <LogIn className="h-4 w-4" />
                                    )}
                                    Entrar
                                </Button>
                            </CardContent>

                            {/* Footer */}
                            {canRegister && (
                                <CardFooter className="flex justify-center border-t border-border/50 px-8 py-5">
                                    <p className="text-sm text-muted-foreground">
                                        Não tem uma conta?{' '}
                                        <Link
                                            href={register()}
                                            tabIndex={8}
                                            className="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
                                        >
                                            Criar uma conta
                                        </Link>
                                    </p>
                                </CardFooter>
                            )}
                        </>
                    )}
                </Form>
            </Card>
        </>
    );
}

Login.layout = {
    title: 'Entrar no Sigo SSO',
    description: 'Acesse com seu e-mail e senha corporativos',
};
