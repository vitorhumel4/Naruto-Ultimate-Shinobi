import assert from 'node:assert/strict';
globalThis.setTimeout=()=>0;
import {CH} from '../js/data/characters.js';
import {S,mk,reactionOf,why,cooldownOf} from '../js/engine/rules.js';
import {act,setMode} from '../js/engine/effects.js';
import {endTurn,start,schedule,setBattleSpeed,remainingDelay} from '../js/engine/battle.js';
import {attack,escOpts,aiEsc} from '../js/engine/combat.js';

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
{
  const limits={naruto:10,sasuke:8,shisui:2,itachi:2};
  for(const [key,n] of Object.entries(limits))assert.equal(mk(key,true,0).cloneLimit,n,`${key} deve ter limite próprio de clones`);
  const [p,o]=duel('itachi','naruto'),clone=CH.itachi.T.find(t=>t.t==='clone');
  assert.equal(why(p,o,{...clone,count:2}),'', 'Itachi deve poder criar seus dois clones juntos');
  act(p,{...clone,count:2},o);assert.equal(p.cloneCount,2);assert.equal(p.cur.ck,299000);
  assert.match(why(p,o,{...clone,count:1}),/Limite/,'não deve exceder o limite de clones');
  assert.equal(p.cloneLimit,2,'outros tipos de clones não aumentam nem consomem este limite');
}
{
  const [p,o]=duel();o.cloneCount=2;
  attack(p,o,{id:'area',n:'Técnica em área',t:'atk',rk:'A',atk:100000,tg:1,maxTargets:3,speed:1,esc:[]});
  assert.equal(o.cloneCount,0,'cada clone representa um dos alvos da técnica em área');
  assert.equal(o.cur.hp,o.mx.hp-100000,'além dos clones, o alvo principal também é atingido quando há alvo restante');
}
{
  const [p,o]=duel();
  for(const [rk,cd] of [['S',1],['SS',2],['SSS',3]])assert.equal(cooldownOf({rk}),cd,`cooldown padrão de rank ${rk}`);
  assert.equal(cooldownOf({rk:'SSS',cd:2}),2,'cooldown explícito prevalece sobre o padrão');
  attack(p,o,{id:'rankS',n:'Ataque S',t:'atk',rk:'S',atk:1,tg:1,esc:[]});assert.equal(p.cd.rankS,2,'1 turno de cooldown mantém a técnica indisponível até passar o próximo turno do usuário');
  attack(p,o,{id:'rankSSS',n:'Ataque SSS com ficha',t:'atk',rk:'SSS',cd:2,atk:1,tg:1,esc:[]});assert.equal(p.cd.rankSSS,3);
}
{
  const [p,o]=duel('sasuke','naruto'),strike={id:'hit',n:'Golpe',t:'atk',atk:500000,tg:1,speed:1,esc:['ev']};
  setMode(o,'manto1',1);const opts=escOpts(p,o,strike);
  assert(!opts.some(x=>x.tech?.id==='manto1'),'não oferece o modo já ativo');
  assert(!opts.some(x=>x.tech?.id==='sabio')||opts.some(x=>x.tech?.id==='kyu'),'não pode oferecer modo inferior ou repetido');
  assert(opts.some(x=>x.tech?.id==='kyu'),'modo superior pode ser reação quando salva de dano');
  setMode(o,'manto1',0);setMode(o,'sabio',1);const stronger=escOpts(p,o,strike);
  assert(!stronger.some(x=>x.tech?.id==='sabio'||x.tech?.id==='manto1'),'não oferece modo ativo nem inferior');
}
{
  const [p,o]=duel('sasuke','itachi');o.h=true;o.sus=1;
  const strike={id:'hit',n:'Golpe frontal',t:'atk',atk:300000,tg:1,speed:1,esc:[]};attack(p,o,strike);
  const yata=S.G.pend.opts.find(x=>x.kind==='yata-activate');assert(yata,'Yata deve poder ser ativado como reação');
  const hp=o.cur.hp;S.G.pend.cb(yata);assert.equal(o.cur.hp,hp);assert(o.on.yata);assert.equal(o.cur.ck,280000);assert.equal(o.cur.ag,330000);
}
{
  S.SEL.cpu=true;S.SEL.me='naruto';S.SEL.ai='sasuke';start();
  assert.equal(S.G.cpuMode,true);assert.equal(!!S.G.P[0].h,false);assert.equal(!!S.G.P[1].h,false,'CPU x CPU deve atribuir ambos os turnos à IA');
  assert.equal(S.G.speed,S.SEL.speed);S.G=null;S.SEL.cpu=false;
}
{
  const [p,o]=duel('itachi','naruto'),double=CH.itachi.T.find(t=>t.id==='amaterasuDouble');
  p.sus=4;assert.match(why(p,o,double),/Corpo Completo com Armadura/,'Amaterasu: Camada Dupla deve exigir a forma de armadura');
  p.sus=5;assert.equal(why(p,o,double),'','Susanoo Corpo Completo com Armadura deve satisfazer o requisito');
}
{
  const [p,o]=duel();o.mx.def=100000;
  attack(p,o,{id:'stun',n:'Paralisia de teste',t:'atk',atk:50000,tg:5,speed:1,esc:[],controlledTurns:2});
  assert.equal(o.cur.hp,o.mx.hp,'golpe abaixo da DEF não deve causar dano');
  assert.equal(o.controlled,0,'efeito de paralisia que exige acerto não se aplica se não há dano');
}
{
  const [p,o]=duel('sasuke','itachi');o.on.yata=99;o.diff=2;
  const opts=escOpts(p,o,{id:'front',n:'Golpe frontal',t:'atk',atk:100000,tg:1,speed:1,esc:[]});
  const yata=opts.find(x=>x.kind==='yata');assert(yata,'Yata ativo deve aparecer como reação frontal');
  assert.equal(aiEsc(o,opts,100000),yata,'a IA deve selecionar o bloqueio gratuito do Yata ativo');
}
{
  const originalSet=globalThis.setTimeout,originalClear=globalThis.clearTimeout,delays=[];
  globalThis.setTimeout=(fn,ms)=>{delays.push(ms);return delays.length};globalThis.clearTimeout=()=>{};
  S.G={speed:1,paused:false,timer:0,pendingFn:null,delay:0};schedule(()=>{},800);
  assert.equal(delays.at(-1),800);setBattleSpeed(4);
  assert(delays.at(-1)<=200&&delays.at(-1)>0,'mudar para 4× deve reagendar o timer em andamento');
  const remaining=remainingDelay(S.G);clearTimeout(S.G.timer);S.G.timer=0;S.G.paused=true;S.G.remainingMs=remaining;
  setBattleSpeed(2);S.G.paused=false;schedule(S.G.pendingFn,S.G.remainingMs);
  assert(delays.at(-1)<=remaining/2+1,'retomar em 2× deve usar o tempo restante e a velocidade nova');
  globalThis.setTimeout=originalSet;globalThis.clearTimeout=originalClear;S.G=null;
}

console.log('Todos os testes rápidos do motor passaram.');
