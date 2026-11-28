// Ataques, escapes, defesas reativas e reações
import {CH} from '../data/characters.js';
import {MOD,SUS} from '../data/shared/modes.js';
import {S,log,val,fmt,defOf,velOf,reactionOf,escList,cst,chk,why} from './rules.js';
import {act} from './effects.js';
export function escOpts(f,o,t){const r=[],a=val(t.atk,f)+(t.fis?f.mx.atk:0),cost=Math.max(1000,Math.round(a*.03)),agc=Math.max(2000,Math.round(a*.03));
 const speed=t.speed||1,canReact=reactionOf(o)>=speed;
 for(const e of escList(f,t)){
  if(e=='ev'){if(canReact&&o.cur.ag>agc)r.push({n:'Evasiva',cost:0,ag:agc,kind:'escape'})}
  else if(e=='cint'){if(canReact&&t.tg<=15&&o.cur.ck>cost)r.push({n:'Cintilação',cost,kind:'escape'})}
  else if(e=='kaw'){if(canReact&&t.tg>=10&&(o.use.kaw||0)<5&&o.cur.ck>500)r.push({n:'Kawarimi',cost:500,kind:'escape',kaw:1,desc:'Substituição corporal; até 5 usos por combate.'})}
  else if(/^v[1-7]$/.test(e)){const need=+e.slice(1)-(o.key=='shisui'?1:0);if(velOf(o)>=need)r.push({n:'Velocidade '+e.slice(1),cost:0,kind:'escape'})}
 }
 if(t.tg>=10&&(o.use.kaw||0)<5&&o.cur.ck>500&&canReact&&!r.some(x=>x.n=='Kawarimi'))r.push({n:'Kawarimi',cost:500,kind:'escape',kaw:1,desc:'Substituição corporal; até 5 usos por combate.'});
 if(!t.genjutsu&&o.on.kunai&&t.weapon&&t.ranged&&o.cur.ag>500)r.push({n:'Bloqueio da Kunai',cost:0,ag:500,kind:'block',desc:'Bloqueia apenas armamentos comuns arremessados, como Kunai e Shuriken.'});
 if(!t.genjutsu)r.push(...defenseOpts(o,f,a,t));return r}
function defenseOpts(o,f,at,t){const r=[],list=CH[o.key].T,speed=t.speed||1;
 for(const q of list){if(why(o,f,q))continue;if(reactionOf(o)<speed&&!(q.instant&&reactionOf(o)==speed-1))continue;
  if(q.t=='sus'){const d=SUS[q.s].d;if(at>defOf(o)&&d>=at)r.push({n:'Defender com '+q.n,cost:0,kind:'defense',tech:q})}
  const b=MOD[q.id]?.b;if(q.t=='mode'&&o.key=='naruto'&&b?.def){const nd=o.mx.def+b.def,nh=o.cur.hp+(b.hp||0);if(at>defOf(o)&&(nd>=at||nh>at))r.push({n:'Ativar '+q.n+' para defender',cost:0,kind:'defense',tech:q})}
 }
 return r}
export function attack(f,o,t){const G=S.G;for(const k of['ck','ag','hp'])if(t[k])f.cur[k]-=cst(f,t,k);
 f.atk=1;f.use[t.id]=(f.use[t.id]||0)+1;if(t.cd)f.cd[t.id]=t.cd+1;
 if(t.id=='kunaiThrow')delete f.on.kunai;
 log(0,`${f.n} usa ${t.n}!`);
 const end=()=>{S.render();setTimeout(()=>{if(!chk())S.endTurn()},700)};
 if(t.t=='disc'){const d=1+Math.floor(Math.random()*8);log(0,`Discurso: rolou ${d} (precisa ≤6).`);if(d<=6){G.over=1;G.msg=`${f.n} convenceu ${o.n} e vence por W.O.!`;log(1,G.msg);S.render();return}return end()}
 const at=val(t.atk,f)+(t.fis?f.mx.atk:0)+(t.kunaiBonus&&f.on.kunai?t.kunaiBonus:0),opts=escOpts(f,o,t);
 const hit=(defender)=>{
  if(defender.cloneCount>0){defender.cloneCount--;log(0,`${defender.n}: um Clone das Sombras recebe o ataque e desaparece. Restam ${defender.cloneCount}.`);return}
  if(t.genjutsu){if(defender.on.shar||defender.on.mang||defender.on.rinnegan){log(0,`${defender.n} evita o Genjutsu usando Doujutsu.`);return}defender.on.surprised=2;log(0,`${defender.n} é pego pelo Genjutsu e fica vulnerável a dano direto no HP por 2 rodadas.`);return}
  const d=defOf(defender),external=!!defender.sus,bypass=(t.directHp&&!external)||(!external&&defender.on.surprised);
  if(bypass){defender.cur.hp-=at;log(0,`${defender.n} sofre ${fmt(at)} de dano direto no HP${t.directHp?' (Kunai ignora DEF corporal)':' (vulnerável pelo Genjutsu)'}.`)}
  else if(at>d){defender.cur.hp-=at;log(0,`${defender.n} sofre ${fmt(at)} de dano (ATK ${fmt(at)} > DEF ${fmt(d)}).`)}
  else log(0,`Sem dano: ATK ${fmt(at)} não supera a DEF ${fmt(d)}.`)
 };
 const res=c=>{G.pend=null;
  if(c&&c.kind=='escape'){o.cur.ck-=c.cost;o.cur.ag-=c.ag||0;if(c.kaw)o.use.kaw=(o.use.kaw||0)+1;log(0,`${o.n} escapa com ${c.n}${c.kaw?' ('+o.use.kaw+'/5 usos)':''}.`)}
  else if(c&&c.kind=='block'){o.cur.ag-=c.ag;log(0,`${o.n} bloqueia o armamento com a Kunai. Agilidade −${c.ag}.`)}
  else{if(c&&c.kind=='defense'){act(o,c.tech,f);log(0,`${o.n} reage ativando uma defesa.`)}hit(o)}
  end()};
 if(!opts.length)return res(null);
 if(o.h){G.pend={opts,cb:res,at,t};S.render()}else res(aiEsc(o,opts,at))}
export function aiEsc(o,opts,at){const dmg=at>defOf(o)?at:0;if(!dmg)return null;const d=o.diff,r=Math.random();if(d==0&&r>.3)return null;if(d==1&&r>.7)return null;if(d==2&&dmg<o.mx.hp*.03&&opts.every(x=>x.cost>0))return null;return opts.filter(x=>['escape','defense','block'].includes(x.kind)).slice().sort((a,b)=>(a.cost||0)-(b.cost||0))[0]||null}
