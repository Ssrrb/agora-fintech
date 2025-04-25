**Agora MVP POC – Integration Report (v0.2 / 25 Apr 2025)**  
*(scope: only what is essential to demonstrate “purchase → custody → mint” for a single equity-RAT on test systems)*  

---

## 1 · Why these four integrations?

| Layer | Service | “Must-have” role in MVP |
|-------|---------|-------------------------|
| Broker | **Alpaca** | Places the equity order, returns trade & T+1-settlement status |
| Custody / Wallet | **Fireblocks** | Holds real share in omnibus vault; signs on-chain mint txn from secure MPC wallet |
| Blockchain infra | **L2 Sepolia RPC** (thirdweb / Scroll) | Cheap, fast ERC-20 mint + walletless UX for demo users |
| Observability | **Grafana Cloud** | One dashboard that streams logs/traces/alerts from FastAPI backend & smart-contract events |

Everything else (KYC flows, fiat on-ramp, secondary trading, fee engine, etc.) is explicitly **out of scope** for the POC.  

---

## 2 · Alpaca Broker API (sandbox)

* **Sandbox URL:** `https://paper-api.alpaca.markets` (no real cash required).  
* **Account model needed:** **Cash account**, fractional-share enabled, international onboarding allowed for Paraguay/Brazil test users.  
* **API calls required**  
  1. `POST /v2/orders` – place market buy for *AAPL* (fractional 1 share ok).  
  2. `GET /v2/orders/{id}` – poll until `status = "filled"`.  
  3. `GET /v2/account/activities` – confirm settlement flag on T+1.  
