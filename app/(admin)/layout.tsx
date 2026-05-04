import React from 'react';
import { AdminSidebarWrapper } from '@/components/admin/AdminSidebarWrapper';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      <AdminSidebarWrapper>{children}</AdminSidebarWrapper>
    </div>
  );
}
