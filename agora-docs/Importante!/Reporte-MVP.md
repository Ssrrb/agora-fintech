### Agora - RealAssetToken (RAT) — **MVP / POC Business-Requirements Pack**  
*Version 0.2 · 25 Apr 2025 · Business Analyst*

---

## 1 · Core “Purchase → Mint” User Journey & Business Rules  

| # | Step | Trigger & Input | System Action | Output / State Change | Key Rules |
|---|------|----------------|---------------|-----------------------|-----------|
| 1 | **KYC & Account Bootstrap** | User submits ID + selfie (minimum KYC tier acceptable to Alpaca sandbox) | KYC vendor ↔︎ Agora API; upon “verified=true” create Alpaca sub-account | `account_status = ACTIVE` | • 1 attempt/24 h<br>• Fail → hard stop |
| 2 | **Funding** | User wires fiat **or** pushes ≥ USD 50 via test on-ramp | Update internal ledger balance | `available_funds` credited | • Only **USD** supported<br>• Confirmed when Alpaca ledger = settled |
| 3 | **Equity Purchase (AAPL)** | User requests `qty` (≥ 0.01 share) | POST `/v2/orders` to Alpaca (time-in-force = day, type = market) | `order_id`, `status=PENDING_NEW` | • Limit to **AAPL** only<br>• Show est. price from Alpaca last trade |
| 4 | **Settlement Watch** | Alpaca webhook `trade_status=filled` | Verify fill price & quantity; persist | `position` row created | • Settlement cycle is **T+1** but treat “filled” as proof for mint |
| 5 | **Custody Acknowledgement** | Fireblocks vault receives transfer receipt from Apex Clearing | Record `custody_tx_id` | `custody_status = CONFIRMED` | • Custody check is async & retried max 3× |
| 6 | **Token Mint** | Both 4 & 5 successful | Call RAT smart-contract `mint(to, amount)` | Tx-hash on L2 (Sepolia / Optimism test) | • 1 RAT = 1× underlying share (support 8 decimals)<br>• Gas wallet = platform-sponsored |
| 7 | **Wallet Credit Confirmation** | Blockchain event `Transfer(0x0 → user)` | Notify UI & update balance cache | User sees balance in wallet | • Confirmation depth = 1 block |

**Essential Data Elements**

`user_id · alpaca_account_id · kyc_level · wallet_address · asset_ticker · qty_requested · order_id · fill_qty · fill_price · custody_tx_id · mint_tx_hash · timestamps per step · status enum`

---

## 2 · MVP Feature Scope

### 2.1 In-Scope (Must/Should)

| MoSCoW | Feature |
|--------|---------|
| **Must** | Single-ticker buy (AAPL) • KYC Tier 1 • Fiat funding via manual credit • Market-order execution • Fireblocks custody check • ERC-20 RAT mint on L2 test-net • Read-only wallet balance viewer • Admin-initiated manual burn-and-redeem |
| **Should** | Basic metrics dashboard (Grafana) • Slack alerting for failure states • Simple fee ledger (flat $0 broker fee + gas) |

### 2.2 Out of Scope (Won’t for MVP)

* Secondary-market trading, limit/stop orders  
* Multi-asset support, fractional portfolios  
* Automated on-chain redeem portal  
* Advanced AML, travel-rule messaging  
* Mobile apps, full localisation, staking, governance tokens  

---

## 3 · MVP Process Flow (textual diagram)

```
[User UI]
   │  (1) KYC / Funding
   ▼
[Agora Backend]───▶ [KYC API]
   │(2) order POST
   ▼
[Alpaca Broker] ──webhook──▶ [Agora Backend]
   │                              │
   │ (3) custody settle check     │
   ▼                              ▼
[Fireblocks Custodian]──webhook─▶ [Agora Backend]
   │
   │ (4) mint Tx
   ▼
[Ethereum L2 / RAT Contract]
   │  event log
   ▼
[User Wallet / Block-explorer]
```

