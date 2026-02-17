# 🍔 Food Chain Magnate — Regras Completas (Base Game)

## Objetivo do Jogo

Acumular o **máximo de dinheiro** até o fim do jogo. O jogo termina quando o **banco fica sem dinheiro pela segunda vez** durante a fase de Dinnertime. O jogador mais rico vence.

---

## Setup Inicial

- **Mapa**: Tiles modulares selecionados aleatoriamente e rotacionados. Configuração por número de jogadores:

| Jogadores | Grid | Tiles usados |
|---|---|---|
| 2 | 3×3 | 9 |
| 3 | 3×4 | 12 |
| 4 | 4×4 | 16 |
| 5 | 5×4 | 20 (todos) |
- **Banco**: $50 por jogador
- **Cada jogador recebe**: 1 CEO, 3 restaurantes, 3 Bank Reserve Cards. **Dinheiro inicial: $0**
- **Ordem de turno**: Marcadores embaralhados aleatoriamente
- **Colocação de restaurante**: Em ordem reversa de turno, cada jogador coloca 1 restaurante em espaço vazio com entrada voltada para uma estrada
- **Casas iniciais**: Apenas casas com números **pares** são colocadas no mapa durante o setup
- **Bank Reserve**: Cada jogador escolhe secretamente 1 de suas 3 Bank Reserve Cards e coloca face-down perto do banco. As outras 2 são descartadas sem revelar.
  - Cada card tem **dois valores**: um valor em dinheiro ($) e um número de **slots do CEO** (2, 3 ou 4)
  - Quando o banco esvaziar pela primeira vez: todas as cards são reveladas, a soma dos valores é adicionada ao banco, e o **número de slots mais frequente** entre as cards reveladas passa a ser o novo número de subordinados diretos do CEO de **todos os jogadores** (em empate, o número maior vence)
  - **Modo iniciante**: Omitir Bank Reserve Cards e usar $75 por jogador no banco

---

## Fases do Turno

Cada turno segue **7 fases** nesta ordem:

### 1. Restructuring (Reestruturação)

Cada jogador monta seu **organograma** (org chart):

- O **CEO** está sempre "at work" e gerencia até **3 subordinados diretos**
- **Managers** (cartas com fundo preto) podem supervisionar empregados normais:
  - Management Trainee: 2 subordinados
  - Junior VP: 3
  - Vice President: 4
  - Senior VP: 5
  - Executive VP: 10
- Managers só ficam **diretamente sob o CEO** (não podem ser subordinados de outros managers)
- Empregados fora do organograma ficam **"na praia"** (at the beach) — inativos mas podem ser treinados
- No primeiro turno, apenas o CEO trabalha

### 2. Order of Business (Ordem de Turno)

Determina a ordem de ações para este turno:

- O jogador com **mais slots abertos** no organograma escolhe sua posição primeiro
- Em caso de empate: quem era anterior na ordem do turno anterior escolhe primeiro

### 3. Working 9-5 (Ações dos Empregados)

Fase principal — cada jogador executa as ações de seus empregados "at work", **em ordem de turno**. Um jogador completa TODAS as suas ações antes do próximo.

#### Ações obrigatórias vs opcionais:
- **Obrigatórias**: Pricing Manager, Discount Manager, Luxury Manager, CFO, Recruiting Manager, HR Director, Waitress
- **Opcionais**: Todas as demais

#### Ordem de resolução das ações:
1. Recrutar
2. Treinar
3. Marketing
4. Coletar bebida e Produzir comida
5. Colocar casas ou jardins
6. Colocar ou mover restaurantes

#### Tipos de ação:

**Recrutamento:**

O efeito base de recrutamento é: **contratar 1 empregado entry-level** OU **pagar $5 a menos no total de salários** (escolhe na hora do uso).

- O desconto de -$5 **acumula** e vale apenas para o **Payday do mesmo turno**
- Ex: 4 Recruiting Managers usando só desconto = -$40 no Payday. Se quiser manter o desconto, precisa jogar a RM de novo no próximo turno

