// Registro central de personagens
import naruto from '../characters/naruto.js';
import sasuke from '../characters/sasuke.js';
import shisui from '../characters/shisui.js';
import itachi from '../characters/itachi.js';
export const CH={};
for(const {key,...c} of [naruto,sasuke,shisui,itachi])CH[key]=c;
