// Ativação/desativação de modos, custos contínuos e passagem de rodada
import {MOD,SUS} from '../data/shared/modes.js';
import {FLAG} from '../data/shared/flags.js';
import {S,log,cst} from './rules.js';
export function setMode(f,id,on){const b=MOD[id].b,s=on?1:-1;
 for(const k in b){f.mx[k]+=s*b[k];if(k!='atk'&&k!='def'){if(on)f.cur[k]+=b[k];else f.cur[k]=Math.min(f.cur[k],f.mx[k])}}
 if(on)f.on[id]=MOD[id].t||99;else delete f.on[id]}
export function off(f,id){if(MOD[id])setMode(f,id,0);else if(id=='sus')f.sus=0;else delete f.on[id]}
export function act(f,t,o){if(t.grp&&f.on[t.id]){setMode(f,t.id,0);log(0,`${f.n} desativa ${t.n}.`);return}
 for(const k of['ck','ag','hp'])if(t[k])f.cur[k]-=cst(f,t,k);
 f.use[t.id]=(f.use[t.id]||0)+1;
 if(t.t=='sus'){f.sus=t.s;log(0,`${f.n} ativa ${t.n}.`)}
 else if(t.t=='mode'){setMode(f,t.id,1);log(0,`${f.n} ativa ${t.n}.`)}
 else if(t.t=='flag'){f.on[t.id]=t.turns||99;log(0,`${f.n} ativa ${t.n}.`)}
 else if(t.t=='koto'){f.on.koto=99;o.koto=1;o.kmark=1;f.kn=1;log(0,`${f.n} prende ${o.n} no Kotoamatsukami! ${o.n} não poderá atacar no próximo turno.`)}}
export function upkeep(f){const l=[];for(const id in f.on){const u=MOD[id]?MOD[id].up:FLAG[id]&&FLAG[id].up;if(u)l.push([id,u,MOD[id]?MOD[id].n:FLAG[id].n])}
 if(f.sus)l.push(['sus',SUS[f.sus].up,'Susanoo']);
 for(const[id,u,n]of l){const hp=(u.hp||0)*(f.key=='itachi'&&(id=='mang'||id=='sus')?2:1);if((hp&&f.cur.hp<=hp)||(u.ck&&f.cur.ck<=u.ck)){off(f,id);if(id=='prev')f.cd.prev=3;log(0,`${n} de ${f.n} se desfaz por falta de recursos.`)}
  else{f.cur.hp-=hp;if(u.ck)f.cur.ck-=u.ck}}}
export function tick(){const G=S.G;for(const f of G.P){for(const id in f.on)if(f.on[id]<99){if(--f.on[id]<=0){off(f,id);log(0,`${FLAG[id]?FLAG[id].n:MOD[id].n} de ${f.n} terminou.`)}}
 for(const k in f.cd)if(f.cd[k]>0)f.cd[k]--}
 G.round++;if(G.round>40){const[a,b]=G.P,pa=a.cur.hp/a.mx.hp,pb=b.cur.hp/b.mx.hp;G.over=1;G.round=40;G.msg=pa==pb?'Empate: limite de 40 rodadas.':(pa>pb?a:b).n+' vence por pontos (maior % de HP após 40 rodadas).';log(1,G.msg);S.render()}}
