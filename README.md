# Naruto: Duelo Shinobi — notas da refatoração

## Como jogar
Publique a pasta inteira em hospedagem estática HTTPS (GitHub Pages ou Netlify) e abra o endereço no navegador. Abrir `index.html` direto (`file://`) pode não funcionar: o navegador bloqueia módulos ES6 nesse modo. Não precisa de Node.js nem de instalação; todos os caminhos são relativos.

## Arquitetura
- `index.html` — página e CSS; carrega `js/main.js` com `type="module"`.
- `js/main.js` — interface (render, botões) e ponto de entrada.
- `js/engine/rules.js` — estado da luta (`S`), utilitários, requisitos (`why`), trapaça no 1º turno e vitória (`chk`).
- `js/engine/effects.js` — modos, custos contínuos (`upkeep`) e passagem de rodada (`tick`).
- `js/engine/combat.js` — ataques, escapes e reações do defensor.
- `js/engine/battle.js` — início da luta, turnos e IA.
- `js/data/characters.js` — registro central (`CH`). `js/data/shared/` contém modos, estados e técnicas comuns; `js/characters/` mantém um arquivo por personagem.

Para adicionar um personagem: crie `js/characters/novo.js` e inclua-o na lista de `js/data/characters.js`.

## Regras e recursos nesta atualização
- Limites temporários de Clones das Sombras: Naruto 10, Sasuke 8, Shisui 2 e Itachi 2. Apenas clones das sombras usam esses limites. Clones de água/corvos ainda não foram implementados; quando entrarem, deverão ter regras próprias, sem compartilhar o limite. Naruto poderá chegar a 200 em etapa futura. Criação em lote custa 500 CK por clone.
- Cooldown padrão dos ataques: rank S = 1 turno, SS = 2 e SSS = 3; o valor individual da ficha prevalece. Dōjutsu e modos não recebem o padrão.
- Técnicas com múltiplos alvos usam clones para representar alvos/interceptações adicionais no protótipo 1v1; isso não substitui um futuro modo de equipes.
- A interface permite consultar passivas dos dois combatentes e expandir detalhes das técnicas; o log de combate mostra informação descritiva ao usar uma técnica.
- Modos já ativos ou inferiores ao modo atual não são oferecidos como reação. Susanoo e modos elegíveis do Naruto podem ser reações quando evitam dano ou derrota.
- CPU x CPU tem controles de pausa e velocidade (1×, 2× e 4×); pausar conserva o tempo restante do passo, e mudar velocidade também atualiza o timer em andamento.
- Itachi recebeu uma primeira leva, não o inventário completo. Veja `ITACHI-PENDENCIAS.md`.
- Regras comuns incluem empunhar Kunai (100 AG), Taijutsu físico (1.000 AG), arremesso de Kunai (5.000 de dano direto no HP, 100 AG), bloqueio reativo de armamentos à distância com Kunai empunhada (500 AG) e Kawarimi (500 CK, até cinco usos por combate, contra ataques à distância).
- Clones das sombras absorvem um ataque cada e interceptam Genjutsu. O Genjutsu compartilhado de Shisui está disponível a Shisui, Sasuke e Itachi.
- A interface mostra níveis de velocidade/reação e gasto contínuo de CK/HP/AG por rodada dos modos ativos e do Susanoo.

## Limitações conhecidas
- Atributos no código divergem das fichas: Naruto/Sasuke/Shisui têm ATK 100.000 (ficha: 400.000), DEF 40.000/40.000/30.000 (ficha: 350.000/350.000/300.000).
- Punho Adamantino e Selo Amaldiçoado não podem ser desativados manualmente; só caem por falta de recursos. Punho Adamantino não tem o cooldown de 2 turnos ao desativar.
- A versão publicada antes como artifact é mais antiga e não tem Itachi, Kai nem Previsão de Movimento.
- Velocidade não informada na ficha usa nível 1; técnicas de defesa instantânea podem usar `instant: true`, mas nenhuma foi marcada automaticamente.
- O protótipo não modela integralmente visão/distância, sensores, voo, dimensões, aliados ou equipes. O Genjutsu dura duas rodadas e dōjutsu ativo previne a captura. O Espelho de Yata anula ataques frontais, mas não reflete o golpe contra o atacante. O sensor auditivo fica ativo até o fim da luta; abrir os olhos e o cooldown de reativação ainda não são automatizados.
- O protótipo não possui sistema de compra/desbloqueio de técnicas; constar no catálogo do personagem significa estar disponível. Em Sonho Negro, “Tsukuyomi liberado” é implícito porque a técnica consta no catálogo de Itachi; não é necessário usá-la antes.
- Amaterasu: Camada Dupla exige Susanoo Corpo Completo com Armadura, mas a ficha declara ATK ilimitado e combo em dupla; no protótipo usa teto de 1.000.000, sem simular a perseguição das chamas, incineração ou segundo combatente. É aproximação provisória, não balanceamento final.
- Não foi possível testar a interface em navegador/celular neste ambiente.

## Testes
`node --experimental-default-type=module tests/engine-smoke.mjs` passou, incluindo testes para o requisito de armadura do Amaterasu, paralisia condicionada ao dano, IA usando o Yata ativo e reagendamento dos timers por pausa/velocidade. Os módulos `.js` passaram em `node --check`, `git diff --check` não apontou problemas, e 48 lutas CPU x CPU (4 personagens × 4 oponentes × 3 dificuldades) terminaram sem erro. Uma luta automatizada não substitui validação visual real no navegador.
