'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { navigation } from '@/config/navigation';
import {
  LayoutDashboard, FileText, Users, MessageSquare, FileCheck, Handshake, ClipboardCheck, BarChart3, Settings, Shield, Files, ListTodo,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { UserMenu } from '@/components/layout/user-menu';

export function Sidebar() {
  const pathname = usePathname();

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    dashboard: LayoutDashboard,
    tenders: FileText,
    suppliers: Users,
    communications: MessageSquare,
    offers: FileCheck,
    negotiations: Handshake,
    decisions: ClipboardCheck,
    analytics: BarChart3,
    files: Files,
    tasks: ListTodo,
    settings: Settings,
    admin: Shield,
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-64 flex-col bg-white border-r border-neutral-200">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-neutral-200">
        <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">ТК</div>
        <span className="font-semibold text-neutral-900">Тендерный Конвейер</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="px-3 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="p-4 border-t border-neutral-200">
        <UserMenu />
      </div>
    </aside>
  );
}