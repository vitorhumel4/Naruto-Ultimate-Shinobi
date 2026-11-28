import assert from 'node:assert/strict';
globalThis.setTimeout=()=>0;
import {CH} from '../js/data/characters.js';
import {S,mk,reactionOf} from '../js/engine/rules.js';
import {act} from '../js/engine/effects.js';
import {endTurn} from '../js/engine/battle.js';
import {attack,escOpts} from '../js/engine/combat.js';

function duel(a='naruto',b='sasuke') {
  const player=mk(a,true,0), opponent=mk(b,false,1);
  player.turns=opponent.turns=2;
  S.G={P:[player,opponent],order:[0,1],i:0,round:2,log:[],over:0,pend:null};
  S.render=()=>{};
  S.endTurn=()=>{};
  return [player,opponent];
}

for (const key of Object.keys(CH)) {
  for (const id of ['kunai','taifis','kunaiThrow','shadowClone'])
    assert(CH[key].T.some(t=>t.id===id),`${key} precisa da técnica comum ${id}`);
}
for (const key of ['sasuke','shisui','itachi'])
  assert(CH[key].T.some(t=>t.id==='shisuiGen'),`${key} precisa do Genjutsu de Shisui`);

{
  const [p,o]=duel();
  act(p,CH.naruto.T.find(t=>t.id==='kunai'),o);
  assert.equal(p.cur.ag,399900);
  assert(p.on.kunai);
  const tai=CH.naruto.T.find(t=>t.id==='taifis');
  assert.equal(tai.atk(p)+p.mx.atk+tai.kunaiBonus,p.mx.atk+5000);
}
{
  const [p,o]=duel();
  act(p,CH.naruto.T.find(t=>t.id==='kunai'),o);
  S.G.order=[1,0];S.G.i=1;
  endTurn();
  assert.equal(S.G.round,3,'fim da rodada deve avançar o contador');
  assert.equal(S.G.i,0,'turno deve voltar ao início da ordem');
  assert.equal(S.G.P[S.G.order[S.G.i]],o,'o oponente/IA deve receber o próximo turno');
  assert.equal(o.turns,3,'o contador de turno da IA deve avançar');
  assert.equal(p.on.kunai,99,'Kunai empunhada deve permanecer até ser arremessada ou a luta acabar');
}
{
  const [p,o]=duel();
  act(p,CH.naruto.T.find(t=>t.id==='kunai'),o);
  const hp=o.cur.hp;
  attack(p,o,CH.naruto.T.find(t=>t.id==='kunaiThrow'));
  assert.equal(o.cur.hp,hp-5000,'Kunai deve ignorar DEF corporal');
  assert(!p.on.kunai,'arremesso deve consumir a Kunai empunhada');
  const [p2,o2]=duel();act(p2,CH.naruto.T.find(t=>t.id==='kunai'),o2);o2.sus=1;const hp2=o2.cur.hp;attack(p2,o2,CH.naruto.T.find(t=>t.id==='kunaiThrow'));assert.equal(o2.cur.hp,hp2,'defesa externa deve bloquear Kunai quando sua DEF supera o ataque');
}
{
  const [p,o]=duel();
  const ranged={id:'test',n:'Teste de longo alcance',t:'atk',atk:1000,tg:15,speed:1,esc:['ev']};
  const kaw=escOpts(p,o,ranged).find(x=>x.n==='Kawarimi');assert(kaw);assert.equal(kaw.cost,500);assert.equal(kaw.ag,undefined);
  o.h=true;attack(p,o,ranged);const choice=S.G.pend.opts.find(x=>x.n==='Kawarimi');const ck=o.cur.ck,ag=o.cur.ag;S.G.pend.cb(choice);assert.equal(o.cur.ck,ck-500);assert.equal(o.cur.ag,ag);assert.equal(o.use.kaw,1);
  o.use.kaw=5;
  assert(!escOpts(p,o,ranged).some(x=>x.n==='Kawarimi'));
}
{
  const [p,o]=duel();o.cloneCount=2;
  attack(p,o,{id:'hit',n:'Ataque de teste',t:'atk',atk:10000,tg:1,speed:1,esc:['ev']});
  assert.equal(o.cloneCount,1);
  assert.equal(o.cur.hp,o.mx.hp,'clone intercepta o ataque');
}
{
  const [p,o]=duel();o.on.shar=99;
  assert.equal(reactionOf(o),3);
  assert(escOpts(p,o,{id:'hit',n:'Teste',t:'atk',atk:10000,tg:1,speed:4,esc:['ev']}).every(x=>x.n!=='Evasiva'));
}
{
  const [p,o]=duel('sasuke','itachi');o.on.mang=99;
  const choices=escOpts(p,o,{id:'hit',n:'Teste',t:'atk',atk:100000,tg:1,speed:1,esc:['ev']});
  assert(choices.some(x=>x.kind==='defense'&&x.tech.t==='sus'));
  assert(!escOpts(p,o,{id:'low',n:'Golpe já bloqueado',t:'atk',atk:1000,tg:1,speed:1,esc:['ev']}).some(x=>x.kind==='defense'), 'não deve gastar defesa quando o golpe já não supera a DEF corporal');
  o.h=true;attack(p,o,{id:'hit',n:'Golpe',t:'atk',atk:100000,tg:1,speed:1,esc:['ev']});
  const sus= S.G.pend.opts.find(x=>x.kind==='defense'&&x.tech.t==='sus');
  assert(sus,'reação deve permitir escolher Susanoo');const hp=o.cur.hp;S.G.pend.cb(sus);
  assert.equal(o.sus,sus.tech.s);assert.equal(o.cur.hp,hp,'Susanoo deve barrar o golpe se sua DEF for suficiente');
}
{
  const [p,o]=duel('sasuke','naruto');
  const strike={id:'hit',n:'Golpe',t:'atk',atk:100000,tg:1,speed:1,esc:['ev']};
  assert(escOpts(p,o,strike).some(x=>x.kind==='defense'&&x.tech.id==='sabio'),'Modo Sábio deve aparecer se sua DEF impede o golpe');
  o.h=true;attack(p,o,strike);const mode=S.G.pend.opts.find(x=>x.kind==='defense'&&x.tech.id==='sabio');
  const hp=o.cur.hp;S.G.pend.cb(mode);assert(o.cur.hp>hp,'modo deve aumentar HP base ao ser ativado como reação');assert.equal(o.cur.hp,hp+250000);
}
{
  const [p,o]=duel('sasuke','naruto');o.h=true;
  const strike={id:'lethal',n:'Golpe pesado',t:'atk',atk:500000,tg:1,speed:1,esc:['ev']};
  attack(p,o,strike);const mode=S.G.pend.opts.find(x=>x.kind==='defense'&&x.tech.id==='sabio');
  assert(mode,'modo deve ser oferecido quando o HP extra evita a derrota');
  S.G.pend.cb(mode);assert(o.cur.hp>0,'HP extra deve permitir sobreviver ao golpe');
}
{
  const [p,o]=duel();
  attack(p,o,{id:'gen',n:'Genjutsu de teste',t:'atk',atk:0,ck:0,tg:15,speed:1,genjutsu:true,visual:true,esc:[]});
  assert.equal(o.on.surprised,2,'Genjutsu deve aplicar vulnerabilidade por duas rodadas');
  const hp=o.cur.hp;
  attack(p,o,{id:'low',n:'Ataque menor que a DEF',t:'atk',atk:10000,tg:1,speed:1,esc:['ev']});
  assert.equal(o.cur.hp,hp-10000,'alvo sob Genjutsu recebe dano direto no HP');
}

console.log('Todos os testes rápidos do motor passaram.');
