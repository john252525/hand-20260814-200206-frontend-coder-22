'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCommandPalette } from '@/lib/stores/ui-store';
import { useTenders } from '@/lib/hooks/use-tenders';
import { useSuppliers } from '@/lib/hooks/use-suppliers';
import { navigation } from '@/config/navigation';
import {
  LayoutDashboard, FileText, Users, MessageSquare, FileCheck, Handshake, ClipboardCheck, BarChart3, Settings, Shield, Files, ListTodo, Plus, Search, Sun, Moon, type LucideIcon
} from 'lucide-react';
import { useTheme } from 'next-themes';

const iconMap: Record<string, LucideIcon> = {
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

interface CommandItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  action: () => void;
  group: string;
  keywords?: string[];
}

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, toggleCommandPalette } = useCommandPalette();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');

  const { data: tendersData } = useTenders({ per_page: 5, search: query || undefined });
  const { data: suppliersData } = useSuppliers({ search: query || undefined, per_page: 5 });

  const tenders = tendersData?.data || [];
  const suppliers = suppliersData?.data || [];

  const staticCommands: CommandItem[] = [
    { id: 'create-tender', label: 'Создать тендер', icon: Plus, action: () => router.push('/tenders/create'), group: 'Действия' },
    { id: 'toggle-theme', label: 'Переключить тему', icon: theme === 'dark' ? Sun : Moon, action: () => setTheme(theme === 'dark' ? 'light' : 'dark'), group: 'Система' },
  ];

  const navCommands: CommandItem[] = navigation.flatMap(section =>
    section.items.map(item => ({ id: `nav-${item.key}`, label: item.label, icon: iconMap[item.icon], action: () => router.push(item.href), group: 'Навигация', keywords: [item.label.toLowerCase()] }))
  );

  const tenderCommands: CommandItem[] = tenders.map(t => ({ id: `tender-${t.id}`, label: t.title, icon: FileText, action: () => router.push(`/tenders/${t.id}`), group: 'Тендеры', keywords: [t.title.toLowerCase()] }));
  const supplierCommands: CommandItem[] = suppliers.map(s => ({ id: `supplier-${s.id}`, label: s.name, icon: Users, action: () => router.push(`/suppliers/${s.id}`), group: 'Поставщики', keywords: [s.name.toLowerCase()] }));

  const allCommands = [...staticCommands, ...navCommands, ...tenderCommands, ...supplierCommands];

  const filtered = useMemo(() => {
    if (!query.trim()) return allCommands;
    const q = query.toLowerCase();
    return allCommands.filter(c => c.label.toLowerCase().includes(q) || c.keywords?.some(k => k.includes(q)));
  }, [query, allCommands]);

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, cmd) => {
    (acc[cmd.group] ||= []).push(cmd);
    return acc;
  }, {});

  return (
    <Dialog open={isOpen} onOpenChange={toggleCommandPalette}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden">
        <Command className="rounded-lg">
          <div className="flex items-center border-b px-3">
            <Search className="h-5 w-5 text-neutral-400 mr-3 shrink-0" />
            <Command.Input value={query} onValueChange={setQuery} placeholder="Поиск команд, тендеров, поставщиков..." className="flex-1 h-14 bg-transparent outline-none text-base" autoFocus />
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            {Object.entries(grouped).map(([group, items]) => (
              <Command.Group key={group} heading={group}>
                {items.map(cmd => (
                  <Command.Item key={cmd.id} onSelect={() => { cmd.action(); toggleCommandPalette(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-neutral-100">
                    {cmd.icon && <cmd.icon className="h-4 w-4 text-neutral-500" />}
                    <span className="flex-1 truncate">{cmd.label}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}