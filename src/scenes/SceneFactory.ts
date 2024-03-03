import { Scene, Math } from "phaser"
import { getObjectsByName } from "../utils/tileUtils"
import { getAnimationFromDirection } from "../utils/animationUtils"

export const SceneFactory = (
  levelName: string,
  mapName: string,
  mapPath: string,
  tilesetPaths: {tilesetName: string, tilesetPath: string}[] 
) => {
  return class GameLevel extends Scene {
    map: Phaser.Tilemaps.Tilemap
    backgroundLayer: Phaser.Tilemaps.TilemapLayer
    blockingLayer: Phaser.Tilemaps.TilemapLayer
    decorationLayer: Phaser.Tilemaps.TilemapLayer
    doors: Phaser.GameObjects.GameObject[]
    player: Phaser.GameObjects.Sprite
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
    doorsGroup: Phaser.Physics.Arcade.Group

    constructor ()
    {
      super(levelName);
    }

    preload () {
      tilesetPaths.forEach(({tilesetName, tilesetPath}) => {
        this.load.image(`${tilesetName}-tiles`, tilesetPath)
      })
      this.load.tilemapTiledJSON(mapName, mapPath)
    }

    create ()
    {
        this.map = this.add.tilemap(mapName)
        const tiles = tilesetPaths.map(({tilesetName}) => {
          return this.map.addTilesetImage(tilesetName, `${tilesetName}-tiles`) as Phaser.Tilemaps.Tileset
        })

        // Create frames for tiles
        tiles.forEach(tileset => {
          tileset.texCoordinates.forEach((texCoord, index) => {
            const coord = texCoord as { x: number, y: number }
            tileset.image?.add(index, 0, coord.x, coord.y, tileset.tileWidth, tileset.tileHeight)
          })
        })

        // create layers
        this.backgroundLayer = this.map.createLayer('Background', tiles) as Phaser.Tilemaps.TilemapLayer
        this.blockingLayer = this.map.createLayer('Blocking', tiles) as Phaser.Tilemaps.TilemapLayer
        this.decorationLayer = this.map.createLayer('Decorations', tiles) as Phaser.Tilemaps.TilemapLayer
        this.decorationLayer.setDepth(1)

        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys

        // Collisions setup
        this.map.setCollisionBetween(1, 2000, true, true, 'Blocking')
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
  
        // Door setup
        this.doors = this.map.createFromObjects('Objects', { name: 'door' })
        this.doorsGroup = this.physics.add.group({
            collideWorldBounds: true,
            allowGravity: false
        })
        this.doors.forEach((door) => this.doorsGroup.add(door))

        // Player setup
        const playerSpawn = getObjectsByName('playerSpawn', this.map, 'Objects')[0]
        if (playerSpawn) {
          const player = this.createPlayer(playerSpawn)
          this.addPlayer(player)
        }

        // Emit created event
        this.events.emit('created')
    }

    update (time: number, delta: number) {
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body
        playerBody.velocity.x = 0
        playerBody.velocity.y = 0

        const xDir = Number(this.cursors.right.isDown) + Number(this.cursors.left.isDown) * -1
        const yDir = Number(this.cursors.down.isDown) + Number(this.cursors.up.isDown) * -1
        const dir = new Math.Vector2(xDir, yDir).normalize()

        playerBody.velocity.x = dir.x * 10 * (delta)
        playerBody.velocity.y = dir.y * 10 * (delta)

        const animKey = getAnimationFromDirection('player', xDir, yDir)
        if (animKey) {
          this.player.play({ key: animKey }, true)
        }
    }

    enterDoor (p: any, d: any) {
        const player = p as Phaser.GameObjects.GameObject
        const door = d as Phaser.GameObjects.GameObject

        const nextSceneKey = door.data?.get('targetScene')
        const nextScene = this.scene.get(nextSceneKey)

        if (nextScene) {
          this.scene.switch(nextSceneKey)
          nextScene.playerEnter(player, door)
        } else {
          console.warn('Door is not set up correctly or scene does not exist: ', door.data?.getAll())
        }
    }

    async playerEnter (player: Phaser.GameObjects.Sprite, fromDoor: Phaser.GameObjects.GameObject) {
      if (!this.doors) {
        await new Promise((resolve) => {
          this.events.addListener('created', resolve)
        })
      }
      
      this.addPlayer(player)
      const targetDoorName = fromDoor.data.get('targetDoor')
      const targetDoor = this.doors.find((door) => door.data.get('doorName') === targetDoorName)
      const targetDoorBody = targetDoor?.body as Phaser.Physics.Arcade.Body
      const [exitX, exitY]: [number, number] = targetDoor?.data.get(['exitX', 'exitY'])
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body
      playerBody.velocity.x = 0
      playerBody.velocity.y = 0
      playerBody.position.x = targetDoorBody.position.x + exitX * targetDoorBody.width
      playerBody.position.y = targetDoorBody.position.y + exitY * targetDoorBody.height
    }

    createPlayer (playerSpawn: Phaser.Types.Tilemaps.TiledObject): Phaser.GameObjects.Sprite {
      const playerSprite = this.add.sprite(playerSpawn.x as number, playerSpawn.y as number, 'playerDown', 0)
      playerSprite.scale = 16/24

      return playerSprite
    }

    addPlayer (player: Phaser.GameObjects.Sprite) {
      this.player = player
      this.add.existing(this.player)

      this.physics.add.existing(this.player, false)
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body
      playerBody.setCollideWorldBounds(true)

      this.cameras.main.startFollow(this.player)
      this.physics.add.collider(this.player, this.blockingLayer)
      this.physics.add.overlap(this.player, this.doorsGroup, this.enterDoor, undefined, this)
    }
  }
}