import { createHash } from 'node:crypto';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { PROVINCE_SCENERY } from '../../shared/provinceScenery.js';
import { EXPLORATION_MAPS } from '../../shared/exploration.js';
test('all 34 provinces own distinct scenery, preserving eight original routes', () => {
 const scenes=Object.values(PROVINCE_SCENERY);
 assert.equal(scenes.length,34); assert.equal(scenes.filter(s=>s.legacy).length,8);
 assert.equal(new Set(scenes.map(s=>s.url)).size,34);
 for(const map of EXPLORATION_MAPS){assert.equal(map.scenery.id,map.id);assert.ok(map.members.includes(map.scenery.oldProvince),map.id);assert.ok(existsSync(new URL(`../public${map.scenery.url}`,import.meta.url)),map.id);}
 const illustrations=scenes.filter(s=>!s.legacy).map(s=>readFileSync(new URL(`../public${s.url}`,import.meta.url)));
 assert.equal(new Set(illustrations.map(b=>createHash('sha256').update(b).digest('hex'))).size,26);
 for(const png of illustrations){assert.equal(png.subarray(1,4).toString(),'PNG'); const width=png.readUInt32BE(16),height=png.readUInt32BE(20);assert.ok(width>=1280&&height>=720);assert.ok(Math.abs(width/height-16/9)<.03);}
});
test('requested destinations are assigned to the current province',()=>{
 assert.equal(PROVINCE_SCENERY.quangtri.name,'Phong Nha–Kẻ Bàng');assert.equal(PROVINCE_SCENERY.quangtri.oldProvince,'Quảng Bình');
 assert.equal(PROVINCE_SCENERY.quangninh.design,'bay'); assert.equal(PROVINCE_SCENERY.cantho.design,'market');
});
import World from '../src/game/systems/World.js';
test('every new scene can render moving details using the game world renderer',()=>{
 const graphics=new Proxy({}, {get:()=>()=>graphics});
 for(const destination of Object.values(PROVINCE_SCENERY).filter(s=>!s.legacy)){
  const world=Object.create(World.prototype);Object.assign(world,{destination,ambient:graphics,details:graphics,marks:graphics,backdrop:graphics,horizon:destination.horizon,scene:{state:{distanceTarget:600}}});
  for(const distance of [0,80,300,590]) assert.doesNotThrow(()=>world.tick(distance),destination.id);
 }
});
test('province illustration completion displays the right texture and title',()=>{
 const callbacks={}, textures=new Set(), image={key:null,visible:false,setPosition(){return this;},setDisplaySize(){return this;},setVisible(v){this.visible=v;return this;},setTexture(k){this.key=k;return this;}};
 const world=Object.create(World.prototype);
 const noop={clear(){}};let title='';
 Object.assign(world,{details:noop,ambient:noop,marks:noop,backdrop:image,loading:new Set(),landmarkLabels:[],paint(){},label:{setText(v){title=v;}},scene:{sys:{isActive:()=>true},state:{distanceTarget:600},textures:{exists:k=>textures.has(k)},load:{once:(event,fn)=>{callbacks[event]=fn;},image(key,url){assert.ok(url.endsWith('/quangninh-v2.png'));textures.add(key);},isLoading:()=>false,start(){}}}});
 world.setMap('map-04','quangninh');
 assert.ok(callbacks['filecomplete-image-province-scenery-quangninh']);
 callbacks['filecomplete-image-province-scenery-quangninh']();
 assert.equal(image.key,'province-scenery-quangninh');assert.equal(image.visible,true);assert.ok(title.includes('QUẢNG NINH')&&title.includes('Vịnh Hạ Long'));
});
