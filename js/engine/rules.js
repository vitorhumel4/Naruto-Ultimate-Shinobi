// Estado global, utilitários e regras (requisitos, velocidade, reação, vitória)
import {CH} from '../data/characters.js';
import {MOD,SUS} from '../data/shared/modes.js';
import {FLAG} from '../data/shared/flags.js';
export const fmt=n=>Math.round(n).toLocaleString('pt-BR'),pick=a=>a[Math.floor(Math.random()*a.length)];
export const val=(x,f)=>typeof x=='function'?x(f):x;
export const DIFF=['Fácil','Médio','Difícil'];
export const S={G:null,SEL:{me:'naruto',ai:'sasuke',d:1},render(){},endTurn(){}};
export const opp=f=>S.G.P[0]===f?S.G.P[1]:S.G.P[0],cur=()=>S.G.P[S.G.order[S.G.i]];
export const log=(t,m)=>{S.G.log.push([t,m])};
export const mk=(k,h,d)=>{const ch=CH[k],st=ch.st;return{key:k,n:ch.n,h,diff:d,mx:{...st},cur:{hp:st.hp,ck:st.ck,ag:st.ag},on:{},cd:{},use:{},sus:0,turns:0,koto:0,kmark:0,kn:0,atk:0,cloneCount:0,speed:st.speed||1,baseReaction:st.reaction||1}};
export function defOf(f){let d=f.sus?SUS[f.sus].d:f.mx.def;if(f.key=='sasuke')d+=Math.floor((1-f.cur.hp/f.mx.hp)*5e4);return d}
export function velOf(f){let v=f.speed||1;for(const k in f.on)if(MOD[k]&&MOD[k].vel)v=Math.max(v,MOD[k].vel);return v}
export function reactionOf(f){let r=f.baseReaction||1;for(const k in f.on){if(k=='shar')r=Math.max(r,3);if(k=='mang'||k=='prev')r=Math.max(r,4);if(MOD[k]&&MOD[k].react)r=Math.max(r,MOD[k].react)}return r}
export const upOf=t=>t.up||(t.t=='mode'&&MOD[t.id].up)||(t.t=='flag'&&FLAG[t.id].up)||(t.t=='sus'&&SUS[t.s].up)||null;
export const escList=(f,t)=>f.on.rastro&&f.key=='shisui'&&t.t=='atk'&&t.fis&&t.esc.length?['v4']:t.esc||[];
export const cst=(f,t,k)=>(t[k]||0)*(k=='hp'&&f.key=='itachi'&&t.mg?2:1);
export function why(f,o,t){
 if(t.grp){if(f.on[t.id])return'';const x=Object.keys(f.on).find(k=>MOD[k]&&CH[f.key].T.some(q=>q.id==k&&q.grp));if(x)return'Desative '+MOD[x].n+' antes'}
 if(t.t=='equip'&&f.on[t.id])return'Já equipada';
 if(t.t=='clone'&&f.cur.ck<=cst(f,t,'ck'))return'Falta CK';
 if(t.t!='atk'&&t.t!='disc'&&t.t!='clone'&&f.on[t.id]&&t.t!='sus')return'Já ativo';
 if((t.t=='atk'||t.t=='disc')&&f.atk)return'Já atacou neste turno';
 if((t.t=='atk'||t.t=='disc')&&f.koto)return'Controlado pelo Koto';
 if(f.cd[t.id]>0)return'Recarga: '+f.cd[t.id]+' rodada(s)';
 if(t.max&&(f.use[t.id]||0)>=t.max)return'Limite de usos';
 if(t.t=='atk'&&t.needsKunai&&!f.on.kunai)return'Requer Kunai empunhada';
 if(f.turns<=1){if(t.t1===false)return'Trapaça no 1º turno';
  if(t.t=='atk'){const e=escList(f,t);if(e.length==0||e.every(x=>/^v([3-9])/.test(x)))return'Trapaça no 1º turno: sem escape possível'}}
 const r=t.req&&t.req(f,o,S.G);if(r)return r;
 for(const k of['ck','ag','hp'])if(t[k]&&f.cur[k]<=cst(f,t,k))return'Falta '+k.toUpperCase();
 return''}
export function chk(){const G=S.G;if(G.over)return 1;
 for(const f of G.P){const o=opp(f);let r='';
  if(f.cur.hp<=0)r='morreu';else if(f.cur.ck<=0)r='desmaiou por exaustão de chakra';else if(f.cur.ag<=0)r='desmaiou por exaustão de agilidade';
  if(r){G.over=1;G.msg=`${o.n} vence! ${f.n} ${r}.`;log(1,G.msg);S.render();return 1}
  if(f.key=='sasuke'&&!f.hate&&f.cur.hp<=f.mx.hp*.3){f.hate=1;for(const k in f.cd)f.cd[k]=Math.max(0,f.cd[k]-1);log(0,'Maldição do Ódio: HP em 30%, recargas reduzidas em 1.')}}
 return 0}
