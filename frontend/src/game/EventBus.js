import Phaser from 'phaser';

export const EventBus = new Phaser.Events.EventEmitter();
export const GAME_EVENTS = Object.freeze({ READY: 'game:ready', PREVIEW: 'game:preview', START: 'game:start', INPUT: 'game:input', HUD: 'game:hud', PAUSE: 'game:pause', QUESTION: 'game:question', ANSWER: 'game:answer', OVER: 'game:over', SETTINGS: 'game:settings' });
