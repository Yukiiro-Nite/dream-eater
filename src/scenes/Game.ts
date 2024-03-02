import { Scene } from 'phaser';

export class Game extends Scene
{
    map: Phaser.Tilemaps.Tilemap
    backgroundLayer: Phaser.Tilemaps.TilemapLayer | null
    blockingLayer: Phaser.Tilemaps.TilemapLayer | null
    decorationLayer: Phaser.Tilemaps.TilemapLayer | null

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.map = this.make.tilemap({ key: 'city' })
        this.map.addTilesetImage('kenny-city', 'cityTiles')

        // create layers
        this.backgroundLayer = this.map.createLayer('Background', 'cityTiles')
        this.blockingLayer = this.map.createLayer('Blocking', 'cityTiles')
        this.decorationLayer = this.map.createLayer('Decoration', 'cityTiles')

        this.map.setCollisionBetween(1, 2000, true, false, 'Blocking')

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

        this.input.once('pointerdown', () => {
            this.scene.start('GameOver');
        });
    }
}
