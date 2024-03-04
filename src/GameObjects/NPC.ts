import { NPCConfig, Statement } from '../data/npcs'
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

  getDefaultStatement (): Statement | undefined {
    const defaultStatementConf = this.config.defaultStatement
    let defaultStatement
    if (typeof defaultStatementConf === 'function') {
      defaultStatement = defaultStatementConf()
    } else {
      defaultStatement = defaultStatementConf
    }

    if (!defaultStatement) {
      console.warn(`NPC ${this.config.id} is not configured correctly, please set a defaultStatement`)
      return
    }

    const statement = this.config.statements[defaultStatement]

    if (!statement) {
      console.warn(`NPC ${this.config.id} does not have a statement for: `, defaultStatement)
      return
    }

    return statement
  }
  
  interact (player: Player) {
    const statement = this.getDefaultStatement()
    if (!statement) return
    
    player.interacting = true
    this.interactingPlayer = player
    this.showInteraction(statement)
  }

  showInteraction (statement: Statement) {
    // Looks like Phaser doesn't have alot for handling UI
    // So I guess I'll have to use HTML.
    console.log(statement.text)
  }
}