# 🍔 Dev Diary — Food Chain Magnate Online

---

## Entry #2 — Game Engine Foundation (February 17, 2026)

### Phase 0: Design System & Data Foundation

Replaced the Brutalist dark-mode aesthetic with a **Mid-Century American Diner** theme — warm creams, diner red (`#BF4646`), retro teal (`#7EACB5`), chrome accent lines.

- **`styles.css`**: Full design system with brand palette, Fredoka One + Nunito typography (via Google Fonts), chrome-accented cards and modals, branch-colored employee cards, press-down button effect
- **`index.html`**: 7-phase bar reflecting real turn structure, org chart container, beach section, training modal, proper `<meta>` tags
- **`model/EmployeeData.js`**: Career tree DAG with 32 employee types across 11 branches, including promotion paths, action definitions, supply pile sizes, helper functions
- **`model/OrgChart.js`**: Per-player tree structure with CEO at root, beach management, hire/assign/train/fire operations, JSON serialization for future multiplayer sync

### Phase 1: Game Engine Core

Rewrote all MVC components to use the real game architecture:

- **`model/GameState.js`**: 7-phase turn machine, 18 milestones with all effects implemented, payday with salary/discount calculation, sale processing with CFO bonus + waitress income + garden multiplier, bank depletion end-game
- **`view/GameView.js`**: Org chart tree rendering with depth-based indentation and branch colors, phase bar with active/completed states, hiring modal with supply counts, training modal
- **`controller/GameController.js`**: Phase-specific button labels, restructuring interactions (click to assign/unassign), keyboard shortcuts (H=hire, Enter=advance, Esc=close modals)

All integration tests passed via Node.js: phase cycling, milestone auto-triggering, pricing effects, serialization roundtrip.

**Next**: MapState (tile map + BFS pathfinding), DinnertimeResolver, MarketingResolver.

---

### Entrada #2 — Fundação do Game Engine (17 de Fevereiro de 2026)

#### Fase 0: Sistema de Design & Dados Base

