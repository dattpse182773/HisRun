import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';

export function createGameConfig(parent) {
  return {
    type: Phaser.AUTO, parent, width: 1280, height: 720, backgroundColor: '#bdded6',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    render: { antialias: true },
    scene: [GameScene],
  };
}
