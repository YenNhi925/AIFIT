import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminFooter } from './AdminFooter';

interface AdminLayoutProps {
  breadcrumbs: string[];
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ breadcrumbs, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#202124] flex font-body selection:bg-gold/30 selection:text-obsidian">
      {/* Dark Sidebar */}
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main Workspace */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-250 ease-in-out ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Sticky Admin Header */}
        <AdminHeader
          breadcrumbs={breadcrumbs}
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Admin Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};