| Empregado | Ação |
|---|---|
| CEO | 1 contratação gratuita por turno (sempre — apenas contratação, sem opção de -$5) |
| Recruiting Girl | Usa o efeito **1 vez** |
| Recruiting Manager | Usa o efeito **2 vezes** (obrigatório) |
| HR Director | Usa o efeito **4 vezes** (obrigatório) |

**Treinamento** (apenas empregados **"na praia"** podem ser treinados — nunca os que estão "at work"):
| Empregado | Ação |
|---|---|
| Trainer | Treina 1 empregado (na praia) 1 nível acima |
| Coach | Treina 1 empregado até 2 níveis, ignora pilha vazia |
| Guru | Treina 1 empregado até 3 níveis, ignora pilha vazia |

**Produção de comida:**
| Empregado | Produz |
|---|---|
| Kitchen Trainee | 1 burger **ou** 1 pizza |
| Burger Cook | 3 burgers |
| Pizza Cook | 3 pizzas |
| Burger Chef | 7 burgers |
| Pizza Chef | 7 pizzas |

**Bebidas** (3 tipos: 🍺 Cerveja, 🥤 Coke, 🍋 Limonada):

Fontes de bebida são **tiles específicos no mapa**. Cada fonte tem **supply infinito**, mas cada jogador só pode coletar **1 vez** de cada fonte por turno. O empregado viaja por estrada a partir de um dos seus restaurantes (tile do restaurante = distância 0; cada tile cruzado = +1 distância). **Nunca** pode voltar por estrada já cruzada nem coletar de fonte já visitada. Empregados voadores coletam tudo disponível no tile e partem para o próximo até o limite.

| Empregado | Qtd/fonte | Alcance | Tipo |
|---|---|---|---|
| Errand Boy | 1 (qualquer tipo) | — | Não precisa de fonte no mapa |
| Cart Operator | 2 por fonte | 2 | Estrada |
| Truck Driver | 3 por fonte | 3 | Estrada |
| Zeppelin Pilot | 2 por fonte | 4 | Voa (pega o tile inteiro) |

**Marketing** (alcance sempre contado a partir de qualquer **restaurante ativo**; número limitado de meios de comunicação disponíveis):

Cada campanha anuncia **1 item**. O jogador escolhe a duração de **1 até o máximo** de turnos do empregado. O marketeiro viaja por estrada a partir da **entrada** de um de seus restaurantes para colocar a campanha.

| Empregado | Campanhas disponíveis | Duração máx. | Alcance | Movimento |
|---|---|---|---|---|
| Marketing Trainee | Billboard | 2 turnos | 2 tiles | Estrada |
| Campaign Manager | Billboard ou Mailbox | 3 turnos | 3 tiles | Estrada |
| Brand Manager | Qualquer anterior ou Avião | 4 turnos | ∞ | Avião |
| Brand Director | Todos os anteriores e Radio | 5 turnos | ∞ | Avião |

**Componentes de marketing disponíveis**: 6 billboards, 4 mailboxes, 3 aviões, 3 rádios (todos compartilhados).

**Regras de colocação por tipo:**

- **Billboard**: Colocado em espaço vazio; uma borda do billboard deve tocar a estrada usada pelo marketeiro. Gera demanda em casas **ortogonalmente adjacentes** (não diagonal). Casas são afetadas mesmo se apenas o garden é adjacente ao billboard.
- **Mailbox**: Colocado em qualquer lugar dentro de um **"block"** (área delimitada por estradas ou borda do tabuleiro) que a estrada do marketeiro toca. Atinge **todas as casas** dentro desse block sem cruzar estradas.
- **Avião**: Pode ser colocado em qualquer espaço vazio do tabuleiro que toque uma estrada. Atinge casas no tile onde está colocado.
- **Radio**: Colocado em qualquer espaço vazio que toque uma estrada. Atinge **todas as casas** no tile onde está colocado **e em todos os tiles adjacentes**.

