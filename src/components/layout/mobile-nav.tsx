'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { navigation } from '@/config/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

export function MobileNav() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden fixed left-4 top-4 z-50">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <span className="font-semibold">Тендерный Конвейер</span>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="px-3 mb-2 text-xs font-semibold text-neutral-400 uppercase">
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 rounded-lg text-sm font-medium',
                      isActive ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}