Substituí a estética Brutalist dark-mode por um tema de **Lanchonete Americana dos anos 50** — tons quentes, vermelho (#BF4646), teal retrô (#7EACB5), acentos cromados.

- **`styles.css`**: Design system com paleta, tipografia Fredoka One + Nunito (Google Fonts), cards com borda cromada, cards de empregados coloridos por branch, efeito de botão press-down
- **`model/EmployeeData.js`**: DAG de carreira com 32 tipos em 11 branches, incluindo caminhos de promoção, ações, tamanhos de pilha
- **`model/OrgChart.js`**: Árvore por jogador com CEO na raiz, gerenciamento de praia, operações de contratação/atribuição/treino/demissão

#### Fase 1: Core do Game Engine

Reescrevi todos os componentes MVC com arquitetura real do jogo:

- **`GameState.js`**: Máquina de 7 fases, 18 milestones com todos os efeitos, payday com cálculo de salário, processamento de vendas com bônus CFO + waitress + jardim, esgotamento do banco
- **`GameView.js`**: Renderização da árvore org chart, barra de fases, modal de contratação com supply
- **`GameController.js`**: Labels de botão por fase, interações de reestruturação, atalhos de teclado

Todos os testes de integração passaram via Node.js. **Próximo**: MapState, DinnertimeResolver, MarketingResolver.

---

## Entry #1 — Kickoff (February 14–16, 2026)

### Context

Food Chain Magnate is a heavy economic strategy board game (heavy euro) with high combinatorial complexity — branching career trees, demand systems driven by adjacency graphs, and multiple interdependent phases per turn. The goal of this project is to implement a playable digital version in the browser.

---

### Architecture & Scaffold (Day 1)

I went with **vanilla HTML/CSS/JS** with no frameworks, using a classic **MVC** separation:

| Layer | File | Responsibility |
|---|---|---|
| **Model** | `model/GameState.js` | Game state, mutations, validations |
| **View** | `view/GameView.js` | DOM rendering, UI binding |
| **Controller** | `controller/GameController.js` | Model↔view mediation, input handling |
| **Bootstrap** | `app.js` | Layer instantiation and wiring |

**Technical decisions:**
- No build step — direct loading via `<script>` tags for fast iteration
- **Brutalist/Retro** aesthetic (monospace typography, solid borders, reduced palette)
- State exposed via `window.game` for dev debugging — console helper functions (`produceFood()`, `addMoney()`)
- Structure prepared for future migration to ES6 modules + WebSocket multiplayer

**Deliverable:** functional single-player sandbox with player dashboard (balance, inventory, org chart), map grid, and hiring modal.

---

### Formalizing the Rules (Days 2–3)

Produced the `RULES.md` document (~310 lines) as the complete base game specification, serving as the **source of truth** for the engine implementation. Highlights:

- **7 sequential phases per turn** with inter-dependencies (e.g., marketing in phase 6 generates demand tokens consumed in Dinnertime's phase 4 on the following turn)
- **Career tree** with 8 entry-points and branching paths — modeled as a DAG (directed acyclic graph) with ~25 nodes
- **Dinnertime** as the core economic loop: `attractiveness = unitPrice + distance`, resolved via BFS on the road graph
- **Milestone system** (13 permanent bonuses) — first-mover advantage with event-driven detection
- **Bank Reserve** as a two-stage end-game condition (hidden information → reveal → depletion)
- Setup parameterized by player count (2–5 players, grids from 3×3 to 5×4)

---

### Next Steps

1. Implement the **turn phase state machine** (FSM with 7 states + transitions)
2. Model the **career tree as a DAG** with training validation
3. Implement **pathfinding** on the map (BFS/Dijkstra for road distance)
4. Code the **Dinnertime resolver** (matching houses → restaurants by attractiveness)
5. **WebSocket** layer for real-time multiplayer

---

### 💬 Real talk...

Guys, I've always loved this game precisely because it's absurdly complex. On the physical board, everything flows almost naturally: you and your friends point at the pieces, move tokens, adjust values... and suddenly, the game just works.

Then you sit down to code it and discover the reality: there are countless hidden edge cases. Some are even obvious — like, what if two players tie on attractiveness and the number of waitresses? Or if the bank runs out in the middle of a purchase?

But then come the worst ones: those situations you think no one would be stupid enough to try... but you need to foresee because, well, you never know. Like: what if the guy has a CFO that makes the unit price negative? Or worse: what if he runs out of money during this negative sale process?

I spent two days just refining the rules in `RULES.md` before coding anything. It felt like I wasn't "producing," but it was the best decision — now I have a solid document that works as a spec for the entire engine. Lesson learned: **for complex games, game design document first, code second.**

Excited for the implementation phase. We're craving for Pizza! 🍕

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC`

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`

---

## Entry #2 — Rules Deep-Dive & Architecture (February 17, 2026)

### The Rules Rabbit Hole

Today I went **deep** into the rules. What started as "fill in a few gaps" turned into a full-day session of rule archaeology — cross-referencing the base rulebook, extraction web searches, and a line-by-line Q&A to nail down every edge case.

The `RULES.md` went from ~310 lines to **~470 lines**. Key additions:

- **18 base game milestones** (was 13) — discovered I was missing First Errand Boy Played, First to Lower Prices, and First Airplane Campaign
- **17 expansion milestones** (The Ketchup Mechanism) — completely detailed with interactions, edge cases, and restriction rules
- **Marketing placement rules** — billboard (orthogonal adjacency), mailbox (by block), avião (tile), radio (tile + adjacent tiles), with resolution order by piece number
- **Demand tokens** — all-or-nothing consumption, persistence between turns, house limits (3 normal, 5 garden, ∞ prédio)
- **Tile system** — 5×5 grid per tile, road crossings without connection, inter-tile connection by orthogonal adjacency
- **Supply piles** — 222 cards total, 1x restriction for 10 specific high-tier employees
- **CFO** — rounds **down** (not up!), bankruptcy rules, mandatory action

The apartment building from the expansion was a fun surprise: a 3×3 structure with infinite demand slots that generates 2 tokens per campaign. I've decided to start implementing them right away. And the house numbers π and 9¾ (yes, Harry Potter style) that resolve between houses 3-4 and 9-10.

---

### Aesthetic Pivot: Brutalist → Mid-Century Diner

Killed the Brutalist/Retro look in favor of a **Mid-Century American Diner** aesthetic (1940s–1950s):

| Element | Style |
|---|---|
| Colors | `#BF4646` diner red · `#EDDCC6` warm cream · `#FFF4EA` off-white · `#7EACB5` retro teal |
| Typography | Fredoka One (headlines) · Nunito (body) |
| UI | Rounded corners, chrome accents, warm shadows |
| Vibe | Café menus, Route 66 signage, vintage Coca-Cola |

Documented in the new `DESIGN.md`.

---

### Architecture Decision: The "Same JS" Trick

The biggest architectural decision: **same GameState.js runs everywhere**.

```
Phase 0–1: GameState.js runs in the Browser (sandbox)
Phase 3+:  GameState.js runs on the Server (multiplayer)
             ↕ (zero rewrite — same file, same logic)
```

For a turn-based board game, the server architecture is essentially a **CRUD app with WebSocket notifications**:

1. Server holds authoritative state
2. Only the active player can send actions
3. Server validates → updates state → broadcasts to all
4. No client-side prediction needed — no desync possible

The 5-phase roadmap:

| Phase | Deliverable | Risk |
|---|---|---|
| 0 | Design system + data structures | Zero |
| 1 | Full game engine (hot-seat sandbox) | Low-Medium |
| 2 | Node.js + Socket.io + room system | Low |
| 3 | Server authority multiplayer | Medium |
| 4 | Reconnection, spectators, AI | Medium |

---

### 💬 Real talk...

Today's rules session was completely exhausting, I was honestly fed up with it, but I know it was all incredibly valuable. I keep finding layers of complexity I hadn't anticipated — simple game nuances I hadn't noticed until a more rigorous analysis, things like the "First to Have $100" milestone only kicking in on the *next* Dinnertime and forcing you to fire your existing CFO, which I had never realized before.

The architecture decision feels right though. By building the engine as a single-player sandbox first, I can test every rule interaction without any networking complexity. Then wrapping it with Socket.io is just plumbing — the game logic doesn't change at all.

Time to code. 🍔

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC` · `Node.js` · `Socket.io` (planned)

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`

---
---

## Entry #1 — Kickoff (14–16 de Fevereiro, 2026) 🇧🇷

### Contexto

Food Chain Magnate é um board game de estratégia econômica pesada (heavy euro) com alta complexidade combinatória — árvores de carreira ramificadas, sistema de demanda por grafo de adjacência, e múltiplas fases interdependentes por turno. O objetivo deste projeto é implementar uma versão digital jogável no browser.

---

### Arquitetura e Scaffold (Dia 1)

Optei por **vanilla HTML/CSS/JS** sem frameworks, com separação **MVC** clássica:

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| **Model** | `model/GameState.js` | Estado do jogo, mutações, validações |
| **View** | `view/GameView.js` | Renderização do DOM, binding de UI |
| **Controller** | `controller/GameController.js` | Mediação model↔view, input handling |
| **Bootstrap** | `app.js` | Instanciação e wiring das camadas |

**Decisões técnicas:**
- Sem build step — carregamento direto via `<script>` tags para iteração rápida
- Estética **Brutalist/Retro** (tipografia monospace, bordas sólidas, paleta reduzida)
- Exposição do state via `window.game` para debugging em dev — funções helper no console (`produceFood()`, `addMoney()`)
- Estrutura preparada para migração futura para módulos ES6 + WebSocket multiplayer

**Entregável:** sandbox single-player funcional com dashboard de jogador (saldo, inventário, org chart), grid de mapa, e modal de contratação.

---

### Formalização das Regras (Dias 2–3)

Produzi o documento `RULES.md` (~310 linhas) com a especificação completa do jogo base, que serve como **source of truth** para a implementação da engine. Destaques:

- **7 fases sequenciais por turno** com dependências entre si (ex: marketing na fase 6 gera demand tokens consumidos no Dinnertime da fase 4 do turno seguinte)
- **Árvore de carreira** com 8 entry-points e ramificações — modelável como DAG (directed acyclic graph) com ~25 nós
- **Dinnertime** como o core loop econômico: `attractiveness = unitPrice + distance`, resolvido por BFS no grafo de estradas
- **Sistema de milestones** (13 bônus permanentes) — first-mover advantage com detecção por evento
- **Bank Reserve** como condição de fim de jogo em duas fases (hidden information → reveal → depletion)
- Setup parametrizado por player count (2–5 jogadores, grids de 3×3 a 5×4)

---

### Próximos Passos

1. Implementar o **turn phase state machine** (FSM com 7 estados + transições)
2. Modelar a **árvore de carreira como DAG** com validação de treinamento
3. Implementar **pathfinding** no mapa (BFS/Dijkstra para distância por estrada)
4. Codificar o **Dinnertime resolver** (matching casas → restaurantes por attractiveness)
5. Camada de **WebSocket** para multiplayer real-time

---

### 💬 Na real...

Rapaziada, eu sempre amei esse jogo justamente porque ele é absurdamente complexo. No tabuleiro físico, tudo flui de um jeito quase natural: você e seus amigos apontam pras pecinhas, movem tokens, ajustam valores… e, de repente, o jogo simplesmente funciona.

Aí você senta pra codificar e descobre a realidade: existem trocentas edge cases escondidas ali. Algumas são até óbvias — tipo, e se dois jogadores empatam no attractiveness e no número de garçonetes? Ou se o banco zera no meio de uma compra?

Mas aí vêm as piores: aquelas situações que você acha que ninguém seria idiota o suficiente pra tentar… mas que você precisa prever porque, né, vai saber. Tipo: e se o cara tem um CFO que deixa o preço de venda negativo? Ou pior: e se ele fica sem dinheiro durante esse processo de venda negativa?

Passei dois dias só refinando as regras no `RULES.md` antes de codar qualquer coisa. Parecia que não tava "produzindo", mas foi a melhor decisão — agora tenho um documento sólido que funciona como spec pra toda a engine. Lesson learned: **pra jogos complexos, game design document primeiro, código depois.**

Animado pra fase de implementação. We're craving for Pizza! 🍕

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC`

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`

---

## Entry #2 — Deep-Dive nas Regras & Arquitetura (17 de Fevereiro, 2026) 🇧🇷

### A Toca do Coelho das Regras

Hoje eu mergulhei **fundo** nas regras. O que começou como "preencher umas lacunas" virou uma sessão de um dia inteiro de arqueologia de regras — cruzando o rulebook base, buscas na web, e um Q&A linha por linha pra cravar cada edge case.

O `RULES.md` foi de ~310 linhas pra **~470 linhas**. Principais adições:

- **18 milestones do jogo base** (eram 13) — descobri que faltavam First Errand Boy Played, First to Lower Prices e First Airplane Campaign
- **17 milestones da expansão** (The Ketchup Mechanism) — detalhados com interações, edge cases e restrições
- **Regras de colocação de marketing** — billboard (adjacência ortogonal), mailbox (por block), avião (tile), radio (tile + adjacentes), com ordem de resolução por número da peça
- **Demand tokens** — consumo all-or-nothing, persistência entre turnos, limites por casa (3 normal, 5 garden, ∞ prédio)
- **Sistema de tiles** — grid 5×5 por tile, cruzamentos sem conexão, conexão inter-tile por adjacência ortogonal
- **Supply piles** — 222 cartas total, restrição 1x para 10 empregados high-tier específicos
- **CFO** — arredonda **pra baixo** (não pra cima!), regras de falência, ação obrigatória

decidi que já vou começar implementando os prédio da expansão: estrutura 3×3 com slots de demanda infinitos que gera 2 tokens por campanha. E os números de casa π e 9¾ (sim, estilo Harry Potter) que resolvem entre as casas 3-4 e 9-10.

---

### Pivô Estético: Brutalista → Diner Americano

Matei o visual Brutalist/Retro e troquei por uma estética **Mid-Century American Diner** (anos 1940–50), quero passar a vibe do jogo original:

| Elemento | Estilo |
|---|---|
| Cores | `#BF4646` diner red · `#EDDCC6` cream · `#FFF4EA` off-white · `#7EACB5` retro teal |
| Tipografia | Fredoka One (títulos) · Nunito (corpo) |
| UI | Cantos arredondados, acentos chrome, sombras quentes |
| Vibe | Menus de café, sinalização Route 66, Coca-Cola vintage |

Documentado no novo `DESIGN.md`.

---

### Decisão de Arquitetura: O Truque do "Mesmo JS"

A maior decisão arquitetural: **o mesmo GameState.js roda em todo lugar**.

```
Fases 0–1: GameState.js roda no Navegador (sandbox)
Fases 3+:  GameState.js roda no Servidor (multiplayer)
             ↕ (zero reescrita — mesmo arquivo, mesma lógica)
```

Para um board game por turnos, a arquitetura do servidor é essencialmente um **CRUD com notificações WebSocket**:

1. Servidor mantém estado autoritativo
2. Só o jogador ativo pode enviar ações
3. Servidor valida → atualiza estado → broadcast pra todos
4. Sem client-side prediction — impossível dessincronia

O roadmap em 5 fases:

| Fase | Entregável | Risco |
|---|---|---|
| 0 | Design system + estruturas de dados | Zero |
| 1 | Game engine completa (sandbox hot-seat) | Baixo-Médio |
| 2 | Node.js + Socket.io + sistema de salas | Baixo |
| 3 | Server authority multiplayer | Médio |
| 4 | Reconexão, espectadores, IA | Médio |

---

### 💬 Na real...

A sessão de regras de hoje foi completamente exaustiva, eu já tava de saco completamente cheio, mas sei que tudo foi incrivelmente valioso. Continuo encontrando camadas de complexidade que eu não tinha antecipado, nuances do jogos que eu não tinha percebido só depois de uma analise mais rigosa, coisas simples como o milestone "First to Have $100" só entra no *próximo* Dinnertime e te obriga a demitir seu CFO existente, mas que eu nunca tinha percebido antes.

A decisão de arquitetura parece certa. Construindo a engine como sandbox single-player primeiro, posso testar cada interação de regra sem nenhuma complexidade de rede. Depois envolver com Socket.io é só encanamento — a lógica do jogo não muda nada.

Hora de codar. 🍔

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC` · `Node.js` · `Socket.io` (planejado)


---

## Entry #3 — Roadmap & Prioritization (February 18, 2026)

### Status Check
After auditing the current codebase and rules documentation, I’ve established a prioritized roadmap. The goal is to tackle **"Quick Wins"** (visual feedback) first to maintain momentum, followed by the complex game logic required for a playable MVP.

### The Roadmap

1. **Drink Visuals**
   - **Complexity:** 🟢 Low | **Impact:** Medium
   - Separate the generic "Drinks" counter into individual 🍺 Beer, 🥤 Coke, and 🍋 Lemonade icons.
2. **UI Polish**
   - **Complexity:** 🟢 Low | **Impact:** Low
   - Milestone badges and better notification animations.
3. **Manual Turn Choice**
   - **Complexity:** 🟡 Medium | **Impact:** Medium
   - Interactivity for the *Order of Business* phase.
4. **Bank Reserve**
   - **Complexity:** 🟡 Medium | **Impact:** High
   - Ending game triggers and setup choices.
5. **Expansion Support**
   - **Complexity:** 🟡 Medium | **Impact:** Medium
   - Adding *The Ketchup Mechanism* cards and effects.
6. **Visual OrgChart**
   - **Complexity:** 🟠 High | **Impact:** Medium-High
   - Moving from an indented list to a full SVG/Canvas tree with curved connection lines.
7. **Marketing, Map & Dinnertime**
   - **Complexity:** 🔴 High | **Impact:** Critical
   - Implementing `MarketingResolver.js`, BFS pathfinding, and the core `DinnertimeResolver.js`.

**Next**: Implementing specific icons for the inventory so players can tell their beer from their lemonade. 

### 💬 Real talk...

Since today was Sunday (and we're in the peak of Carnival!), I was busy recovering from a massive Brazilian feijoada, so I pretty much just took a small peek at the roadmap and that's it. But focusing on the roadmap today was a necessary "ego check." With my background in UX design, I know that getting the visual feedback right early on is crucial for the developer experience too. It's tempting to jump straight into the BFS pathfinding...

Splitting the generic drinks into Coke, Beer, and Lemonade sounds simple, but it's the first step in making the player dashboard feel like a real game and not just a spreadsheet. Better to have a pretty, functional UI while I'm smashing my head against the pathfinding logic later this week.

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC` · `Node.js` · `Socket.io` (planned)

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`

---

## Entrada #3 — Roadmap & Priorização (18 de Fevereiro de 2026) 🇧🇷

### Ponto de Situação
Após auditar o código atual e a especificação de regras, estabeleci um roadmap priorizado. O objetivo é focar em **"Quick Wins"** (feedback visual) primeiro para manter o ritmo, seguidos pela lógica complexa necessária para um MVP jogável.

### O Roadmap

1. **Visual de Bebidas**
   - **Complexidade:** 🟢 Baixa | **Impacto:** Médio
   - Separar o contador genérico de "Drinks" em ícones individuais de 🍺 Cerveja, 🥤 Coca e 🍋 Limonada.
2. **Polimento de UI**
   - **Complexidade:** 🟢 Baixa | **Impacto:** Baixo
   - Badges de milestone e melhores animações de notificação.
3. **Escolha Manual de Turno**
   - **Complexidade:** 🟡 Média | **Impacto:** Médio
   - Interatividade para a fase *Order of Business*.
4. **Reserva do Banco**
   - **Complexidade:** 🟡 Média | **Impacto:** Alta
   - Gatilhos de fim de jogo e escolhas iniciais.
5. **Suporte à Expansão**
   - **Complexidade:** 🟡 Média | **Impacto:** Médio
   - Adicionando cartas e efeitos de *The Ketchup Mechanism*.
6. **Organograma Visual**
   - **Complexidade:** 🟠 Alta | **Impacto:** Médio-Alto
   - Migrar da lista indentada para uma árvore SVG/Canvas completa com conexões curvas.
7. **Marketing, Mapa e Jantar**
   - **Complexidade:** 🔴 Alta | **Impacto:** Crítico
   - Implementar o `MarketingResolver.js`, pathfinding BFS e o núcleo do `DinnertimeResolver.js`.

**Próximo Passo**: Implementar os ícones específicos no inventário para que os jogadores possam diferenciar sua cerveja da sua limonada.

### 💬 Na real...

Como hoje foi domingo (e estamos em pleno Carnaval!), eu fui comer uma feijoada brasileira e simplesmente só dei uma pequena olhada no roadmap e é isso. Mas focar no roadmap hoje foi um "banho de realidade" necessário. Com meu background em UX design, eu sei que acertar no feedback visual logo no começo é crucial também para a "experiência do desenvolvedor". É tentador pular direto pro pathfinding BFS do mapa ou pra lógica de resolução do Jantar, mas é lá que moram os bugs mais cabulosos. Priorizando essas tarefas visuais e de UI menores primeiro, estou construindo um ambiente de debug muito melhor pra mim mesmo.

Separar as bebidas genéricas em Coca, Cerveja e Limonada parece simples, mas é o primeiro passo pra fazer o dashboard do jogador parecer um jogo de verdade e não só uma planilha. Melhor ter uma UI bonita e funcional enquanto eu estiver quebrando a cabeça com a lógica de navegação no final da semana.

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC` · `Node.js` · `Socket.io` (planejado)

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`