---

## 4 · Smart-Contract Functional Requirements (Handover)

| ID | Function | Purpose | Inputs | Pre-conditions | Expected Effect |
|----|----------|---------|--------|----------------|-----------------|
| SC-1 | `mint(address to, uint256 amount)` | Issue RAT tokens once custody proven | `to` = user EOA, `amount` = shares·1e8 | Caller = Agora Mint Role | Increase `totalSupply`; emit `Transfer` 0x0→`to` |
| SC-2 | `burn(address from, uint256 amount)` | Admin burn during redeem | Caller = Redeem Role | Decrease balances & `totalSupply` |
| SC-3 | `setCustodian(address)` | One-time set; for audit trail | Only `OWNER` | Records custodian addr |

*Upgradeable pattern not required for MVP.*  
*Events: `Minted`, `Burned` for off-chain indexer.*

---

## 5 · External Integration Requirements

| System | Purpose | Minimal API/Hook | Data Needed |
|--------|---------|------------------|-------------|
| **Alpaca (Sandbox)** | Place market order, get fills | `POST /v2/orders`, `GET /v2/positions`, trade webhooks | API key/secret, ticker, qty |
| **Fireblocks** | Verify custody + co-sign mint | Webhook `NEW_TRANSFER`, `/v1/transactions/{id}` | Vault ID, tx state |
| **L2 RPC (Sepolia test)** | Broadcast mint tx, query events | JSON-RPC `eth_sendRawTransaction`, `eth_getLogs` | Signed tx, contract ABI |
| **Grafana / Prometheus** | Observability | Push JSON-lines to Loki | Step timings, error codes |

*All external keys stored in `.env` and rotated weekly.*

---

## 6 · MVP Acceptance Criteria

1. **Happy-Path Demo**  
   *Given* a verified user with ≥ USD 50 balance  
   *When* they request to buy 0.25 AAPL  
   *Then* within **≤ 10 minutes** they can see **0.25 AAPL-RAT** in their wallet on L2 test-net, and Tx is viewable on block-explorer.

2. **Accuracy** — Mint quantity equals filled share quantity ± 0.00000001.

3. **Cost** — Mean gas paid per mint **< USD 0.30** (converted at daily ETH-USD midpoint).

4. **Reliability** — ≥ 90 % of test orders succeed on first attempt over a 48-h soak run (n ≥ 20).

5. **Observability** — All seven journey steps emit structured logs discoverable in Grafana; critical alerts (< 0.05 tETH) fire to Slack within 60 s.

---

## 7 · MVP-Specific Risk Register (Top 5)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Alpaca sandbox downtime | Med | High | Daily health-check; fallback “simulation” mode |
| Fireblocks webhook delay | Low | Med | Retry with exponential back-off; time-box 10 min |
| Gas spike on L2 test-net | Med | Med | Pre-fund gas wallet 0.5 tETH; alert at low balance |
| KYC vendor false negatives | Med | Med | Manual override queue; collect logs for tuning |
| Smart-contract bug locks mint | Low | High | Unit + integration tests, test-net audit checklist |

---

## 8 · Handover Artefacts

| Doc | Format | Audience | Status |
|-----|--------|----------|--------|
| **BRD—this file** | Markdown | PO, PM, Architect | Draft v0.2 |
| Epic & User-Story Backlog | `backlog.md` (MoSCoW, estimates) | Dev Squad | *To be generated* |
| Sequence diagram | Mermaid snippet in repo | Engineering | Pending |
| API mapping sheet | CSV | Integrations | Pending |

> **Next Action:** create *backlog.md* with EPIC → USER STORY → TASK breakdown tied to learning goals and estimates; review with Architect in grooming session D-1 before Sprint 0 kickoff.

---  
*Prepared for Agora LATAM MVP team – please flag any missing constraints or clarifications before end-of-day.*