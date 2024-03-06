import { NPCConfig, Statement, getDefaultStatement } from '../data/npcs'
import { useAppStore } from '../stores/appStore'
import { useInteractionStore } from '../stores/interactionStore'
import { Player } from './Player'

export class NPC {
  scene: Phaser.Scene
  sprite: Phaser.GameObjects.Sprite
  config: NPCConfig
  interactingPlayer?: Player

  constructor (scene: Phaser.Scene, config: NPCConfig, obj: Phaser.Types.Tilemaps.TiledObject) {
    this.scene = scene
    this.config = config

    const x = (obj.x ?? 0) + (obj.width ?? 0) / 2
    const y = (obj.y ?? 0) + (obj.height ?? 0) / 2
    this.sprite = scene.add.sprite(x, y, config.texture || 'empty', 0)
    scene.physics.add.existing(this.sprite, false)
  }
  
  interact (player: Player) {
    const statement = getDefaultStatement(this.config.id)
    if (!statement) return

    const { setNpcId, setStatement } = useInteractionStore.getState()
    const { setOverlay } = useAppStore.getState()
    
    player.interacting = true
    this.interactingPlayer = player
    setNpcId(this.config.id)
    setStatement(statement)
    setOverlay('interaction')
  }
}