**Preços:**
| Empregado | Efeito |
|---|---|
| Pricing Manager | Reduz o preço unitário em **$1** (entry-level, obrigatório) |
| Discount Manager | Reduz o preço unitário em **$3** (obrigatório) |
| Luxury Manager | Aumenta o preço unitário em **$10** (obrigatório) |

**Outros:**
| Empregado | Ação |
|---|---|
| New Business Dev. (roxa) | Coloca **1 casa** (número ímpar, escolhido pelo jogador) **ou 1 jardim** em espaço vazio adjacente a estrada |
| Waitress | Gera **$3** por ativação durante o **Dinnertime** (conta para CFO) + desempata vendas (obrigatório) |
| CFO | Bônus de **50%** em toda renda do Dinnertime, arredondado **pra baixo** (obrigatório — ver regras de falência abaixo) |
| Local Manager | Coloca novo restaurante dentro de **3 tiles** (por estrada) de um restaurante existente, como **"Coming Soon"** (inaugura na Cleanup). Enquanto ativo: drive-in |
| Regional Manager | Coloca **ou** move restaurante para qualquer espaço vazio — já entra **inaugurado**. Pode rotacionar restaurante existente. Enquanto ativo: drive-in |

> **Restaurante**: Ocupa **2×2 unidades** no mapa. A entrada é uma **quina** (formando um quadrado 1×1 com 2 arestas). O jogador pode rotacionar o restaurante livremente ao colocar, mas a entrada deve estar voltada para estrada.

> **Drive-in**: Enquanto um Local Manager ou Regional Manager estiver **ativo** (at work), **cada quina** de todos os restaurantes do jogador funciona como entrada. Isso significa que clientes podem acessar o restaurante de qualquer direção, reduzindo significativamente a distância efetiva. O efeito desaparece se o manager for para a praia.

**Regras do CFO e Falência:**
- O CFO aplica +50% sobre **toda** a renda do Dinnertime (incluindo bônus de Waitress)
- Se o jogador tem o **milestone $100** (CEO vira CFO), ele **não** pode ter um CFO separado
- Se o jogador tem preço **negativo** (ex: preço -$1, vendeu 3 itens = deve $3 ao banco), o CFO **aumenta** a dívida em 50% (arredondado pra cima)
- Se o jogador não tiver dinheiro suficiente para pagar a dívida: **falência** — jogador é eliminado
- Peças do jogador falido permanecem no jogo: marketing expira normalmente (ou fica se for eterno), restaurantes continuam no mapa

### 4. Dinnertime (Jantar)

As casas "saem para jantar" em **ordem numérica** (número da casa no mapa).

**Regras de demanda:**
- Uma casa só sai para comer se tiver **demand tokens** (colocados por marketing)
- Demand tokens podem ser iguais ou sortidos (ex: 2 burgers + 1 coke)
- Casas sem garden: máximo **3 demand tokens**
- Casas com garden: máximo **5 demand tokens**
- Sem demand tokens = moradores ficam em casa

**Escolha do restaurante ("all-or-nothing"):**
1. Deve haver **conexão por estrada** entre a casa e a entrada do restaurante
2. O restaurante deve poder fornecer **TODOS** os itens demandados — **sem pedidos parciais**. Se ninguém pode atender tudo, a casa **não compra de ninguém**
3. Uma casa só vai a **1 restaurante** (nunca divide pedido)
4. Se múltiplos restaurantes atendem: escolhe o de **menor "attractiveness"**:

```
Attractiveness = Unit Price + Distance
```

- **Preço unitário padrão**: $10 (modificável por Pricing/Discount/Luxury Manager)
- **Distância**: Conta-se o número de **tiles cruzados** pela estrada entre a casa e o restaurante

**Desempate:**
1. Mais waitresses **ativas no org chart** neste turno (total de waitresses "at work")
2. Quem está antes na ordem de turno

