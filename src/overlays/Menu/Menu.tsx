import React, { useEffect } from 'react'
import { useAppStore } from '../../stores/appStore'

export const Menu = () => {
  const {overlay, setOverlay, clearOverlay} = useAppStore()

  useEffect(() => {
    const toggleMenu = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      if (!overlay) {
        setOverlay('menu')
      } else {
        clearOverlay()
      }
    }

    document.addEventListener('keydown', toggleMenu)

    return () => {
      document.removeEventListener('keydown', toggleMenu)
    }
  }, [overlay, setOverlay, clearOverlay])

  return (
    <h1>Menu</h1>
  )
}