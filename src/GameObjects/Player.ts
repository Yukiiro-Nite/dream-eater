import { Math } from 'phaser'
import { GameLevel } from '../scenes/SceneFactory'
import { getAnimationFromDirection } from '../utils/animationUtils'

export class Player {
  sprite: Phaser.GameObjects.Sprite
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
    const playerBody = this.sprite.body as Phaser.Physics.Arcade.Body
    playerBody.velocity.x = 0
    playerBody.velocity.y = 0

    const xDir = Number(cursors.right.isDown) + Number(cursors.left.isDown) * -1
    const yDir = Number(cursors.down.isDown) + Number(cursors.up.isDown) * -1
    const dir = new Math.Vector2(xDir, yDir).normalize()

    playerBody.velocity.x = dir.x * 10 * (delta)
    playerBody.velocity.y = dir.y * 10 * (delta)

    const animKey = getAnimationFromDirection('player', xDir, yDir)
    if (animKey) {
      this.sprite.play({ key: animKey }, true)
    }
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