**Pagamento e consumo:**
- Se a casa **comprou**: paga o preço, demand tokens consumidos **são removidos**
- Se a casa **não comprou** (ninguém atende tudo): demand tokens **permanecem** para o próximo turno
- Casas normais: pagam o **preço unitário** por item
- Casas com garden: pagam o **dobro** do preço unitário por item
- O dobro NÃO afeta o cálculo de attractiveness, apenas o pagamento

**Fim do jogo / Bank Reserve:**
- **Primeira vez** que o banco fica sem dinheiro durante o Dinnertime: completa-se a fase, depois todos os jogadores revelam suas Bank Reserve Cards e a **soma dos valores** é adicionada ao banco
- **Segunda vez** que o banco fica sem dinheiro durante o Dinnertime: completa-se a fase e o **jogo termina** — jogador mais rico vence

### 5. Payday (Pagamento)

- **CEO**: Sem salário
- **Empregados entry-level** (não treinados): Sem salário
- **Empregados treinados**: $5 de salário cada (cards com símbolo de dinheiro)
- Salários são pagos ao banco
- O jogador pode escolher **demitir ou manter** cada empregado durante o Payday. Se manter, **deve** pagar o salário
- Se não puder pagar: **deve** demitir empregados até poder pagar os restantes
- Empregados demitidos são devolvidos à pilha de supply (ficam disponíveis para outros jogadores contratarem)

### 6. Marketing Campaigns (Campanhas)

- Campanhas ativas são resolvidas — cada campanha coloca **1 demand token** do item anunciado em **cada casa** dentro do seu alcance
- Demand tokens são do tipo específico (burger, pizza, beer, coke, lemonade)
- Demand tokens **persistem** entre turnos — tokens não consumidos no Dinnertime ficam na casa
- Uma casa **nunca ultrapassa** seu limite de tokens (3 sem garden, 5 com garden)
- Campanhas com duração limitada perdem 1 turno de duração
- Campanhas expiradas são removidas; o tile de marketing volta para o supply

**Ordem de resolução das campanhas** — cada peça de marketing tem um **número específico**. Campanhas com número menor resolvem primeiro:
1. **Rádios** (1×1, **não** precisa estar adjacente a estrada)
2. **Aviões** — por tamanho decrescente: avião de 1 linha/coluna (mais rápido) → 3 linhas → 5 linhas (mais lento)
3. **Mailboxes** — por tamanho decrescente: 2×2 (mais rápido) → ... → 1×1 (mais lento)
4. **Billboards** — lógica oposta: quanto **menor**, mais rápido resolve. Tamanhos específicos a detalhar

### 7. Cleanup (Limpeza)

- Restaurantes "Coming Soon!" viram "Welcome" (disponíveis para uso)
  - Enquanto **"Coming Soon"**: o restaurante **não funciona** — não pode servir comida, não conta como restaurante para distância ou coleta
- Comida e bebida não vendida são **descartadas** (devolvidas ao supply)
  - **Exceção — Freezer**: Se o jogador tem o milestone de Freezer, pode manter até **10 itens** (comida + bebida combinados) de um turno para o outro. O jogador escolhe quais itens manter e descarta o resto
- Preparação para o próximo turno

---

## Milestones (Jogo Base)

Bônus permanentes para o **primeiro jogador** a atingir cada marco. Se dois jogadores atingirem no mesmo turno, ambos recebem.

> **Milestones são verificados imediatamente** quando a condição é atingida (mesmo no meio de uma fase) e podem ser **usados imediatamente** no mesmo turno.

