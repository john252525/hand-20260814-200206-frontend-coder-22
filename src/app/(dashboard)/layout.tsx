import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-neutral-50">
        {/* Desktop Sidebar */}
        <Sidebar />
        {/* Mobile Nav */}
        <MobileNav />
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Header />
          <main className="p-6 flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}