* **Settlement assumption:** Alpaca settles equities **T+1** in line with DTCC (effective May 2024).  ([Broker API FAQs - Alpaca API Docs](https://docs.alpaca.markets/docs/broker-api-faq?utm_source=chatgpt.com))  
* **Web-hooks (optional):** Server-sent events (SSE) or WebSocket stream for order fills to cut polling.  ([Alpaca API Platform](https://docs.alpaca.markets/docs/alpaca-api-platform))  
* **Test data returned:** order-id, filled_qty, avg_price, settlement_date – used to trigger custody leg.  

---

## 3 · Fireblocks Developer Sandbox

* **Sign-up:** free, instant access; comes with pre-funded testnet wallets.  ([Developer Sandbox Sign Up - Fireblocks](https://www.fireblocks.com/developer-sandbox-sign-up/?utm_source=chatgpt.com))  
* **Key features leveraged**  
  * **MPC vault wallets** – Agora operates one omnibus vault (real share held off-chain, ETH testnet key on-chain).  
  * **Transaction API** – `POST /v1/transactions` to sign & broadcast mint transaction originating from custody wallet.  ([Transaction Webhooks - Fireblocks Developer Portal](https://developers.fireblocks.com/reference/transaction-webhooks?utm_source=chatgpt.com))  
  * **Webhooks v2** – push transaction-status updates back to Agora backend (`COMPLETED`, `FAILED`).  ([Webhooks v2 - Fireblocks Developer Portal](https://developers.fireblocks.com/reference/webhooks-v2?utm_source=chatgpt.com))  
* **Minimal policy:** allowlisted destination = Agora L2 bridge, asset list = {ETH-Sepolia}.  
* **Security note:** API key + signed JWT header; keep in GCP Secret Manager.  

---

## 4 · Layer-2 & Sepolia RPC

### 4.1 Why L2 for the demo?  
Gas ~= 0.01 USD vs ≈ 1 USD on L1; confirmation < 5 s; no bridge fees for testnet.

### 4.2 RPC options

| Provider | Endpoint | Notes |
|----------|----------|-------|
| **thirdweb RPC-Edge** | auto-provisioned once project & client-ID created; SDK handles fail-over.  ([Chains - thirdweb TypeScript SDK](https://portal.thirdweb.com/typescript/v5/chain?utm_source=chatgpt.com)) | Works out-of-the-box with their **in-app wallet** for guest log-ins. |
| **Scroll Sepolia** | `https://sepolia-rpc.scroll.io` (public) – listed in Scroll quick-start.  ([Developer Quickstart | Scroll Documentation](https://docs.scroll.io/en/developers/developer-quickstart/?utm_source=chatgpt.com)) | Mirrors Scroll mainnet architecture; cheap & stable. |

### 4.3 Smart-contract hooks (MVP only)

* `mint(address to, uint256 amount, string brokerTradeId)` – callable **once** when Fireblocks webhook = `COMPLETED`; emits `Minted()` event with tradeId for reconciliation.  
* Optional `burn()` / `redeem()` is **out of scope**.

---

## 5 · Grafana for Observability

* **Stack chosen:** Grafana Cloud + OpenTelemetry SDK inside FastAPI.  
* **Quick set-up:** install **Grafana Alloy** collector → pushes metrics, logs, traces to managed instance.  ([Application Observability | Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/?utm_source=chatgpt.com), [Application Observability user manual | Grafana Cloud documentation](https://grafana.com/docs/grafana-cloud/monitor-applications/application-observability/manual/?utm_source=chatgpt.com))  
* **MVP dashboard widgets**  
  * Order latency (UI-click → Alpaca `filled`).  
  * Custody latency (filled → Fireblocks `COMPLETED`).  
  * Mint latency (Fireblocks → tx confirmed).  
  * Error panel keyed on “retry-exceeded”.  

---

## 6 · End-to-end Happy Path (sequence)

```
UI (Next.js) ──[POST /purchase]──▶ Agora API (FastAPI)
  │                                         │
  │                               (1) POST /orders → Alpaca
  │                                         │
  │                               (2)   order.status = filled
  │                                         │
  │                               (3) create vault deposit (off-chain) in Fireblocks
  │                                         │
  │                               (4) Fireblocks webhook → Agora
  │                                         │
  │                               (5) call RAT.mint() on Sepolia L2 via RPC-Edge
  │                                         │
  ▼                                         ▼
User (walletless)                ERC-20 AAPL-RAT balance + Success toast
```

---

## 7 · Acceptance Criteria (testable)

1. Given a whitelisted test user, when they press “Buy 1 AAPL-RAT”, their wallet shows **1 AAPL-RAT** on Sepolia within **≤ 60 s**.  
2. Grafana dashboard displays **non-zero** values for all three latency metrics.  
3. No plaintext API keys are present in container logs.

---

## 8 · Immediate Risks (MVP-scope only)

| Risk | Mitigation |
|------|------------|
| Broker or custodian sandbox outage | Keep local fixtures + retry w/ exponential back-off |
| L2 testnet congestion | Fallback to thirdweb redundant RPC list |
| Incorrect webhook auth | Enable signature verification + Grafana alert on 401s |
| Cross-currency rounding (fractional share) | Fix demo quantity to “1 whole share” |

---

## 9 · Next actions for Engineering / DevOps

1. **Accounts:** request Alpaca sandbox keys & Fireblocks developer account; record in secret manager.  
2. **Smart-contract stub:** deploy `RATToken.sol` on Sepolia; hard-code custodian signer address.  
3. **CI-pipeline:** run `pytest -m integration` against Paper Alpaca & Fireblocks sandbox nightly; publish results to Grafana.  

---

### Appendix A – Glossary (for non-blockchain stakeholders)

* **Layer 2 (L2):** off-chain execution layer that inherits L1 security; example rollups = Scroll, Optimism, Arbitrum.  
* **RPC endpoint:** HTTP bridge your backend uses to read/write blockchain state.  
* **Sepolia:** canonical Ethereum testnet (Goerli replacement) – free ETH via faucet, 15 s blocks.  

---

**Prepared by:** Business Analyst – Agora DeFi  
*(All URLs verified 25 Apr 2025; only sandbox/testnet services referenced.)*