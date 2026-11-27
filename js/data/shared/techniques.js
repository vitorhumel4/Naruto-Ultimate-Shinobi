// Técnicas compartilhadas entre personagens
import {SUS} from './modes.js';
export const A=(id,n,rk,o)=>({id,n,rk,t:'atk',tg:1,esc:['ev'],...o});
export const needShar=f=>f.on.shar?0:'Requer Sharingan';
export const SHAR={id:'shar',n:'Sharingan',rk:'S/R',t:'flag',ck:2000};
export const MANG={id:'mang',n:'Mangekyou Sharingan',rk:'S/R',t:'flag',ck:3000,mg:1,req:f=>f.on.shar?0:'Requer Sharingan'};
export const SUST=[1,2,3,4,5].map(s=>({id:'sus'+s,n:'Susanoo: '+SUS[s].n,rk:s<3?'S':s<5?'SS':'SSS',t:'sus',s,ck:SUS[s].ck,mg:1,req:f=>!f.on.mang?'Requer Mangekyou':f.sus>=s?'Já ativo ou superior':0}));
export const SUSATK=A('susatk','Susanoo: Golpe','S',{ag:5000,esc:['ev','cint'],atk:f=>SUS[f.sus].a,req:f=>f.sus?0:'Requer Susanoo'});
export const GBF=A('gbf','Grande Bola de Fogo','A',{atk:5e4,ck:3000,tg:15,esc:['cint']});
export const DRG=A('drg','Dragão de Fogo','A',{atk:1e5,ck:5000,tg:15,esc:['cint']});
export const FLOR=A('flor','Estilo Fogo: Flor de Fênix','C',{atk:5e4,ck:3000,tg:5,cd:1,esc:['kaw']});
export const KAI={id:'kai',n:'Sharingan: Genjutsu no Kai',rk:'A',t:'flag',ck:2000,noai:1,req:f=>f.on.shar?0:'Requer Sharingan'};
export const PREV={id:'prev',n:'Previsão de Movimento',rk:'A',t:'flag',noai:1,req:f=>f.on.shar?0:'Requer Sharingan'};
export const ESM=A('esm','Susanoo: Esmagar','S',{ag:1e4,atk:f=>SUS[f.sus].a,req:f=>f.sus>=2?0:'Requer Susanoo Esqueleto'});