| Milestone | Requisito | Bônus |
|---|---|---|
| **First to Train** | Treinar um empregado no seu turno | Paga **$15 a menos** em salários no Payday (permanente) |
| **First to Hire 3 in 1 Turn** | Contratar 3+ empregados no turno | Recebe **2 Management Trainees** grátis imediatamente. Se não houver no supply, pega o que puder. Não pode combinar com treino pra pular MTs indisponíveis |
| **First to Pay $20+ in Salaries** | Pagar $20+ em salários no Payday (após descontos) | Pode usar **múltiplos Trainers/Coaches/Gurus** na mesma pessoa no mesmo turno (ex: 2 Trainers + 1 Coach = 4 níveis) |
| **First Waitress Played** | Jogar Waitress no Restructuring | **+$2** por cada Waitress ativa no org chart, ao fim de cada Dinnertime. Inclui a Waitress usada pro milestone |
| **First to Have $20** | Ter $20+ em cash ao fim do Dinnertime | Pode ver **todas** as bank reserve cards face-down. Pode olhar de novo a qualquer momento. Pode fazer barulhos confusos/verdadeiros sobre o que viu, mas não pode mostrar |
| **First to Have $100** | Ter $100+ em cash ao fim do Dinnertime | A partir do **próximo** Dinnertime: CEO dá bônus de CFO (50%, arredondado **pra baixo**). Se já tem CFO, **deve** demiti-lo. Não pode treinar outro CFO pelo resto do jogo |
| **First Errand Boy Played** | Jogar Errand Boy no Restructuring | Errand Boys coletam **2 drinks** (mesmo tipo). Demais coletores ganham **+1 drink** por fonte (Cart Op/Zeppelin = 3, Truck = 4) |
| **First Cart Operator Played** | Jogar Cart Operator no Restructuring | Cart Operators, Truck Drivers e Zeppelin Pilots ganham **+1 Range**. Errand Boys **não** são afetados |
| **First Burger Produced** | Produzir pelo menos 1 burger | Recebe **1 Burger Cook** imediatamente (deve pagar salário ou demitir no Payday). Não pode treinar este turno. Sem Burger Cook no supply = sem benefício |
| **First Pizza Produced** | Produzir pelo menos 1 pizza | Recebe **1 Pizza Cook** imediatamente (mesmas regras do Burger) |
| **First to Throw Away Food/Drink** | Descartar pelo menos 1 item não vendido na Cleanup | Recebe **Freezer** — armazena até **10 itens** não vendidos entre turnos (em vez de descartar). Itens no freezer continuam no estoque e podem ser vendidos. Se >10 itens: escolhe 10 e descarta o resto |
| **First to Lower Prices** | Baixar o preço unitário durante Dinnertime | Preço unitário fica **-$1 permanente**. Aplica-se já no Dinnertime atual e em todos os turnos seguintes, mesmo sem jogar pricing employees |
| **First Burger Marketed** | Lançar campanha de burger | **+$5** por cada burger vendido (permanente, não afeta preço, só cash recebido) |
| **First Pizza Marketed** | Lançar campanha de pizza | **+$5** por cada pizza vendida |
| **First Drink Marketed** | Lançar campanha de qualquer drink | **+$5** por cada drink vendido (aplica a **todos** os drinks vendidos, não só o tipo marke-teado) |
| **First Billboard Campaign** | Lançar campanha de billboard | Não paga salários de **Campaign Managers, Brand Managers e Brand Director** (tanto no org chart quanto em campanha). Todas as campanhas lançadas viram **eternas**. Inclui o billboard usado pro milestone |
| **First Airplane Campaign** | Lançar campanha de avião | Em cada Order of Business: conta **+2 Work slots abertos** no total (apenas para determinar ordem de turno — não pode jogar empregados nesses slots) |
| **First Radio Campaign** | Lançar campanha de rádio | Cada rádio do jogador coloca **2 demand tokens** por casa em vez de 1. Inclui o rádio usado pro milestone. Se não cabe 2 tokens, coloca o máximo possível. Só remove 1 duração por rodada |

---

## Árvore de Treinamento (Career Paths)

Cada linha de carreira tem uma **cor** associada. Empregados entry-level são os únicos recrutáveis diretamente — todos os outros devem ser treinados.

