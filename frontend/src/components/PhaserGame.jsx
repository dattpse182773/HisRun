import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from '../game/config.js';

export default function PhaserGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  useEffect(() => {
    // A private host prevents a deferred Phaser destroy from touching the next mount.
    const host = document.createElement('div');
    host.className = 'phaser-host';
    containerRef.current.appendChild(host);
    if (!gameRef.current) gameRef.current = new Phaser.Game(createGameConfig(host));
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      host.remove();
    };
  }, []);
  return <div className="game-canvas" ref={containerRef} role="img" aria-label="HisRun: chạy trên ba làn đường, né chướng ngại vật và thu thập xu. Dùng phím mũi tên hoặc vuốt để điều khiển." />;
}
