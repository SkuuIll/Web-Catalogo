'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { AdvancedModeProvider } from './AdvancedModeProvider';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmDialogProvider } from '@/components/ui/ConfirmDialog';

export function AdminSidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  return (
    <SessionProvider>
      <AdvancedModeProvider>
        <ToastProvider>
          <ConfirmDialogProvider>
            {!isLoginPage && <AdminSidebar />}
            <main className={`flex-1 overflow-x-hidden ${!isLoginPage ? 'pb-20 md:pb-0' : ''}`}>
              {children}
            </main>
          </ConfirmDialogProvider>
        </ToastProvider>
      </AdvancedModeProvider>
    </SessionProvider>
  );
}
