'use client';

import { useAppHotkeys } from '@/lib/hooks/use-app-hotkeys';

export function Hotkeys() {
  useAppHotkeys();
  return null;
}