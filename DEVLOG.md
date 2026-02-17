# 🍔 Dev Diary — Food Chain Magnate Online

---

## Entry #1 — Kickoff (14–16 de Fevereiro, 2026)

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

Cara, esse jogo é absurdamente complexo. Quando você joga no tabuleiro físico, tudo flui naturalmente — você move as pecinhas, coloca os tokens, e o jogo "funciona". Mas quando você senta pra codificar, percebe que tem **trocentas edge cases** escondidas. Tipo: e se dois jogadores empatam no attractiveness? E se o banco zera no meio de uma compra? E se o cara tem CFO com preço negativo e vai à falência no Dinnertime?

Passei dois dias só refinando as regras no `RULES.md` antes de codar qualquer coisa. Parecia que não tava "produzindo", mas foi a melhor decisão — agora tenho um documento sólido que funciona como spec pra toda a engine. Lesson learned: **pra jogos complexos, game design document primeiro, código depois.**

Animado pra fase de implementação. 🍕

---

**Stack:** `HTML` · `CSS` · `JavaScript` · `MVC`

`#gamedev` `#boardgames` `#javascript` `#indiedev` `#foodchainmagnate` `#devdiary`
