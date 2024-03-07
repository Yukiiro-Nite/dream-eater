import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";
import { SceneFactory } from './scenes/SceneFactory';
import { useAppStore } from './stores/appStore';
import { scenes } from './data/scenes';

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
        ...scenes.map(sceneConfig => SceneFactory(
            sceneConfig.levelName,
            sceneConfig.mapName,
            sceneConfig.mapPath,
            sceneConfig.tilesets
        ))
    ],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
        }
    }
};
export const game = new Game(config);

useAppStore.subscribe(
  (state) => state.overlay,
  (overlay) => {
      // I might change this behavior to only have certain overlays pause the game.
      if (overlay) {
          game.pause()
      } else {
          game.resume()
      }
  }
)