**Management Trainee** 🟫 (preta):
```
Management Trainee ──→ New Business Developer (roxa)
                  ──→ Luxury Manager (rosa)
                  ──→ Junior VP (preta) ──→ Local Manager (vermelha)
                                       ──→ Vice President (preta) ──→ Regional Manager (vermelha)
                                                                  ──→ Senior VP (preta) ──→ CFO (roxa)
                                                                                        ──→ Executive VP (preta)
                                                                                        ──→ HR Director (cinza)
                                                                  ──→ Guru (cinza)
                                       ──→ Discount Manager (rosa)
                                       ──→ Recruiting Manager (cinza)
                                       ──→ Coach (cinza)
```

**Recruiting Girl** (cinza) — não pode ser treinada:
```
Recruiting Girl (standalone)
```

**Trainer** (cinza) — não pode ser treinado:
```
Trainer (standalone)
```

**Marketing Trainee** (azul):
```
Marketing Trainee ──→ Campaign Manager ──→ Brand Manager ──→ Brand Director
```

**Errand Boy** (verde claro):
```
Errand Boy ──→ Cart Operator ──→ Truck Driver ──→ Zeppelin Pilot
```

**Kitchen Trainee** (verde):
```
Kitchen Trainee ──→ Burger Cook ──→ Burger Chef
               ──→ Pizza Cook ──→ Pizza Chef
```

**Waitress** (roxa) — não pode ser treinada:
```
Waitress (standalone)
```

**Pricing Manager** (rosa) — entry-level, não pode ser treinado:
```
Pricing Manager (standalone)
```

---

## Mapa e Tiles

### Estrutura do Tile

Cada tile é uma **grid de 5×5 unidades**. Cada unidade pode conter:

- **Espaço vazio** (0) — pode receber restaurantes, marketing, gardens, casas (via New Business Dev)
- **Estrada** (1) — ocupa 1 unidade, conecta tiles e permite trânsito
- **Casa** — ocupa **2×2 unidades**, tem número (ordem no Dinnertime)
- **Fonte de bebida** — ocupa **1 unidade**, adjacente a pelo menos 1 estrada (🍺 cerveja, 🥤 coke, 🍋 limonada)

Exemplo de tile (visualização em grid):
```
[0, 0, 1, 0, 0]
[2, 2, ×, 2, 2]     ← "×" = cruzamento (estrada 1 e 2 se sobrepõem sem conectar)
[0, 0, 1, 0, 0]
[0, 0, 1, 0, 0]
[0, 0, 1, 0, 0]
```

### Cruzamentos de Estradas

- Duas estradas podem **se sobrepor** no mesmo espaço sem estarem conectadas (como um viaduto)
- Cruzamentos só ocorrem nas **regiões centrais** do tile — nunca nas bordas
- No jogo base, estradas que se cruzam **não se conectam**
- Na expansão, existem formas de construir estradas que permitem conectar cruzamentos — a implementação deve prever essa extensão futura

### Conexão entre Tiles

- **20 tiles modulares** no total (grid máximo 5×4 para 5 jogadores)
- Quando dois tiles ficam lado a lado: se dois espaços de estrada são **ortogonalmente adjacentes** na borda entre os tiles, eles estão **conectados**
- Apenas adjacência **ortogonal** gera conexão (nunca diagonal)
- Tiles são **rotacionados aleatoriamente** durante o setup (0°, 90°, 180°, 270°) — não é escolha dos jogadores

### Elementos do Mapa

- **Casas**: Ocupam **2×2 unidades**. Têm número (ordem de jantar). Casas pares são colocadas no setup; casas ímpares são colocadas pelo New Business Developer
- **Gardens**: Ocupam **2×1 unidades**. Devem ser colocados com o lado de 2 unidades **encostado na casa** (todos os espaços do garden adjacentes à casa). Aumentam capacidade de demanda para 5 e dobram pagamento
- **Restaurantes**: Ocupam **2×2 unidades**. Entrada = 1 quina (quadrado 1×1 com 2 arestas), deve estar voltada para estrada. Jogador pode rotacionar livremente ao colocar
- **Fontes de bebida**: Ocupam **1 unidade**, adjacentes a pelo menos 1 estrada
- **Blocks**: Áreas delimitadas por estradas ou borda do tabuleiro — usados para determinar alcance de mailbox
- **Prédio (Expansão)**: Ocupa **3×3 unidades**. Já vem **pré-colocado** nos tiles (apenas **2 tiles** contêm prédios — nunca colocados por jogadores). Funciona como casa, mas com slots de demanda **infinitos** e cada campanha gera **2 demand tokens** em vez de 1. Números especiais: **π** (resolve entre 3 e 4) e **9¾** (resolve entre 9 e 10)

