'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { SessionProvider } from 'next-auth/react';

export function AdminSidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  return (
    <SessionProvider>
      {!isLoginPage && <AdminSidebar />}
      <main className={`flex-1 ${!isLoginPage ? 'pb-20 md:pb-0' : ''}`}>{children}</main>
    </SessionProvider>
  );
}
