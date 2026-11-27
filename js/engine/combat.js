// Ataques, escapes e reação do defensor
import {S,log,val,fmt,defOf,velOf,escList,cst,chk} from './rules.js';
export function escOpts(f,o,t){const r=[],a=val(t.atk,f)+(t.fis?f.mx.atk:0),cost=Math.max(1000,Math.round(a*.03)),agc=Math.max(2000,Math.round(a*.03));
 for(const e of escList(f,t)){
  if(e=='ev'){if(o.cur.ag>agc)r.push({n:'Evasiva',cost:0,ag:agc})}
  else if(e=='cint'){if(t.tg<=15&&o.cur.ck>cost)r.push({n:'Cintilação',cost})}
  else if(e=='kaw'){if(!f.on.shar&&o.cur.ag>agc)r.push({n:'Kawarimi',cost:0,ag:agc})}
  else{const need=+e.slice(1)-(o.key=='shisui'?1:0),mv=velOf(o);
   if(mv>=need)r.push({n:'Velocidade '+e.slice(1),cost:0});
   else if(o.cur.ck>cost&&(o.key=='shisui'?5:2)>=need)r.push({n:'Cintilação (vel. '+e.slice(1)+')',cost})}}
 return r}
export function attack(f,o,t){const G=S.G;for(const k of['ck','ag','hp'])if(t[k])f.cur[k]-=cst(f,t,k);
 f.atk=1;f.use[t.id]=(f.use[t.id]||0)+1;if(t.cd)f.cd[t.id]=t.cd+1;
 log(0,`${f.n} usa ${t.n}!`);
 const end=()=>{S.render();setTimeout(()=>{if(!chk())S.endTurn()},700)};
 if(t.t=='disc'){const d=1+Math.floor(Math.random()*8);log(0,`Discurso: rolou ${d} (precisa ≤6).`);
  if(d<=6){G.over=1;G.msg=`${f.n} convenceu ${o.n} e vence por W.O.!`;log(1,G.msg);S.render();return}
  return end()}
 const at=val(t.atk,f)+(t.fis?f.mx.atk:0),opts=escOpts(f,o,t);
 const res=c=>{G.pend=null;
  if(c){o.cur.ck-=c.cost;o.cur.ag-=c.ag||0;log(0,`${o.n} escapa com ${c.n}.`)}
  else{const D=defOf(o);if(at>D){o.cur.hp-=at;log(0,`${o.n} sofre ${fmt(at)} de dano (ATK ${fmt(at)} > DEF ${fmt(D)}).`)}else log(0,`Sem dano: ATK ${fmt(at)} não supera a DEF ${fmt(D)}.`)}
  if(t.id=='feixe'){delete f.on.koto;o.kmark=0}end()};
 if(!opts.length)return res(null);
 if(o.h){G.pend={opts,cb:res,at,t};S.render()}else res(aiEsc(o,opts,at))}
export function aiEsc(o,opts,at){const dmg=at>defOf(o)?at:0;if(!dmg)return null;const d=o.diff,r=Math.random();
 if(d==0&&r>.3)return null;if(d==1&&r>.7)return null;
 if(d==2&&dmg<o.mx.hp*.03&&opts.every(x=>x.cost>0))return null;
 return opts.slice().sort((a,b)=>a.cost-b.cost)[0]}
