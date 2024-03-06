import React, { useCallback } from 'react'
import { useAppStore } from '../../../stores/appStore'
import './ContinueReply.css'


export const ContinueReply = () => {
  const clearOverlay = useAppStore((state) => state.clearOverlay)
  const handleClick = useCallback(() => {
    clearOverlay()
  }, [])

  return (
    <button className="ContinueReplyButton" onClick={handleClick}>
      Continue
    </button>
  )
}