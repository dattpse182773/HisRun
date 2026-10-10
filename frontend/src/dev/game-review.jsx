// Vite-only review entry, not imported by the production application.
import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import Phaser from 'phaser';
import GameScene from '../game/scenes/GameScene.js';
import { EventBus, GAME_EVENTS as E } from '../game/EventBus.js';
import { CHARACTERS } from '../game/characters.js';
import { TOKENS } from '../../../shared/tokens.js';
import { getMap } from '../../../shared/journey.js';
import StoryRecap from '../components/StoryRecap.jsx';
import QuestionModal from '../components/QuestionModal.jsx';
import '../styles.css'; import '../scenario.css'; import '../administrative-map.css'; import '../lessons.css';
function Review() {
  const mount = useRef(null), engine = useRef(null), recent = useRef([]);
  const [hud, setHud] = useState(null), [gate, setGate] = useState(null), [result, setResult] = useState(null);
  const [character, setCharacter] = useState('ty-nam');
  useEffect(() => {
    const game = new Phaser.Game({ type: Phaser.AUTO, parent: mount.current, width:1280, height:720, backgroundColor:'#cde4d5', scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}, scene:[GameScene], audio:{noAudio:true} }); engine.current=game;
    const onHud = state => { const p=game.scene.getScene('GameScene').player; setHud({...state, legs:p?.runLeft ? [p.runLeft.scaleY,p.runRight.scaleY].map(n=>n.toFixed(3)):[]}); };
    const onQuestion = q=>setGate(q), onOver=r=>setResult(r);
    EventBus.on(E.HUD,onHud); EventBus.on(E.QUESTION,onQuestion); EventBus.on(E.OVER,onOver);
    return()=>{EventBus.off(E.HUD,onHud);EventBus.off(E.QUESTION,onQuestion);EventBus.off(E.OVER,onOver);game.destroy(true);};
  },[]);
  function scene() { return engine.current.scene.getScene('GameScene'); }
  function start() { setResult(null); setGate(null); scene().start({mapId:'map-02',schoolLevel:'high',characterId:character}); }
  function token(key) { const s=scene(); if(s.state.gameStatus==='ready'||s.state.gameStatus==='gameover') start(); if(s.state.gameStatus==='paused')s.togglePause(); const item=s.obstacles.add(key,s.player.currentLane,0);s.collide(item);item.checked=true;s.publish(); }
  return <main style={{padding:16,maxWidth:1280,margin:'auto'}}><h1>Kiểm thử local · không lưu kết quả</h1><label>Nhân vật chạy <select value={character} onChange={e=>{setCharacter(e.target.value);scene().player.setCharacter(e.target.value);}}>{CHARACTERS.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><div className="button-row"><button onClick={start}>Bắt đầu kiểm thử</button><button onClick={()=>scene().togglePause()}>Dừng / tiếp tục</button><button onClick={()=>scene().player.jump()}>Thử nhảy</button><button onClick={()=>scene().player.slide()}>Thử lăn</button><button onClick={()=>{scene().state.distance=500;scene().finish(true);}}>Xem sau khi qua map</button></div><div className="button-row">{Object.entries(TOKENS).map(([key,t])=><button key={key} onClick={()=>token(key)}>{t.name}</button>)}</div><p role="status">{hud ? `Trạng thái ${hud.gameStatus} · ${Math.floor(hud.distance)} m · ${hud.score} điểm · ${hud.coins} xu · phạt ${hud.penalties} · chân trái/phải ${hud.legs.join(' / ')} · vật phẩm ${JSON.stringify(hud.powers)}` : 'Đang tải'}</p><div ref={mount} style={{width:'100%',aspectRatio:'16/9'}}/>{gate&&<QuestionModal gate={gate} recent={recent} onComplete={answer=>{setGate(null);scene().answer(answer);}}/>}{result&&<StoryRecap map={getMap(result.mapId)}/>}</main>;
}
if(import.meta.env.DEV)createRoot(document.getElementById('root')).render(<Review/>);
