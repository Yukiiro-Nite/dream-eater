import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');

        // Load character images
        this.load.spritesheet('empty', 'characters/empty.png', { frameWidth: 16, frameHeight: 16 })
        this.load.spritesheet('playerDown', 'characters/character_v0.1/down.png', { frameWidth: 24, frameHeight: 24 })
        this.load.spritesheet('playerLeft', 'characters/character_v0.1/left.png', { frameWidth: 24, frameHeight: 24 })
        this.load.spritesheet('playerUp', 'characters/character_v0.1/up.png', { frameWidth: 24, frameHeight: 24 })
        this.load.spritesheet('playerRight', 'characters/character_v0.1/right.png', { frameWidth: 24, frameHeight: 24 })
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        // Create player animations
        const forwards = new Array(11).fill(0).map((_, i) => i)
        const backwards = forwards.slice().reverse()
        this.anims.create({
            key: 'playerUp',
            frames: this.anims.generateFrameNumbers('playerUp', { frames: forwards }),
            frameRate: 24,
            duration: 500
        })
        this.anims.create({
            key: 'playerRight',
            frames: this.anims.generateFrameNumbers('playerRight', { frames: forwards }),
            frameRate: 24,
            duration: 500
        })
        this.anims.create({
            key: 'playerDown',
            frames: this.anims.generateFrameNumbers('playerDown', { frames: forwards }),
            frameRate: 24,
            duration: 500
        })
        this.anims.create({
            key: 'playerLeft',
            frames: this.anims.generateFrameNumbers('playerLeft', { frames: forwards }),
            frameRate: 24,
            duration: 500
        })

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    }
}
