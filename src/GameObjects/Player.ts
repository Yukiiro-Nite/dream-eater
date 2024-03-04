import { Math } from 'phaser'
import { GameLevel } from '../scenes/SceneFactory'
import { getAnimationFromDirection, getDirectionFromAnimationKey } from '../utils/animationUtils'

export class Player {
  interacting: boolean
  sprite: Phaser.GameObjects.Sprite
  animKey?: string

  constructor (scene: GameLevel, playerSpawn: Phaser.Types.Tilemaps.TiledObject) {
    this.sprite = scene.add.sprite(playerSpawn.x as number, playerSpawn.y as number, 'playerDown', 0)
    this.sprite.scale = 16/24

    this.addToScene(scene)
  }

  addToScene (scene: GameLevel) {
    scene.add.existing(this.sprite)

    scene.physics.add.existing(this.sprite, false)
    const playerBody = this.sprite.body as Phaser.Physics.Arcade.Body
    playerBody.setCollideWorldBounds(true)

    scene.cameras.main.startFollow(this.sprite)
    scene.physics.add.collider(this.sprite, scene.blockingLayer)
    scene.physics.add.overlap(this.sprite, scene.doorsGroup, scene.enterDoor.bind(scene), undefined, this)
  }

  update (cursors: Phaser.Types.Input.Keyboard.CursorKeys, delta: number) {
    // if (this.interacting) return

    const playerBody = this.sprite.body as Phaser.Physics.Arcade.Body
    playerBody.velocity.x = 0
    playerBody.velocity.y = 0

    const xDir = Number(cursors.right.isDown) + Number(cursors.left.isDown) * -1
    const yDir = Number(cursors.down.isDown) + Number(cursors.up.isDown) * -1
    const dir = new Math.Vector2(xDir, yDir).normalize()

    playerBody.velocity.x = dir.x * 10 * (delta)
    playerBody.velocity.y = dir.y * 10 * (delta)

    this.animKey = getAnimationFromDirection('player', xDir, yDir)
    if (this.animKey) {
      this.sprite.play({ key: this.animKey }, true)
    }
  }

  interact (scene: GameLevel) {
    const dir = getDirectionFromAnimationKey(this.animKey)
    const x = (this.sprite.body?.position.x ?? 0) + dir.x * this.sprite.width / 2
    const y = (this.sprite.body?.position.y ?? 0) + dir.y * this.sprite.height / 2

    const npc = scene.npcs.filter(npc => {
      const npcBody = npc.sprite?.body as Phaser.Physics.Arcade.Body
      if (!npcBody) return

      return npcBody.hitTest(x, y)
    })[0]

    if (!npc) return

    npc.interact(this)
  }

  setVelocity (x: number, y: number) {
    const playerBody = this.sprite.body as Phaser.Physics.Arcade.Body
    playerBody.velocity.x = x
    playerBody.velocity.y = y
  }

  setPosition (x: number, y: number) {
    const playerBody = this.sprite.body as Phaser.Physics.Arcade.Body
    playerBody.position.x = x
    playerBody.position.y = y
  }
}