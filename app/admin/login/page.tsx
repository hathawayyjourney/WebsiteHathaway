import Image from 'next/image';
import type { Metadata } from 'next';
import LoginForm from '@/src/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Login' };

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-[20px] shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Hathaway Journey" width={160} height={50} className="h-12 w-auto object-contain" priority />
        </div>
        <h1 className="text-center text-lg font-black text-brand-navy mb-6">ADMIN PANEL</h1>
        <LoginForm />
      </div>
    </main>
  );
}
