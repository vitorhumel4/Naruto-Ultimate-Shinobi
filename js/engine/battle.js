// Fluxo da luta: início, turnos e IA
import {CH} from '../data/characters.js';
import {S,pick,val,log,opp,cur,mk,defOf,upOf,why,chk} from './rules.js';
import {act,upkeep,tick} from './effects.js';
import {attack} from './combat.js';
export function start(){const SEL=S.SEL,P=[mk(SEL.me,1,0),mk(SEL.ai,0,SEL.d)];
 const o=P[0].mx.ag>P[1].mx.ag?[0,1]:P[0].mx.ag<P[1].mx.ag?[1,0]:pick([[0,1],[1,0]]);
 S.G={P,order:o,i:0,round:1,log:[],over:0,pend:null,msg:''};
 log(1,`${P[o[0]].n} começa (maior AG ou sorteio).`);nextTurn()}
export function nextTurn(){const f=cur();f.turns++;f.atk=0;upkeep(f);if(chk())return;S.render();if(!f.h)setTimeout(()=>aiTurn(f,opp(f)),800)}
export function endTurn(){const G=S.G;cur().koto=0;cur().kn=0;G.i++;if(G.i>1){G.i=0;tick()}if(chk())return;nextTurn()}
S.endTurn=endTurn;
export function aiTurn(f,o){const G=S.G;if(G.over||cur()!==f)return;const d=f.diff,T=CH[f.key].T;
 if(Math.random()<[.3,.65,.9][d]){
  let c=T.filter(t=>t.t!='atk'&&t.t!='disc'&&!t.noai&&!f.on[t.id]&&!why(f,o,t));
  c=c.filter(t=>{const u=upOf(t);return t.t=='koto'||((!t.ck||f.cur.ck-t.ck>f.mx.ck*.3)&&(!u||!u.hp||f.cur.hp>f.mx.hp*.5))});
  c.sort((a,b)=>(b.s||0)-(a.s||0)||Math.random()-.5);
  let n=[1,2,3][d];for(const t of c){if(n<=0)break;if(!why(f,o,t)){act(f,t,o);n--}}
  if(chk())return}
 const at=T.filter(t=>(t.t=='atk'||t.t=='disc')&&!why(f,o,t));
 let ch=null;
 if(d==0)ch=Math.random()<.8?pick(at.length?at:[null]):null;
 else{const sc=at.map(t=>{const a=val(t.atk,f)+(t.fis?f.mx.atk:0);
   if(t.t=='disc')return[t,1e9];
   return[t,(a>defOf(o)?a:0)/(1+(t.ck||0)/f.cur.ck*(d==2?.8:.2))]}).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
  if(sc.length)ch=d==2?sc[0][0]:pick(sc.slice(0,3))[0]}
 S.render();
 setTimeout(()=>{if(ch&&!G.over)attack(f,o,ch);else{log(0,`${f.n} encerra o turno.`);S.render();setTimeout(()=>{if(!G.over)endTurn()},600)}},700)}
