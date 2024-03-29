import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(256, 256, 'background');

        this.logo = this.add.image(256, 256, 'logo');

        this.title = this.add.text(256, 350, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Go ahead and switch to the game scren for now to make debugging easier.
        this.scene.start('city');

        this.input.once('pointerdown', () => {

            this.scene.start('city');

        });
    }
}
