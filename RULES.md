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
- **Cada jogador recebe**: 1 CEO, 3 restaurantes, 3 Bank Reserve Cards
- **Ordem de turno**: Marcadores embaralhados aleatoriamente
- **Colocação de restaurante**: Em ordem reversa de turno, cada jogador coloca 1 restaurante em espaço vazio com entrada voltada para uma estrada
- **Casas iniciais**: Apenas casas com números **pares** são colocadas no mapa durante o setup
- **Bank Reserve**: Cada jogador escolhe secretamente 1 Bank Reserve Card (determina quanto dinheiro extra será adicionado ao banco depois)

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

#### Tipos de ação:

**Recrutamento:**

O efeito base de recrutamento é: **contratar 1 empregado entry-level** OU **pagar $5 a menos no total de salários** (escolhe na hora do uso).

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

Fontes de bebida são **tiles específicos no mapa**. Distância até a fonte é calculada da **mesma forma que o attractiveness** (bordas de tile cruzadas por estrada).

| Empregado | Qtd/fonte | Alcance | Tipo |
|---|---|---|---|
| Errand Boy | 1 (qualquer tipo) | — | Não precisa de fonte no mapa |
| Cart Operator | 2 por fonte | 2 | Estrada |
| Truck Driver | 3 por fonte | 3 | Estrada |
| Zeppelin Pilot | 2 por fonte | 4 | Voa (pega o tile inteiro) |

**Marketing** (alcance sempre contado a partir de qualquer **restaurante ativo**; número limitado de meios de comunicação disponíveis):

Cada campanha anuncia **1 item**. O jogador escolhe a duração de **1 até o máximo** de turnos do empregado. Meios de comunicação (billboard, mailbox) ocupam espaço no mapa; avião não ocupa.

| Empregado | Campanhas disponíveis | Duração máx. | Alcance | Movimento |
|---|---|---|---|---|
| Marketing Trainee | Billboard | 2 turnos | 2 | Estrada |
| Campaign Manager | Billboard ou Mailbox | 3 turnos | 3 | Estrada |
| Brand Manager | Qualquer anterior ou Avião | 4 turnos | ∞ | Avião |
| Brand Director | Todos os anteriores e Radio | 5 turnos | ∞ | Avião |

**Preços:**
| Empregado | Efeito |
|---|---|
| Pricing Manager | Reduz o preço unitário em **$1** (entry-level, obrigatório) |
| Discount Manager | Reduz o preço unitário em **$3** (obrigatório) |
| Luxury Manager | Aumenta o preço unitário em **$10** (obrigatório) |

**Outros:**
| Empregado | Ação |
|---|---|
| New Business Dev. (roxa) | Coloca nova **casa** ou **jardim** em qualquer espaço vazio adjacente a estrada (apenas casas **ímpares**; número limitado) |
| Waitress | Gera **$3** por ativação + desempata vendas (obrigatório) |
| CFO | Bônus de **50%** em toda renda do Dinnertime, arredondado pra cima (obrigatório — ver regras de falência abaixo) |
| Local Manager | Coloca novo restaurante como **"Coming Soon"** (inaugura na Cleanup). Enquanto ativo: todos os restaurantes do jogador ganham **drive-in** (cada quina do restaurante vira uma porta) |
| Regional Manager | Coloca **ou** move restaurante para espaço vazio — já entra **inaugurado**. Enquanto ativo: todos os restaurantes do jogador ganham **drive-in** (cada quina do restaurante vira uma porta) |

> **Regras de colocação de restaurante**: Entrada deve estar voltada para estrada (obrigatório tanto para Local Manager quanto Regional Manager).

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
- Casas sem garden: máximo **3 demand tokens**
- Casas com garden: máximo **5 demand tokens**
- Sem demand tokens = moradores ficam em casa

**Escolha do restaurante:**
1. Deve haver **conexão por estrada** entre a casa e a entrada do restaurante
2. O restaurante deve poder fornecer **TODOS** os itens demandados (sem pedidos parciais)
3. Se múltiplos restaurantes atendem: escolhe o de **menor "attractiveness"**:

```
Attractiveness = Unit Price + Distance
```

- **Preço unitário padrão**: $10 (modificável por Pricing/Discount/Luxury Manager)
- **Distância**: Conta-se o número de bordas de tile cruzadas pela estrada

**Desempate:**
1. Mais waitresses jogadas neste turno
2. Quem está antes na ordem de turno

**Pagamento:**
- Casas normais: pagam o **preço unitário** por item
- Casas com garden: pagam o **dobro** do preço unitário por item
- O dobro NÃO afeta o cálculo de attractiveness, apenas o pagamento

**Fim do jogo / Bank Reserve:**
- **Primeira vez** que o banco fica sem dinheiro durante o Dinnertime: completa-se a fase, depois todos os jogadores revelam suas Bank Reserve Cards e a **soma dos valores** é adicionada ao banco
- **Segunda vez** que o banco fica sem dinheiro durante o Dinnertime: completa-se a fase e o **jogo termina** — jogador mais rico vence

### 5. Payday (Pagamento)

- **CEO**: Sem salário
- **Empregados entry-level** (não treinados): Sem salário
- **Empregados treinados**: $5 de salário cada
- Salários são pagos ao banco
- Se não puder pagar: deve **demitir** empregados até poder

### 6. Marketing Campaigns (Campanhas)

- Campanhas ativas são resolvidas — casas dentro do alcance recebem demand tokens
- Campanhas com duração limitada perdem 1 turno de duração
- Campanhas expiradas são removidas

### 7. Cleanup (Limpeza)

- Restaurantes "Coming Soon!" viram "Welcome" (disponíveis para uso)
- Comida e bebida não vendida são descartadas (a menos que tenha Freezer)
- Preparação para o próximo turno

---

## Milestones

Bônus permanentes para o **primeiro jogador** a atingir cada marco. Se dois jogadores atingirem no mesmo turno, ambos recebem.

| Milestone | Bônus |
|---|---|
| **First Burger Produced** | Recebe 1 Burger Cook extra |
| **First Pizza Produced** | Recebe 1 Pizza Cook extra |
| **First Billboard Placed** | Salário de marketeiros = $0, campanhas viram eternas |
| **First to Train** | Desconto de $15 nos salários |
| **First Waitress Played** | Cada waitress ganha $2 extra |
| **First Cart Operator Played** | Todos os buyers ganham +1 alcance e +1 drink por fonte |
| **First Radio Campaign** | Rádios marketam 2 itens por turno em vez de 1 |
| **First to Hire 3 in 1 Turn** | Recebe 2 Management Trainees grátis |
| **First to Have $20** | Pode ver as bank reserve cards |
| **First to Have $100** | CEO vira também CFO (50% cash bonus no Dinnertime) |
| **First to Pay $20+ in Salaries** | Pode usar múltiplos trainers na mesma pessoa |
| **First to Throw Away Food/Drink** | Recebe Freezer (armazena 10 itens) |
| **First Burger/Pizza/Drink Marketed** | $5 bônus por venda do item específico |

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

- Cada tile tem: estradas, espaços vazios, e possivelmente casas
- **Casas**: Têm número (ordem de jantar) e capacidade de demanda
- **Gardens**: Podem ser adjacentes a casas, aumentam capacidade de demanda para 5 e dobram pagamento
- **Restaurantes**: Precisam ter entrada voltada para estrada
- **Estradas**: Conectam casas a restaurantes, determinam distância

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
