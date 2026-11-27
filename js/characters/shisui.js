import {A,SHAR,MANG,KAI,PREV,SUST,FLOR,GBF,DRG,SUSATK} from '../data/shared/techniques.js';
export default {key:'shisui',n:'Shisui Uchiha',st:{atk:1e5,def:3e4,hp:3e5,ag:45e4,ck:35e4},T:[SHAR,MANG,KAI,PREV,...SUST,
 {id:'tanto',n:'Empunhar Tantō',rk:'S/R',t:'flag',ag:2000},
 {id:'rastro',n:'Clones de Rastro (5 turnos)',rk:'S',t:'flag',ck:7500,turns:5},
 A('seg','Transversal Cintilante: 2º Passo','S',{atk:12e4,fis:1,ag:5000,ck:1e4,cd:1,esc:['v4'],req:f=>f.on.tanto?0:'Requer Tantō'}),
 FLOR,GBF,DRG,SUSATK,
 {id:'koto',n:'Kotoamatsukami (1x)',rk:'SSS',t:'koto',ck:2e4,hp:1e4,max:1,t1:false,req:f=>f.on.mang?0:'Requer Mangekyou'},
 A('feixe','Koto: Feixe de Luz (1x)','SSS',{atk:4e5,ck:3e4,hp:2e4,max:1,esc:[],t1:false,req:(f,o)=>f.kn?'Espere o próximo turno':f.on.koto&&o.kmark?0:'Requer Koto no alvo'}),
 A('tsu','Susanoo: Tsukumo','SSS',{atk:6e5,ck:3e4,hp:2e4,tg:25,cd:2,esc:['v3'],req:f=>f.sus>=4?0:'Requer Susanoo Corpo Completo'})]};
