import { create } from 'zustand';

interface UIState {
  isCommandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
}

export const useCommandPalette = create<UIState>((set) => ({
  isCommandPaletteOpen: false,
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
}));