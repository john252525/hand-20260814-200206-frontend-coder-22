'use client';

import { useHotkeys } from 'react-hotkeys-hook';
import { useRouter } from 'next/navigation';
import { useCommandPalette } from '@/lib/stores/ui-store';

export function useAppHotkeys() {
  const router = useRouter();
  const { toggleCommandPalette } = useCommandPalette();

  useHotkeys('ctrl+k, meta+k', (e) => {
    e.preventDefault();
    toggleCommandPalette();
  });

  useHotkeys('ctrl+n, meta+n', (e) => {
    e.preventDefault();
    router.push('/tenders/create');
  });

  useHotkeys('g t', () => router.push('/tenders'));
  useHotkeys('g s', () => router.push('/suppliers'));
  useHotkeys('g c', () => router.push('/communications'));
  useHotkeys('g a', () => router.push('/analytics'));
}