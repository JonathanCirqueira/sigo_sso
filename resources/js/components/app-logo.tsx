import { ShieldCheck } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5f5e61] shadow-sm dark:bg-[#c8cfd3]">
                <ShieldCheck className="h-4 w-4 text-white dark:text-[#1a1f22]" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    SIGO SSO
                </span>
            </div>
        </>
    );
}
