import { Scene, Math } from 'phaser';

export class Game extends Scene
{
    map: Phaser.Tilemaps.Tilemap
    backgroundLayer: Phaser.Tilemaps.TilemapLayer
    blockingLayer: Phaser.Tilemaps.TilemapLayer
    decorationLayer: Phaser.Tilemaps.TilemapLayer
    doors: Phaser.GameObjects.GameObject[]
    player: Phaser.GameObjects.GameObject
    cursors: Phaser.Types.Input.Keyboard.CursorKeys

    constructor ()
    {
        super('Game');
    }

    preload () {
        this.load.image('cityTiles', 'assets/tilemaps/kenny-city.png')
        this.load.tilemapTiledJSON('city', 'assets/tilemaps/city.json')
    }

    create ()
    {
        this.map = this.add.tilemap('city')
        const tiles = this.map.addTilesetImage('kenny-city', 'cityTiles') as Phaser.Tilemaps.Tileset
        const cityTilesTexture = this.textures.get('cityTiles')

        // Create frames for tiles
        tiles.texCoordinates.forEach((texCoord, index) => {
            const coord = texCoord as { x: number, y: number }
            cityTilesTexture.add(index, 0, coord.x, coord.y, tiles.tileWidth, tiles.tileHeight)
        })

        // create layers
        this.backgroundLayer = this.map.createLayer('Background', tiles) as Phaser.Tilemaps.TilemapLayer
        this.blockingLayer = this.map.createLayer('Blocking', tiles) as Phaser.Tilemaps.TilemapLayer

        // Door setup
        this.doors = this.map.createFromObjects('Objects', { name: 'door' })

        // Player setup
        this.player = this.map.createFromObjects('Objects', { name: 'playerSpawn' })[0]
        this.physics.add.existing(this.player, false)
        const playerBody = this.player.body as Phaser.Physics.Arcade.Body
        playerBody.setCollideWorldBounds(true)

        this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys

        // Collisions setup
        this.map.setCollisionBetween(1, 2000, true, true, 'Blocking')
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.cameras.main.startFollow(this.player)
        this.physics.add.collider(this.player, this.blockingLayer)

        // Need to add decorations last so the player can pass behind them.
        this.decorationLayer = this.map.createLayer('Decorations', tiles) as Phaser.Tilemaps.TilemapLayer
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
    }
}
