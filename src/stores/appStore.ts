import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface AppStore {
  overlay?: string
  setOverlay: (overlay: string) => void
  clearOverlay: () => void
}

export const useAppStore = create<AppStore>()(
  subscribeWithSelector((set, get) => ({
    overlay: undefined,
    setOverlay: (overlay) => set({overlay}),
    clearOverlay: () => set({ overlay: undefined})
  }))
)