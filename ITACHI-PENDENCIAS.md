# Itachi — técnicas ainda pendentes

Esta versão implementa deliberadamente uma primeira leva menor, priorizando técnicas cujo efeito cabe no combate atual 1v1. O inventário completo está na ficha compilada `Fichas de técnicas de Itachi Uchiha.md`; este documento deve servir de lembrete para as próximas etapas.

## Incluídas nesta leva

Foram acrescentadas ou detalhadas no arquivo do Itachi: Sharingan: Confusão Negativa; Genjutsu: Sharingan; Sensoriamento Auditivo Instintivo; Personificação de Chakra; Clone da Grande Explosão; Projétil do Dragão de Água; Genjutsu Efêmero; Ilusão Demoníaca: Paralisia de Pregos; Tsukuyomi; Sonho Negro; Liberação de Fogo: Grande Bola de Chamas; Espelho de Yata; Yasaka Magatama; e Amaterasu: Camada Dupla. As técnicas compartilhadas — Sharingan, Mangekyou, Susanoo, clones das sombras e Genjutsu de Shisui — também estão disponíveis conforme as regras comuns do protótipo.

**Amaterasu: Camada Dupla:** foi aplicado o requisito acordado de Susanoo Corpo Completo **com armadura** (nível 5), em vez da forma sem armadura citada de modo conflitante na ficha. A ficha declara ATK ilimitado e combo em dupla; para caber no motor atual, foi usado teto numérico de 1.000.000 e não são simulados o segundo combatente, as chamas que perseguem nem a incineração posterior. O valor é uma aproximação de protótipo, não uma decisão definitiva de balanceamento.

## Não implementadas ainda

| Rank / grupo | Técnica(s) pendente(s) | Por que ficou para depois |
|---|---|---|
| S/R | Clone de Água | Requer regras próprias de clones e limites separados; não deve consumir o limite de Clones das Sombras. |
| S/R | Técnica de Remoção de Olhos | Efeito persistente sobre visão/dōjutsu, condição médica e possível sensor para continuar lutando não existem no motor. |
| A | Interceptação da Previsão do Sharingan | Reação específica a taijutsu/contato, requer Previsão ativa, uso por luta e incapacitação de selos de mão. |
| A | Coerção Sharingan e Coerção: Ataque Ilusório | A primeira exige estados detalhados de genjutsu; a segunda redireciona técnicas de controle remoto e tem usos limitados. |
| A | Dança dos Clones de Corvos | Combina evasão/substituição, intangibilidade e contra-ataque; exige resolução de ação defensiva combinada. |
| A | Genjutsu: Retorno do Espelho | Requer efeito de próxima ação contra o próprio usuário, uso como defesa antes do ataque e escapes com dificuldade alterada. |
| A | Alteração de Chakra (variante da Personificação) | Disfarce de assinatura para enganar sensores e dōjutsu, com custo contínuo e cooldown próprio. A versão básica da Personificação foi incluída; esta variante, não. |
| A | Técnica de Rebote | Exige redirecionamento de projéteis, número variável de projéteis, dano aditivo e alvos fora da linha de visão. |
| S | Técnica dos Mil Corvos Dispersos — base, Substituição e Voo | Depende de um Clone de Corvos presente, não representado no protótipo. O voo/intangibilidade e o mascaramento sensorial também precisam de estados próprios. |
| S | Quatro Estações Turbulentas | Composição de clone, dragões e chuva de kunais em sequência; depende da resolução de múltiplas etapas. |
| SS | Modo Tsukuyomi | Aura em área, redução de velocidade de oponentes próximos, imunidade específica, usos e requisitos próprios. |
| SS | Susanoo: Múltiplos Membros | Requer quantidade variável de braços, custo por unidade e efeitos de ataque associados. |
| SSS | Ame no Ohabari: Cortes em Série; Espada de Totsuka: Corte em Ascensão; Espada de Totsuka e Selamento | Dependem de arma equipada, múltiplos golpes/alvos, atordoamento ou remoção/selamento permanente do combatente. |
| SSS | Selo de Transcrição do Kotoamatsukami | Efeito programado para disparar sob condição futura, incluindo comando e regras de genjutsu excepcionais. |
| SSS | Izanami | Exige custo permanente de um olho, reservas/troca de Sharingan e exceções por personagem. |
| SSS | Armadilha do Clone Amaterasu | Clone com estados de preparação/detonação, número variável de clones, alcance e escapes por quantidade. |
| SSS | Armadilhas de Genjutsu Itachi | Gatilhos predefinidos em ações futuras, aplicáveis a alvos distintos e com duração herdada do genjutsu escolhido. |
| SSS | Estilo Chama: Liberar — versão Itachi | Infusão opcional em técnicas/equipamentos, custo por uso e cooldown de dois turnos. |
| SSS | Orbes de Fogo | Requer Susanoo perfeito, múltiplos alvos, escapes diferentes por presença de sensor e possível atordoamento. |
| SSS | Dōjutsu: Deus do Sol | Ataque de área com ATK ilimitado, requisito de reação, escapes especializados e grande número de alvos. |
| SSS | Corvo de Itachi | Invocação persistente, prevenção de surpresa e pré-requisito narrativo/funcional para Kotoamatsukami e Mil Corvos. |

## Limitações a revisar, mesmo nas técnicas incluídas

O protótipo ainda abstrai alcance/distância, linha de visão, sensores específicos, voo, dimensões, aliados e combate em equipe. O Genjutsu, a incapacitação e as técnicas multi-alvo estão, portanto, simplificados; clones das sombras representam alvos adicionais/interceptações sem criar combatentes autônomos. O Espelho de Yata anula ataques frontais, mas o reflexo do golpe contra o atacante ainda não está modelado. O sensor auditivo permanece ativo até o fim da luta; abrir os olhos e o cooldown de reativação ainda são apenas descritos, não automatizados.

O protótipo não tem sistema de compra/desbloqueio de técnicas: estar no catálogo do personagem equivale a estar disponível. Assim, o requisito de “Tsukuyomi liberado” para Sonho Negro é implícito porque Tsukuyomi consta no catálogo de Itachi; não se exige que ele tenha sido usado antes. Clones de água/corvos ainda não possuem contadores próprios no código; quando implementados, não devem consumir o limite de clones das sombras.

## Próxima ordem sugerida

1. Modelar estados de visão/sensoriamento e escapes de genjutsu sem dōjutsu.
2. Implementar variedades separadas de clones (água e corvos), incluindo a dependência de Mil Corvos.
3. Adicionar técnicas compostas em etapas e equipamentos do Susanoo (Totsuka, braços, armadilhas).
4. Só então tratar efeitos permanentes e condicionais (remoção de olhos, Izanami, Kotoamatsukami, selamento), com regras explícitas de restauração e exceções.
