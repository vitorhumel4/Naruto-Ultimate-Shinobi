import {A,needShar,SHAR,MANG,KAI,PREV,SUST,FLOR,GBF,DRG,SUSATK,SHISUI_GEN,KUNAI_COMMON} from '../data/shared/techniques.js';
export default {key:'sasuke',n:'Sasuke Uchiha',st:{atk:1e5,def:4e4,hp:4e5,ag:45e4,ck:45e4},T:[...KUNAI_COMMON,SHAR,MANG,KAI,PREV,...SUST,
 {id:'sel1',n:'Selo Amaldiçoado Nv.1',rk:'B',t:'mode'},A('chi','Chidori','A',{atk:5e4,ck:5000,req:needShar}),A('rai','Raikiri','S',{atk:1e5,ck:1e4,max:6,req:needShar}),A('lan','Lança Afiada de Chidori','SS',{atk:3e5,ck:1e4,req:needShar}),FLOR,GBF,DRG,SUSATK,SHISUI_GEN]};
