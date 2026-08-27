'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Bell, Command, Plus, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useCommandPalette } from '@/lib/stores/ui-store';
import { useNotificationStore } from '@/lib/stores/notification-store';

export function Header() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { toggleCommandPalette } = useCommandPalette();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/tenders?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white px-6">
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск тендеров, поставщиков..."
            className="pl-9 pr-16"
          />
          <button
            type="button"
            onClick={toggleCommandPalette}
            className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 text-xs text-neutral-500 hover:bg-neutral-200"
          >
            <Command className="h-3 w-3" /> Ctrl+K
          </button>
        </div>
      </form>
      <div className="flex items-center gap-2">
        <Button onClick={() => router.push('/tenders/create')}>
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Новый тендер</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>
              <div className="flex justify-between items-center">
                <span>Уведомления</span>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-primary-600 hover:underline">Прочитать все</button>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-neutral-500">Нет уведомлений</div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start py-3 cursor-pointer">
                    <div className="text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-neutral-500 mt-1">{n.message}</div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}