import React from 'react'
import { useInteractionStore } from '../../stores/interactionStore'
import { getNpcById } from '../../data/npcs'
import { ContinueReply } from './ContinueReply/ContinueReply'
import { Reply } from './Reply/Reply'
import './InteractionOverlay.css'

export const InteractionOverlay = () => {
  const { npcId, statement } = useInteractionStore()
  const npcConfig = getNpcById(npcId)
  const replies = statement?.replyId
    ? npcConfig?.replies[statement?.replyId]
    : undefined
  
  const replyElements = replies
    ? replies.map((reply, index) => <Reply key={`${statement?.replyId}_${index}`} reply={reply} npcId={npcId} />)
    : (<ContinueReply />)

  return (
    <div className="InteractionWrapper">
      <h1 className="Name">{npcConfig?.displayName}</h1>
      <p className="Text">{statement?.text}</p>
      <div className="ReplyWrapper">
        {replyElements}
      </div>
    </div>
  )
}