import React, { JSXElementConstructor } from 'react'
import { InteractionOverlay } from './overlays/InteractionOverlay/InteractionOverlay'
import { Menu } from './overlays/Menu/Menu'
import { useAppStore } from './stores/appStore'
import classNames from 'classnames'
import './App.css'

const overlays = {
  interaction: InteractionOverlay,
  menu: Menu
} as Record<string, JSXElementConstructor<any>>

export const App = () => {
  const currentOverlay = useAppStore((state) => state.overlay)

  const overlayWrapperClasses = classNames('OverlayWrapper', { hasOverlay: currentOverlay })
  const overlayElements = Object.entries(overlays).map(([name, Overlay]) => (
    <div
      key={name}
      className={classNames('InnerWrapper', { visible: name === currentOverlay })}
    >
      <Overlay />
    </div>
  ))
  return (
    <div className={overlayWrapperClasses}>
      {overlayElements}
    </div>
  )
}