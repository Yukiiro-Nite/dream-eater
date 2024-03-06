import React, { useCallback, useMemo } from 'react'
import { getStatementById, type Reply as ReplyType } from '../../../data/npcs'
import { useInteractionStore } from '../../../stores/interactionStore'
import { useAppStore } from '../../../stores/appStore'
import './Reply.css'

export interface ReplyProps {
  npcId?: string
  reply: ReplyType
}

export const Reply = ({ npcId, reply }: ReplyProps) => {
  const setStatement = useInteractionStore((state) => state.setStatement)
  const clearOverlay = useAppStore((state) => state.clearOverlay)
  const condition = useMemo(() => {
    if (!reply.condition) return true

    return reply.condition()
  }, [reply])
  const handleClick = useCallback(() => {
    reply.action?.()
    const nextStatement = getStatementById(npcId, reply.nextStatementId)

    if (!nextStatement) {
      clearOverlay()
    } else {
      setStatement(nextStatement)
    }
  }, [reply])

  if (!condition) return

  return (
    <button className="ReplyButton" onClick={handleClick}>
      {reply.text}
    </button>
  )
}