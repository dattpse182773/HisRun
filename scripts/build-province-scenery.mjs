import { mkdirSync, writeFileSync } from 'node:fs';
import { PROVINCE_SCENERY } from '../shared/provinceScenery.js';
const out = new URL('../frontend/public/assets/backgrounds/provinces/', import.meta.url);
mkdirSync(out,{recursive:true});
const path = (d,fill,stroke='#34493c',width=3) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
const rect = (x,y,w,h,c,r=0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="#4d4836" stroke-width="3"/>`;
const ellipse=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
const group=(x,y,s,content)=>`<g transform="translate(${x} ${y}) scale(${s})">${content}</g>`;
function tree(x,y,s,pine=false,palm=false) {
 let art=path('M-8 0 Q-16 -90 0 -158 Q13 -92 9 0Z','#846440');
 if(palm) for(let i=0;i<7;i++){const angle=i*48;art+=`<g transform="translate(0 -152) rotate(${angle})">${path('M0 0 Q-55 -65 -102 -28 Q-42 -47 0 0','#427f4e')}</g>`;}
 else if(pine) for(let i=0;i<3;i++) art+=path(`M${-62+i*13} ${-38-i*44} L0 ${-154-i*28} L${62-i*13} ${-38-i*44}Z`,i%2?'#548362':'#35674e');
 else {art+=path('M-65 -68 Q-115 -92 -70 -127 Q-84 -176 -36 -174 Q-18 -216 25 -177 Q88 -184 88 -138 Q120 -95 63 -78 Q14 -45 -65 -68Z','#386c46');art+=path('M-63 -131 Q-85 -166 -38 -167 Q-11 -211 26 -169 Q63 -169 70 -144 Q20 -161 -2 -123 Q-30 -150 -63 -131Z','#75a653','none');}
 return group(x,y,s,art);
}
function roof(x,y,w,color='#a95335'){return path(`M${x-16} ${y+8} Q${x+15} ${y+5} ${x+28} ${y-29} L${x+w-28} ${y-29} Q${x+w-15} ${y+5} ${x+w+16} ${y+8}Z`,color)+path(`M${x} ${y+3} L${x+w} ${y+3}`,'none','#e3a063',4);}
function pavilion(x,y,s=1){let a=rect(-110,-90,220,100,'#ecd59b'); for(let i=-85;i<=85;i+=42)a+=rect(i,-75,13,85,'#994831'); a+=rect(-30,-65,60,75,'#405145'); a+=roof(-122,-94,244); a+=roof(-90,-143,180,'#b9693a'); a+=path('M-100 14 L100 14 L124 35 L-124 35Z','#beb696');return group(x,y,s,a);}
function boat(x,y,s=1,sail=false,fruit=false){let a=path('M-90 0 Q0 27 102 -10 L73 25 Q-10 49 -69 20Z','#975735');a+=path('M-80 0 Q0 23 96 -8','none','#f1be70',5);if(sail){a+=rect(-3,-130,5,137,'#765338');a+=path('M-8 -128 Q-58 -97 -67 -30 L-8 -29Z','#d49a4f');a+=path('M5 -120 Q53 -83 61 -27 L5 -27Z','#efd39a');for(let i=0;i<4;i++)a+=path(`M-9 ${-110+i*23} L${-28-i*11} ${-107+i*24}`,'none','#8f6037',2);}else{a+=path('M-47 -4 L-43 -47 L41 -47 L48 -4Z','#ead195');a+=roof(-54,-46,110,'#77644a');}if(fruit){for(let i=0;i<8;i++)a+=ellipse(-65+i*16,-6-(i%2)*7,9,7,i%2?'#eac455':'#78a842');a+=path('M68 4 L68 -90','none','#5e4c33',3)+ellipse(68,-77,9,13,'#d2b044');}return group(x,y,s,a);}
function karst(x,y,s=1){return group(x,y,s,path('M-91 0 L-68 -65 L-70 -139 L-45 -176 L-23 -182 L-6 -212 L24 -194 L51 -124 L49 -66 L82 0Z','#4e806a')+path('M-63 -53 L-56 -133 L-22 -178 L-12 -116 L-29 -28Z','#7ea277','none')+path('M-8 -167 L12 -181 L34 -116 L18 -62 L31 -8','none','#365e54',5)+ellipse(-4,2,100,10,'#8ccdc2'));}
function terraces(x,y,s,tea=false){let a='';for(let i=0;i<7;i++){a+=path(`M${-270-i*15} ${i*26} Q-120 ${-110+i*27} 25 ${-64+i*23} Q130 ${-38+i*25} 275 ${i*23} L280 ${40+i*26} Q105 ${-3+i*24} -32 ${-16+i*24} Q-160 ${-52+i*27} -280 ${39+i*26}Z`,tea?(i%2?'#468847':'#8ebd56'):(i%2?'#d8c56b':'#87a64a'),'#456943',2);}return group(x,y,s,a);}
function arch(x,y,s=1){return group(x,y,s,path('M-210 40 L-186 -10 L-169 -61 L-103 -107 L-20 -125 L65 -98 L165 -90 L220 -22 L200 38 L124 27 Q97 -45 18 -49 Q-65 -64 -102 36Z','#777467')+path('M-180 -20 L-106 -93 L-27 -108 L58 -85 L154 -74','none','#b7b49a',12));}
function landmark(p){switch(p.design){
 case 'stilt': return tree(1010,421,1.65)+group(287,381,1,rect(-95,-63,190,85,'#b48c51')+[-80,-30,30,80].map(x=>rect(x,18,8,60,'#6d573e')).join('')+roof(-111,-68,222,'#9b8247')+rect(-32,-40,42,61,'#4a4f3a')+path('M48 23 L97 80 M76 23 L125 80 M60 43 L91 43 M70 57 L108 57','none','#8b7047',6));
 case 'terraces': return terraces(240,300,1.18)+terraces(1050,325,1)+group(1040,285,.6,roof(-75,-50,150,'#906747')+rect(-60,-40,120,64,'#be9558'));
 case 'tea': return terraces(170,310,1.25,true)+terraces(1060,310,1.3,true)+pavilion(1030,259,.45);
 case 'summit': return path('M-40 390 L134 125 L213 236 L322 57 L448 280 L563 388Z','#4d7b75')+path('M134 125 L183 291 L213 236 L322 57 L345 166 L295 145 L258 244 L233 273Z','#91aaa0','none')+path('M765 396 L976 125 L1105 214 L1220 71 L1340 399Z','#587f75')+ellipse(270,275,220,16,'#d4e5d5')+tree(1150,501,1.5,true);
 case 'pass': return karst(200,380,1.5)+karst(1020,395,1.35)+path('M34 447 Q140 344 299 383 L441 431','none','#a6b771',16);
 case 'prison': {let a=rect(-198,-90,396,130,'#bd8d58')+roof(-206,-94,412,'#a95437');for(let i=-170;i<175;i+=56)a+=rect(i,-60,30,42,'#3b4b46')+path(`M${i+9} -59 V-19 M${i+21} -59 V-19`,'none','#a5a08a',3);a+=rect(-31,-22,62,62,'#343f3b');return group(285,380,.9,a)+tree(1060,463,1.65);}
 case 'temple': return tree(85,456,1.7)+pavilion(319,319,.95)+Array.from({length:8},(_,i)=>rect(223-i*5,350+i*10,194+i*10,10,'#c2c1a5')).join('')+tree(1070,438,1.4);
 case 'pagoda': return pavilion(278,393,1.14)+pavilion(1050,351,.78)+path('M855 420 Q997 331 1195 421 L1195 441 Q996 357 855 441Z','#b8aa7b');
 case 'bay': return karst(190,384,1.35)+karst(1085,382,1.5)+karst(392,337,.52)+karst(819,340,.7)+boat(289,458,.95,true)+boat(995,477,.55,true);
 case 'islands': return karst(135,372,1.6)+karst(1020,370,1.1)+karst(865,345,.55)+boat(1004,433,.72)+Array.from({length:4},(_,i)=>group(110+i*85,431-i*4,.5,rect(-50,-40,100,50,['#e9ba69','#acd1bf'][i%2])+roof(-57,-43,114,'#8d694b'))).join('');
 case 'town': return [140,345,958,1147].map((x,i)=>group(x,420-i%2*30,.85,rect(-90,-119,180,136,i%2?'#e3c78d':'#d8b978')+roof(-104,-125,208)+rect(-50,-89,30,39,'#40594c')+rect(23,-89,30,39,'#40594c')+rect(-27,-30,54,47,'#556146'))).join('');
 case 'citadel': {let a=rect(-270,-105,540,153,'#a3a68d'); for(let i=0;i<6;i++)a+=path(`M-270 ${-91+i*26} H270`,'none','#69725f',2);for(let i=0;i<9;i++)a+=path(`M${-250+i*62} -105 V48`,'none','#747b67',2);for(const x of [-155,0,155])a+=path(`M${x-41} 48 V-20 A41 49 0 0 1 ${x+41} -20 V48Z`,'#344d43');return group(301,395,.93,a)+tree(1098,449,1.2);}
 case 'memorial': return group(273,391,1,path('M-100 25 L-76 -5 L75 -5 L108 25Z','#d4c6a5')+path('M-59 -5 L-45 -156 L-10 -193 L10 -175 L46 -162 L58 -5Z','#e9dab3')+path('M-15 -34 V-146 M13 -18 V-132','none','#b6a984',5))+pavilion(1050,366,.75);
 case 'cave': return path('M-60 477 L-30 203 L60 120 L170 142 L245 80 L363 108 L445 236 L513 469Z','#497656')+path('M18 450 L36 280 Q153 143 292 217 Q411 268 428 433Z','#748673')+path('M57 436 Q74 248 225 239 Q342 240 387 424Z','#203f3d')+path('M99 433 Q133 289 242 290 Q323 295 350 425Z','#102f32')+path('M103 260 L124 329 L143 250 M222 239 L234 304 L251 245 M283 255 L303 311 L322 279','#b9b392')+karst(1063,395,1.42)+boat(201,477,.7);
 case 'volcanic': return arch(266,424,1.15)+path('M897 395 L994 291 L1054 314 L1130 248 L1300 376 V447 H897Z','#827f67')+path('M910 400 L1070 378 L1300 406','none','#b5ac89',8)+boat(1030,465,.56,true);
 case 'museum': return pavilion(271,395,1.3)+group(1062,391,1,rect(-61,-80,122,107,'#c28543')+ellipse(0,-80,62,22,'#dfc274')+ellipse(0,-80,43,14,'#b78345')+path('M-61 -55 Q0 -29 61 -55 M-61 -7 Q0 15 61 -7','none','#edd495',5));
 case 'waterfall': return path('M-40 229 L62 244 L141 218 L251 245 L366 222 L492 259 L508 465 L-40 475Z','#516f57')+path('M54 252 Q192 266 385 254 L418 443 Q222 481 40 441Z','#a4d9d0')+Array.from({length:12},(_,i)=>path(`M${65+i*27} 260 Q${45+i*29} 330 ${61+i*29} 442`,'none',i%2?'#edfae9':'#63b7ba',8)).join('')+ellipse(223,452,222,23,'#e3efdb')+tree(1073,460,1.65);
 case 'cham': {const tower=(x,y,s)=>group(x,y,s,path('M-68 33 L-62 -100 L-51 -124 L-44 -177 L-29 -186 L-19 -213 L19 -213 L29 -186 L44 -177 L51 -124 L62 -100 L68 33Z','#b36d42')+[-160,-132,-103,-58,-20,16].map(y=>path(`M-51 ${y} H51`,'none','#dfa275',4)).join('')+path('M-21 33 V-35 Q0 -76 21 -35 V33Z','#523e34')+rect(-4,-231,8,21,'#b67442'));return tower(249,398,1.15)+tower(1064,418,.83)+tower(1160,389,.55);}
 case 'station': return group(278,385,1,rect(-230,-69,460,116,'#ecc46e')+[-125,0,125].map(x=>path(`M${x-70} -70 L${x} -171 L${x+70} -70Z`,'#ba643c')+path(`M${x-50} -72 L${x} -145 L${x+50} -72Z`,'#f4d785')+rect(x-26,-56,52,101,'#487471')).join('')+ellipse(0,-92,15,15,'#fff0be'))+tree(1063,460,1.35,true)+tree(1195,403,1.1,true);
 case 'jungle': return [70,240,1020,1210].map((x,i)=>tree(x,450-i%2*35,1.8-i%2*.4)).join('')+path('M960 452 Q1013 350 1120 373 Q1172 407 1180 451Z','#85958a')+path('M955 435 Q970 467 948 485','none','#85958a',19);
 case 'sacred-mountain': return path('M12 421 Q73 262 170 189 Q236 73 299 125 Q418 188 542 419Z','#57845b')+path('M133 295 Q234 129 299 125 Q326 197 390 256 L338 244 L295 185 L225 239Z','#85a27a','none')+pavilion(306,288,.44)+tree(1081,460,1.4);
 case 'lotus': return Array.from({length:17},(_,i)=>{let x=i<9?20+i*48:865+(i-9)*50,y=385+i%4*32;return ellipse(x,y,35,12,'#548b50')+path(`M${x} ${y} Q${x-25} ${y-24} ${x} ${y-12} Q${x+22} ${y-28} ${x} ${y}Z`,'#eaa7a2','#b87378',2);}).join('')+group(1081,366,1,path('M0 48 L-5 -14 Q-22 -41 -7 -48 Q8 -41 4 -21 L23 -4 L69 -3 L42 14 L10 6 M27 9 L26 63 M43 7 L47 59','none','#eee8d5',8)+path('M-7 -48 L-11 -55','none','#c94c3e',7));
 case 'coconut': return [70,275,1040,1200].map((x,i)=>tree(x,445-i%2*28,1.5,true,true)).join('')+boat(252,445,.7,true)+path('M927 453 Q1060 371 1236 453','none','#cbae77',19)+path('M941 426 Q1085 346 1230 432','none','#7d714c',5);
 case 'mangrove': return [48,195,331,952,1090,1235].map((x,i)=>tree(x,410+i%2*38,1.4+i%2*.3)+path(`M${x} 390 L${x-25} 455 M${x} 399 L${x+28} 454`,'none','#706947',6)).join('')+boat(1002,462,.7);
 case 'market': return [boat(186,422,1,false,true),boat(375,371,.52,false,true),boat(1070,454,1.13,false,true),boat(909,373,.55,false,true),tree(58,405,1.3,false,true),tree(1230,405,1.2,false,true)].join('');
 case 'cape': return group(280,402,1.2,path('M-126 18 L105 18 L65 52 L-99 52Z','#d4c6a1')+path('M-17 17 L-17 -171 L99 17Z','#f1dfb4')+path('M-31 17 L-31 -106 L-107 17Z','#c6b68e'))+[tree(1060,434,1.6),tree(1199,448,1.2)].join('');
 default: throw new Error(`Missing design ${p.design}`);
}}
function render(p){const wet=['sea','river','wetland','lake'].includes(p.environment),pine=p.environment==='pine';let s=`<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720"><title>${p.name}</title><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="${p.sky}"/><stop offset="1" stop-color="#e8efcc"/></linearGradient><linearGradient id="road" x2="0" y2="1"><stop stop-color="#cfb77e"/><stop offset="1" stop-color="#e9cb8e"/></linearGradient></defs><rect width="1280" height="720" fill="url(#sky)"/>`;
s+=ellipse(1005,104,48,48,'#fff0b7');for(const [x,y,scl] of [[130,99,1],[600,74,.8],[1130,164,.7]])s+=group(x,y,scl,path('M-94 10 Q-127 -15 -77 -25 Q-60 -67 -23 -41 Q14 -79 44 -35 Q101 -40 103 0 Q148 21 83 26 L-85 25Z','#f6f4d6','none'));
s+=path('M-20 328 Q145 160 290 278 Q384 179 544 301 Q728 170 865 293 Q1060 170 1300 305 V500 H-20Z','#91b5a0','none');
s+=`<rect y="341" width="1280" height="379" fill="${wet?'#69b5b4':p.green}"/>`;
if(wet)for(let i=0;i<34;i++){const x=i*113%1280,y=365+i*43%330;s+=path(`M${x} ${y} h${25+i%5*16}`,'none','#c2e2cd',2+i%2);}
s+=landmark(p);
// A continuous three-lane promenade stays clear in every destination.
s+=path('M606 310 L674 310 Q704 421 793 523 L1010 720 H270 L487 523 Q576 421 606 310Z',wet?'#886f4c':'#79924f','#4b6040',3);
s+=path('M615 310 L665 310 Q694 431 778 532 L975 720 H305 L502 532 Q586 431 615 310Z','url(#road)','#be9d66',2);
for(let i=1;i<12;i++){let t=i/12,y=310+410*t*t,w=25+310*t*t; s+=path(`M${640-w} ${y} Q640 ${y+8*t} ${640+w} ${y}`,'none',wet?'#a98756':'#bda376',wet?3:1.5);}
if(wet)for(let side of [-1,1]){s+=path(`M${640+side*43} 326 Q${640+side*68} 440 ${640+side*387} 720`,'none','#a98651',6);for(let i=1;i<9;i++){const t=i/9,x=640+side*(43+344*t*t),y=326+394*t*t;s+=path(`M${x} ${y} v${-13-43*t}`,'none','#725638',4+4*t);}}
else {for(let i=0;i<19;i++){let side=i%2?1:-1,t=(i+1)/20,x=640+side*(130+520*t),y=399+t*320;s+=path(`M${x-12} ${y} l9 -17 7 15 12 -9 -6 18`,'none','#456b3e',3);}}
if(!['cave','bay','islands','volcanic'].includes(p.design)){s+=tree(-15,698,2,pine,p.design==='coconut')+tree(1300,710,2.1,pine,p.design==='coconut');}
s+=`</svg>`;return s;}
for(const p of Object.values(PROVINCE_SCENERY).filter(p=>!p.legacy))writeFileSync(new URL(`${p.id}.svg`,out),render(p));
console.log('Created 26 distinct province illustrations.');
