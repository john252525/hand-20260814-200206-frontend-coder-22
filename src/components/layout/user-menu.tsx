'use client';

import { useAuthStore } from '@/lib/stores/auth-store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : user.email?.[0]?.toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user.name || user.email}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="h-4 w-4 mr-2" />
          Настройки
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/profile')}>
          <User className="h-4 w-4 mr-2" />
          Профиль
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}