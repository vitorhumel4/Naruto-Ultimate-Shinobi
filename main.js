// Interface e ponto de entrada
import {CH} from './data/characters.js';
import {MOD} from './data/shared/modes.js';
import {FLAG} from './data/shared/flags.js';
import {SUS} from './data/shared/modes.js';
import {S,DIFF,fmt,val,cur,defOf,why,cst,pick} from './engine/rules.js';
import {start} from './engine/battle.js';
import {act} from './engine/effects.js';
import {attack} from './engine/combat.js';
import {chk} from './engine/rules.js';
import {endTurn} from './engine/battle.js';
import {log} from './engine/rules.js';
const $=s=>document.querySelector(s);
function go(i){const G=S.G,t=G.ui[i],f=G.P[0],o=G.P[1];if(!t||G.pend||G.over||cur()!==f||why(f,o,t))return;
 if(t.t=='atk'||t.t=='disc')attack(f,o,t);else{act(f,t,o);if(!chk())render()}}
function esc(i){const p=S.G.pend;if(p)p.cb(i<0?null:p.opts[i])}
function pass(){const G=S.G;if(G.pend||G.over||cur()!==G.P[0])return;log(0,`${G.P[0].n} encerra o turno.`);endTurn()}
const bar=(l,v,m,c)=>`<div class=br><span>${l} ${fmt(Math.max(0,v))} / ${fmt(m)}</span><i style="width:${Math.max(0,v/m*100)}%;background:var(--${c})"></i></div>`;
function card(f){const ch=Object.keys(f.on).map(k=>MOD[k]?MOD[k].n:FLAG[k].n);if(f.sus)ch.push('Susanoo '+SUS[f.sus].n);
 return`<div class="card ${f.h?'me':'ai'} ${cur()===f&&!S.G.over?'on':''}"><div class=nm><span>${f.n}</span><span>${f.h?'Você':'IA '+DIFF[f.diff]}</span></div>
 ${bar('HP',f.cur.hp,f.mx.hp,'hp')}${bar('CK',f.cur.ck,f.mx.ck,'ck')}${bar('AG',f.cur.ag,f.mx.ag,'ag')}
 <div class=chips><u>ATK ${fmt(f.mx.atk)}</u><u>DEF ${fmt(defOf(f))}</u>${ch.map(x=>`<u>${x}</u>`).join('')}</div></div>`}
function btn(t,i,f,o){const w=why(f,o,t),c=[];for(const[k,l]of[['ck','CK'],['ag','AG'],['hp','HP']])if(t[k])c.push(l+' '+fmt(cst(f,t,k)));
 const a=t.atk?'ATK '+fmt(val(t.atk,f)+(t.fis?f.mx.atk:0)):'';
 return`<button ${w?'disabled':''} onclick="go(${i})"><b>${t.grp&&f.on[t.id]?'Desativar ':''}${t.n}</b><small>Rank ${t.rk}${a?' · '+a:''}${c.length?' · '+c.join(' · '):''}${w?' · '+w:''}</small></button>`}
function render(){const G=S.G,SEL=S.SEL,app=$('#app');
 if(!G){const pk=(k,w)=>Object.keys(CH).map(c=>`<button class="${SEL[k]==c?'sel':''}" onclick="SEL.${k}='${c}';render()">${CH[c].n}</button>`).join('');
  app.innerHTML=`<h1>Naruto: Duelo Shinobi</h1><small style="color:var(--mut)">Protótipo 1v1 contra a IA</small>
  <h2>Seu personagem</h2>${pk('me')}<h2>Oponente</h2>${pk('ai')}<h2>Dificuldade</h2>
  <div class=row>${DIFF.map((n,i)=>`<button class="${SEL.d==i?'sel':''}" onclick="SEL.d=${i};render()">${n}</button>`).join('')}</div>
  <h2></h2><button class=go onclick="start()">Começar duelo</button>`;return}
 const me=G.P[0],ai=G.P[1];G.ui=[];
 let h=`<div class=nm style="margin:2px 2px 6px"><span>Rodada ${G.round}</span><span>${G.over?'Fim':'Turno: '+cur().n}</span></div>${card(ai)}${card(me)}
 <div id=log>${G.log.slice(-40).map(l=>`<p class="${l[0]?'':'m'}">${l[1]}</p>`).join('')}</div>`;
 if(G.over)h+=`<div class=win>${G.msg}</div><button class=go onclick="newDuel()">Novo duelo</button>`;
 else if(cur()===me&&!G.pend){const T=CH[me.key].T,ac=T.filter(t=>t.t!='atk'&&t.t!='disc'),at=T.filter(t=>t.t=='atk'||t.t=='disc');
  h+=`<h2>Ativações (várias por turno)</h2>`+ac.map(t=>{G.ui.push(t);return btn(t,G.ui.length-1,me,ai)}).join('')
   +`<h2>Ataque (só um por turno)</h2>`+at.map(t=>{G.ui.push(t);return btn(t,G.ui.length-1,me,ai)}).join('')
   +`<button class=go onclick="pass()">Encerrar turno</button>`}
 else if(!G.pend)h+=`<p style="text-align:center;color:var(--mut)">A IA está jogando…</p>`;
 if(G.pend){const p=G.pend;h+=`<div class=ov><div><b>${ai.n} usa ${p.t.n}!</b><p>ATK ${fmt(p.at)} contra sua DEF ${fmt(defOf(me))}. Como reagir?</p>
  ${p.opts.map((o,i)=>`<button onclick="esc(${i})"><b>${o.n}</b><small>${o.cost?'Custa CK '+fmt(o.cost):o.ag?'Custa AG '+fmt(o.ag):'Sem custo'}</small></button>`).join('')}
  <button class=go onclick="esc(-1)">Receber o golpe</button></div></div>`}
 app.innerHTML=h;const l=$('#log');if(l)l.scrollTop=l.scrollHeight}
S.render=render;
// Módulos ES6 não criam globais: expõe o que os onclick do HTML usam
Object.assign(window,{SEL:S.SEL,render,start,go,esc,pass,newDuel(){S.G=null;render()}});
render();