> **Nota sobre layouts**: Os layouts específicos dos 20 tiles (posições de estradas, casas e fontes) serão detalhados separadamente.

---

## Resumo do Fluxo de Jogo

```
┌─────────────────────────────────────────────┐
│  1. RESTRUCTURING                           │
│     Monte seu organograma (CEO → employees) │
├─────────────────────────────────────────────┤
│  2. ORDER OF BUSINESS                       │
│     Determine a ordem de turno              │
├─────────────────────────────────────────────┤
│  3. WORKING 9-5                             │
│     Execute ações dos empregados            │
│     (recrutar, treinar, produzir, marketing)│
├─────────────────────────────────────────────┤
│  4. DINNERTIME                              │
│     Casas compram comida dos restaurantes   │
│     (distância + preço = attractiveness)    │
├─────────────────────────────────────────────┤
│  5. PAYDAY                                  │
│     Pague salários ($5 por empregado treinado)│
├─────────────────────────────────────────────┤
│  6. MARKETING CAMPAIGNS                     │
│     Resolva campanhas, adicione demand      │
├─────────────────────────────────────────────┤
│  7. CLEANUP                                 │
│     Descarte comida, prepare próximo turno  │
└─────────────────────────────────────────────┘
```

---

## Supply Piles (Empregados)

Total de **222 employee cards** (32 tipos). Quantidades conhecidas por tipo:

| Empregado | Pilha | Tipo |
|---|---|---|
| Management Trainee | 18 | Entry-level |
| Kitchen Trainee | 12 | Entry-level |
| Recruiting Girl | 12 | Entry-level |
| Trainer | 12 | Entry-level |
| Waitress | 12 | Entry-level |
| Marketing Trainee | ~12 | Entry-level |
| Errand Boy | ~12 | Entry-level |
| Pricing Manager | ~6 | Entry-level |
| Burger Cook | 6 | Treinado |
| Pizza Cook | 6 | Treinado |
| Burger Chef | 3 | Treinado |
| Pizza Chef | 3 | Treinado |
| Demais treinados | ~3–6 cada | Treinado |

> **Regra do "1x"**: Os seguintes empregados são marcados "1x" — cada jogador pode possuir apenas **1 cópia**: Luxury Manager, Regional Manager, CFO, Executive VP, Guru, HR Director, Brand Director, Zeppelin Pilot, Pizza Chef, Burger Chef. Em jogos com 2–3 jogadores, 2 cópias são removidas do supply; com 4 jogadores, 1 é removida; com 5 jogadores, todas são usadas.

**Outros componentes**:
- 🍔 Burgers: 40 tokens | 🍕 Pizzas: 40 | 🥤 Softdrinks: 40 | 🍺 Cervejas: 40 | 🍋 Limonadas: 40
- 🏠 Casas: 8 tiles | 🌳 Gardens: 8 tiles
- 🍽️ Restaurantes: 3 por jogador
- 📢 Marketing: 6 billboards, 4 mailboxes, 3 aviões, 3 rádios
- 💰 Bank Reserve Cards: 18 (3 por jogador, até 6 jogadores)

---

## Milestones — Expansão "The Ketchup Mechanism & Other Ideas"

> **Nota**: Estes milestones **substituem** os milestones do jogo base quando o módulo "New Milestones" é usado. Implementaremos como opção alternativa.

### Milestones com "Remove after Turn 2"
Devem ser reivindicados até o fim do turno 2, senão são descartados:

