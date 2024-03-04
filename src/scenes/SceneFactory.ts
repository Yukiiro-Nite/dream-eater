import { Scene } from "phaser"
import { getObjectsByName } from "../utils/tileUtils"
import { NPC } from "../GameObjects/NPC"
import { getNpcById } from "../data/npcs"
import { Player } from "../GameObjects/Player"

export interface GameLevel extends Scene {
  map: Phaser.Tilemaps.Tilemap
  backgroundLayer: Phaser.Tilemaps.TilemapLayer
  blockingLayer: Phaser.Tilemaps.TilemapLayer
  decorationLayer: Phaser.Tilemaps.TilemapLayer
  doors: Phaser.GameObjects.GameObject[]
  player: Player
  cursors: Phaser.Types.Input.Keyboard.CursorKeys
  doorsGroup: Phaser.Physics.Arcade.Group
  npcs: NPC[]

  enterDoor: (player: any, door: any) => void
  playerEnter: (player: Player, fromDoor: Phaser.GameObjects.GameObject) => Promise<void>
}

export const SceneFactory = (
  levelName: string,
  mapName: string,
  mapPath: string,
  tilesetPaths: {tilesetName: string, tilesetPath: string}[] 
) => {
  return class CustomGameLevel extends Scene implements GameLevel {
    map: Phaser.Tilemaps.Tilemap
    backgroundLayer: Phaser.Tilemaps.TilemapLayer
    blockingLayer: Phaser.Tilemaps.TilemapLayer
    decorationLayer: Phaser.Tilemaps.TilemapLayer
    doors: Phaser.GameObjects.GameObject[]
    player: Player
    cursors: Phaser.Types.Input.Keyboard.CursorKeys
    doorsGroup: Phaser.Physics.Arcade.Group
    npcs: NPC[]

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
          this.player = new Player(this, playerSpawn)
        }

        // NPC setup
        const npcObjects = getObjectsByName('npc', this.map, 'Objects')
        this.npcs = npcObjects
          .map((obj) => {
            const npcId = obj.properties?.find((prop: {name: string, value: string}) => prop.name === 'npcId')?.value
            if (!npcId) return

            const npcConfig = getNpcById(npcId)
            if(!npcConfig) return
            
            return new NPC(this, npcConfig)
          })
          .filter(Boolean) as unknown as NPC[]

        // Emit created event
        this.events.emit('created')
    }

    update (time: number, delta: number) {
      this.player?.update(this.cursors, delta)
    }

    enterDoor (p: any, d: any) {
        const door = d as Phaser.GameObjects.GameObject

        const nextSceneKey = door.data?.get('targetScene')
        const nextScene = this.scene.get(nextSceneKey)

        if (nextScene) {
          this.scene.switch(nextSceneKey)
          nextScene.playerEnter(this.player, door)
        } else {
          console.warn('Door is not set up correctly or scene does not exist: ', door.data?.getAll())
        }
    }

    async playerEnter (player: Player, fromDoor: Phaser.GameObjects.GameObject) {
      if (!this.doors) {
        await new Promise((resolve) => {
          this.events.addListener('created', resolve)
        })
      }
      
      this.player = player
      this.player.addToScene(this)

      const targetDoorName = fromDoor.data.get('targetDoor')
      const targetDoor = this.doors.find((door) => door.data.get('doorName') === targetDoorName)
      const targetDoorBody = targetDoor?.body as Phaser.Physics.Arcade.Body
      const [exitX, exitY]: [number, number] = targetDoor?.data.get(['exitX', 'exitY'])
      this.player.setVelocity(0, 0)
      this.player.setPosition(
        targetDoorBody.position.x + exitX * targetDoorBody.width,
        targetDoorBody.position.y + exitY * targetDoorBody.height
      )
    }
  }
}