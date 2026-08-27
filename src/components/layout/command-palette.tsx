'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useCommandPalette } from '@/lib/stores/ui-store';
import { useTenders } from '@/lib/hooks/use-tenders';
import { useSuppliers } from '@/lib/hooks/use-suppliers';
import { navigation } from '@/config/navigation';
import {
  LayoutDashboard, FileText, Users, MessageSquare, FileCheck, Handshake, ClipboardCheck, BarChart3, Settings, Shield, Files, ListTodo, Plus, Search, Sun, Moon, ArrowRight, type LucideIcon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils/cn';

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
  badge?: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { isOpen, toggleCommandPalette } = useCommandPalette();
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);

  const { data: tenders } = useTenders({ per_page: 10, search: query || undefined });
  const { data: suppliers } = useSuppliers({ per_page: 10, search: query || undefined });

  const staticCommands: CommandItem[] = [
    { id: 'create-tender', label: 'Создать тендер', icon: Plus, action: () => router.push('/tenders/create'), group: 'Действия' },
    { id: 'toggle-theme', label: 'Переключить тему', icon: theme === 'dark' ? Sun : Moon, action: () => setTheme(theme === 'dark' ? 'light' : 'dark'), group: 'Система' },
  ];

  const navCommands: CommandItem[] = navigation.flatMap(section =>
    section.items.map(item => ({
      id: `nav-${item.key}`, label: item.label, icon: iconMap[item.icon], action: () => router.push(item.href), group: 'Навигация', keywords: [item.label]
    }))
  );

  const tenderCommands: CommandItem[] = (tenders || []).map(t => ({
    id: `tender-${t.id}`, label: t.title, icon: FileText, action: () => router.push(`/tenders/${t.id}`), group: 'Тендеры', keywords: [t.title]
  }));

  const supplierCommands: CommandItem[] = (suppliers || []).map(s => ({
    id: `supplier-${s.id}`, label: s.name, icon: Users, action: () => router.push(`/suppliers/${s.id}`), group: 'Поставщики', keywords: [s.name]
  }));

  const allCommands = [...staticCommands, ...navCommands, ...tenderCommands, ...supplierCommands];

  const filtered = allCommands.filter(c => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return c.label.toLowerCase().includes(q) || c.keywords?.some(k => k.toLowerCase().includes(q));
  });

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
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Поиск команд, тендеров, поставщиков..."
              className="flex-1 h-14 bg-transparent outline-none text-base"
              autoFocus
            />
            <kbd className="text-xs text-neutral-400">ESC</kbd>
          </div>
          <Command.List className="max-h-[400px] overflow-y-auto p-2">
            {Object.entries(grouped).map(([group, items]) => (
              <Command.Group key={group} heading={group}>
                {items.map(cmd => (
                  <Command.Item
                    key={cmd.id}
                    onSelect={() => { cmd.action(); toggleCommandPalette(); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-neutral-100"
                  >
                    {cmd.icon && <cmd.icon className="h-4 w-4 text-neutral-500" />}
                    <span className="flex-1 truncate">{cmd.label}</span>
                    {cmd.badge && <span className="text-xs text-neutral-400">{cmd.badge}</span>}
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