| Milestone | Bônus |
|---|---|
| **First Marketeer Used** | (1) Ganha **$5** por cada demand token colocado por seus marketeiros durante Marketing Campaigns. (2) Durante Dinnertime, distância até seus restaurantes é reduzida em **2** (unit price + distance - 2, pode ficar negativo). Acumula com Ketchup milestone |
| **First Marketing Trainee Used** | Recebe **1 Kitchen Trainee + 1 Errand Boy** grátis na praia. Como MT resolve após treinamento, não podem ser treinados imediatamente |
| **First Campaign Manager Used** | Neste turno, o CM pode colocar **2ª peça de marketing** do mesmo tipo (mesmo item, mesma duração, local diferente). Marketeiro fica ligado a ambas. Não acumula com 2º CM. Não pode ser guardado |
| **First Brand Manager Used** | Se o BM colocar avião, pode colocar **2 itens diferentes** nele (marketeia ambos, na ordem A→B). Não funciona pra mailbox/billboard. Não acumula com 2º BM |
| **First Brand Director Used** | Rádio colocado vira **permanente**. O Brand Director fica **ocupado pelo resto do jogo**. Mesmo se BD colocar outra peça (não rádio), só o rádio vira permanente |
| **First Trainer Used** | Recebe **1 Trainer extra**. Não precisa mais **demitir** empregados quando não puder pagar (mas deve pagar se puder, inclusive com comida/bebida se aplicável) |
| **First Recruiting Girl Used** | Recebe **1 Executive VP** grátis, sem salário pelo resto do jogo. Se não houver no supply, pega da caixa |
| **First Discount Manager Used** | Cada turno que descontar ≥$3: **$100** é removido do banco no fim do Restructuring. Aplica-se para cada jogador que tem o milestone |

### Milestones de Comida/Bebida

| Milestone | Bônus |
|---|---|
| **First Burger Sold** | CEO ganha **4 slots** (independente das Bank Reserve Cards) |
| **First Pizza Sold** | Para as primeiras **3 casas** que compram pizza neste turno: coloca **rádio de pizza de 2 turnos** no tile da casa (se houver espaço). Funciona como marketing normal, mas não está ligado a marketeiro (não dá $5 do First Marketeer) |
| **First Lemonade Sold** | Pode treinar empregados **"at work"** (na estrutura), desde que permaneçam na **mesma cor**. Empregado treinado pode ser usado imediatamente se o antigo ainda não foi usado. Cuidado: treinar antes de usar pode fazer perder milestones |
| **First Beer Sold** | Pode pagar salários com **tokens de comida/bebida** (1 token = 1 salário). Milestone de salário -$3 não se aplica a pagamento com tokens. Café não conta; noodles/kimchi/sushi contam como comida |
| **First Coke Sold** | Recebe **Freezer** (igual ao base). Café não pode ser armazenado; kimchi segue regras especiais; noodles/sushi podem |
| **First Coffee Sold** | Pode colocar coffee shop com alcance ilimitado |

### Outros Milestones da Expansão

| Milestone | Bônus |
|---|---|
| **First House Built** | Pode acumular treinamentos (mesmo efeito de "First to Pay $20+ in Salaries" do base) |
| **First New Restaurant** | Pode construir **1 mailbox permanente grátis** na área do restaurante (jogador escolhe o que marketeia). Não está ligada a marketeiro (sem bônus de $5 do First Marketeer) |
| **First Waitress Used** | Salários passam a ser **$3** por empregado (em vez de $5). Desconto de recruiting/HR continua dando -$5 por uso (fica mais eficiente). Pagamento com tokens ainda é 1 token = 1 salário |
| **First Cart Operator Used** | Cart Operators e Zeppelin Pilots coletam **4 drinks** por fonte (em vez de 2). Truck Drivers coletam **6 drinks** por fonte (em vez de 3) |
| **Someone Sells Your Demand (Ketchup)** | Ganha **-1 distância** permanente pelo resto do jogo quando um oponente vende demanda gerada pelo seu marketing. Acumula com First Marketeer Used |
