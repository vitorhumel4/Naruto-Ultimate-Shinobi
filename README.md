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


## Regras adicionadas nesta cópia de trabalho
- Técnicas comuns do protótipo: empunhar Kunai (100 AG), Taijutsu físico (ATK físico, 1.000 AG), arremesso de Kunai (5.000 de dano direto no HP, 100 AG) e criação de clones das sombras (500 CK por clone).
- Kunai arremessada deixa de estar empunhada. O bloqueio reativo contra armamentos à distância é oferecido quando o defensor tem Kunai empunhada (500 AG).
- Kawarimi pode evitar ataques à distância, custa 500 CK e tem limite de cinco usos por combate. A Flor de Fênix usa Evasiva, pois é de curto alcance.
- Clones das sombras absorvem um ataque cada e também interceptam Genjutsu. O Genjutsu compartilhado de Shisui está disponível a Shisui, Sasuke e Itachi.
- A interface mostra níveis de velocidade/reação e o gasto contínuo de CK/HP/AG por rodada dos modos ativos e do Susanoo.
- Susanoo e modos elegíveis do Naruto podem ser escolhidos como reação quando sua defesa ou HP adicional evita o resultado fatal.

Para executar os testes rápidos com Node.js: `node --experimental-default-type=module tests/engine-smoke.mjs`.

## Pendências para fechar as regras
- Velocidade de cada técnica não informada na ficha usa nível 1 por padrão; as fichas devem receber `speed` quando esse valor for conhecido. Técnicas de defesa instantânea podem usar `instant: true`, mas nenhuma foi marcada automaticamente.
- O limite máximo de clones por personagem varia, mas a ficha atual não informa os limites individuais; o custo de 500 CK impede criar clones sem recursos, ainda sem aplicar os limites por personagem.
- A regra completa de alvos múltiplos (aliados, invocações, clones como participantes e distribuição de ataques) exige o futuro motor de equipes; esta versão 1v1 aplica os clones apenas como interceptadores.
- O efeito do Genjutsu foi implementado por duas rodadas; Doujutsu ativo previne a captura. A cobertura de visão, distância entre combatentes e técnicas que cegam ainda dependem de atributos/sistemas não existentes no protótipo.
