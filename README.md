# Naruto: Duelo Shinobi — notas da refatoração

## Como jogar
Publique a pasta inteira em hospedagem estática HTTPS (GitHub Pages ou Netlify) e abra o endereço no navegador.
Abrir `index.html` direto (file://) pode não funcionar: o navegador bloqueia módulos ES6 nesse modo.
Não precisa de Node.js nem de instalação. Todos os caminhos são relativos.

## Arquitetura
- `index.html` — página e CSS; carrega `js/main.js` com `type="module"`.
- `js/main.js` — interface (render, botões) e ponto de entrada.
- `js/engine/rules.js` — estado da luta (`S`), utilitários, requisitos (`why`), trapaça no 1º turno, vitória (`chk`).
- `js/engine/effects.js` — modos, custos contínuos (`upkeep`), passagem de rodada (`tick`).
- `js/engine/combat.js` — ataques, escapes e reação do defensor.
- `js/engine/battle.js` — início da luta, turnos e IA.
- `js/data/characters.js` — registro central (`CH`).
- `js/data/shared/` — `modes.js` (modos e Susanoo), `flags.js` (estados), `techniques.js` (técnicas compartilhadas).
- `js/characters/` — um arquivo por personagem (naruto, sasuke, shisui, itachi).

Para adicionar um personagem: crie `js/characters/novo.js` e inclua-o na lista de `js/data/characters.js`.

## Mudanças estruturais (comportamento igual)
- O estado global `G` virou `S.G`, e `render`/`endTurn` são ligados por `S` para evitar imports circulares.
- `req` das técnicas agora recebe o estado `G` como 3º argumento (usado só pelo Discurso do Naruto).
- Os botões chamavam variáveis globais; `main.js` as expõe em `window`. O botão "Novo duelo" usa `newDuel()`.

## Testes feitos
- Comparação automática dos dados (técnicas, atributos, MOD, FLAG, SUS) com o `index.html` original: idênticos (Naruto 10, Sasuke 17, Shisui 19, Itachi 14 técnicas).
- 48 lutas IA vs IA (4 personagens x 4 oponentes x 3 dificuldades): todas terminaram, sem erros.
- Luta completa com jogador simulado (Shisui vs Naruto, IA Difícil): ativações, ataques, escapes, recargas, fim e novo duelo funcionaram.
- Não testado em navegador real nem em celular.

## Problemas preexistentes (não alterados)
- Atributos no código divergem das fichas: Naruto/Sasuke/Shisui têm ATK 100.000 (ficha: 400.000), DEF 40.000/40.000/30.000 (ficha: 350.000/350.000/300.000).
- Punho Adamantino e Selo Amaldiçoado não podem ser desativados pelo jogador; só caem por falta de recursos.
- Punho Adamantino não tem o cooldown de 2 turnos ao desativar.
- A versão publicada antes como artifact é mais antiga e não tem Itachi, Kai nem Previsão de Movimento.
