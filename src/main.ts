import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";
import { SceneFactory } from './scenes/SceneFactory';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 512,
    height: 512,
    parent: 'game-container',
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        GameOver,
        SceneFactory('city', 'city', 'assets/tilemaps/city.json', [
            { tilesetName: 'kenny-city', tilesetPath: 'assets/tilemaps/kenny-city.png'}
        ]),
        SceneFactory('home', 'home', 'assets/tilemaps/home.json', [
            { tilesetName: 'kenny-inside', tilesetPath: 'assets/tilemaps/kenny-inside.png'},
            { tilesetName: 'kenny-rouge', tilesetPath: 'assets/tilemaps/kenny-rogue.png'},
        ])
    ],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
        }
    }
};

export default new Game(config);
