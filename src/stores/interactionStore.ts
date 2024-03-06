import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Statement } from "../data/npcs";

export interface InteractionStore {
  npcId?: string
  statement?: Statement
  setNpcId: (npcId: string) => void
  setStatement: (statement: Statement) => void
}

export const useInteractionStore = create<InteractionStore>()(
  subscribeWithSelector((set, get) => ({
    npcId: undefined,
    statement: undefined,
    setNpcId: (npcId) => set({ npcId }),
    setStatement: (statement) => {
      statement.action?.()
      return set({ statement })
    }
  }))
)