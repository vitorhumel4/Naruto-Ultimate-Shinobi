import {A} from '../data/shared/techniques.js';
export default {key:'naruto',n:'Naruto Uzumaki',st:{atk:1e5,def:4e4,hp:45e4,ag:4e5,ck:45e4},T:[
 A('ras','Rasengan','A',{atk:5e4,ck:5000}),
 A('rasg','Rasengan Gigante','S',{atk:2e5,ck:1e4,tg:3,esc:['ev','cint']}),
 {id:'sabio',n:'Modo Sábio',rk:'SS',t:'mode',ck:0,grp:1},
 {id:'manto1',n:'Manto de Uma Cauda',rk:'B',t:'mode',grp:1},
 {id:'kyu',n:'Modo Kurama V2',rk:'SSS',t:'mode',grp:1},
 {id:'adam',n:'Punho Adamantino',rk:'S',t:'mode',ck:5000},
 A('aras','Arte Eremita: Rasengan Gigante','SS',{atk:4e5,ck:2e4,tg:10,esc:['ev','cint'],req:f=>f.on.sabio?0:'Requer Modo Sábio'}),
 A('sras','Super Rasengan Gigante','SS',{atk:6e5,ck:3e4,tg:15,cd:1,esc:['cint']}),
 A('rsh','Rasenshuriken: Lâmina Espiral','SS',{atk:5e5,ck:25000,hp:15000,tg:10,esc:['cint']}),
 // req recebe o estado do jogo (G) como 3º argumento
 {id:'disc',n:'Discurso (W.O. 6 em 8)',rk:'Passiva',t:'disc',req:(f,o,G)=>G.round<25?'Só após 25 turnos':o.cur.hp>o.mx.hp/2?'Alvo precisa ter ≤50% do HP':0}]};
