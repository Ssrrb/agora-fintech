**Document Title:** Agora PoC MVP Requirements: Asset Purchase & RAT Minting

**Version:** 1.1\
**Status:** Revised post‑feasibility review\
**Date:** 25 Apr 2025\
**Author:** Business Analyst (Gemini) – updated with Architecture & Compliance feedback

---

## 0 · Change‑Log

| Ver. | Date        | Author              | Key Updates                                                                                                                                                                                                                                                                                                                             |
| ---- | ----------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.1  | 25‑Apr‑2025 | Gemini (+Assistant) | • Clarified custody split (Apex/Alpaca vs. Fireblocks).• Added settlement/JIT toggle & manual overrides.• Added LATAM regulatory appendix + FX/capital‑controls note.• Added gas top‑up & observability to in‑scope.• Strengthened key‑management requirements.• New acceptance criteria AC9‑AC11.• Minor wording & risk‑matrix updates |
| 1.0  | 25‑Apr‑2025 | Gemini              | First issue                                                                                                                                                                                                                                                                                                                             |

---

## 1 · Core MVP Goal (unchanged)

Demonstrate the **purchase‑to‑mint** pipeline for a single Real‑World Asset (AAPL) with sponsored gas and wallet‑less UX.

---

## 2 · Architectural Clarifications

### 2.1 Custody & Settlement Reality

- **Clearing & Custody:**\
  *The legal owner of the underlying share is Apex Clearing* (via Alpaca). Fireblocks **does not** hold the equity; it secures the on‑chain keys and may record a tokenised ‘position’ for reporting purposes only.
- **PoC Implication:**\
  ‑ Treat Alpaca ➜ Apex as the **source of truth** for share settlement.\
  ‑ Fireblocks is **optional** for PoC custody confirmation; use it only to co‑sign minting TX **or** simulate its webhook.

### 2.2 Settlement vs. Execution

- A ‘**filled**’ order ≠ settled ownership.
- For the PoC we introduce a **`FORCE_SETTLED`** flag that can be toggled via admin UI **or** triggered automatically by polling Alpaca’s *JIT settlement* endpoint every 5 s (fails‑safe after 60 s).

### 2.3 Manual Overrides (Demo Safety)

| Flag                      | Default | Purpose                                           |
| ------------------------- | ------- | ------------------------------------------------- |
| `FORCE_SETTLED`           | `false` | Skips waiting for Apex DTC feed.                  |
| `FORCE_CUSTODY_CONFIRMED` | `false` | Bypasses Fireblocks/Apex confirmation.            |
| `FORCE_MINTED`            | `false` | Simulates on‑chain success if test‑net congested. |

### 2.4 Observability & Logging

Minimal but mandatory:

- Structured **stdout** in JSON‑lines.
- One dashboard (Grafana Cloud free tier) with: order‑status, settlement‑lag, mint‑status, gas‑wallet balance.
- Alerts to Slack/MS‑Teams if `gas_wallet_balance < 0.05 tETH` or if any step > 2 min.

### 2.5 LATAM Regulatory & FX Notes (non‑blocking)

- Provide 1‑page appendix mapping\*\* CVM‑BR, CNV‑PY\*\* securities‑token rules.
- Describe happy‑path FX on‑ramp: *PIX/CBU → USDC → OTC swap → Alpaca USD.*
- These notes are **informational only**; no enforcement in PoC code.

---

## 3 · Updated In‑Scope Items

*All v1.0 scope retained* **plus**:

1. **Gas Top‑Up Script:** Cron job every hour ▶ faucet / internal dispenser.
2. **Observability stack** (above).
3. **Key‑Management:** Minter key stored in AWS KMS **or** Fireblocks Co‑sign; never in `.env`.
4. **Admin UI:** Toggle override flags + view logs.

---

## 4 · Process Flow (rev A)

*See updated Mermaid diagram below – added settlement toggle & logging hooks.*

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Backend
    participant Alpaca
    participant Apex as Custody
    participant Fireblocks
    participant ERC20

    User->>UI: Purchase 1 AAPL
    UI->>Backend: /buyAAPL
    Backend->>Alpaca: placeOrder()
    Alpaca-->>Backend: OrderID status=new
    Backend-->>UI: "Order submitted"

    %% Execution complete
    Alpaca-->>Backend: status=filled
    alt FORCE_SETTLED == true
        Backend-->>Backend: markSettled()
    else
        loop Poll JIT every 5s max 60s
            Alpaca-->>Backend: JIT=settled?
            break when settled
        end
    end
    note right of Backend: Ownership confirmed (Apex)

    alt FORCE_CUSTODY_CONFIRMED == false
        Fireblocks-->>Backend: (optional) custody webhook
    else
        Backend-->>Backend: simulateCustody()
    end

    Backend->>ERC20: mint()
    ERC20-->>Backend: TxHash
    Backend-->>UI: "Token minted" + TxHash
```

---

## 5 · Acceptance Criteria (expanded)

| ID          | Description                                                                           |
| ----------- | ------------------------------------------------------------------------------------- |
| **AC1–AC8** | **Unchanged from v1.0**                                                               |
| **AC9**     | Gas‑sponsoring wallet auto‑tops‑up when balance < 0.1 tETH and logs event.            |
| **AC10**    | All key steps emit JSON‑line log; Grafana dashboard shows live counters.              |
| **AC11**    | Admin can toggle `FORCE_*` flags via protected endpoint/UI and see effect within 5 s. |

---

## 6 · Risk Matrix (delta‑only)

| ID     | New / Updated | Description                                                                   | Mitigation                                                |
| ------ | ------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------- |
| **R8** | **New**       | Override flags accidentally enabled in demo -> false‑positive.                | Flags auto‑reset to `false` after each run; banner in UI. |
| **R2** | *Updated*     | Settlement/custody latency now partially mitigated by override & JIT polling. | —                                                         |
| **R4** | *Updated*     | Gas failure now covered by auto‑top‑up & alert.                               | —                                                         |

---

## 7 · LATAM Appendix (summary)

*(Full 1‑page PDF to be produced by Compliance; outline only here)*

1. **Brazil (CVM):** Alignment with Resolution 175; sandbox cohort #2 precedent (BTG Pactual tokens).
2. **Paraguay (CNV‑PY):** Draft fintech bill (2024) – tokens treated as ‘valores representativos’.
3. **Capital Controls:** Outline stable‑coin loop & PTAX ref‑rate (for BRL).
4. **Next‑Step:** Regulatory memo before MVP‑beta.

---

## 8 · Next Steps (Sprint‑0)

1. **Integration spike:** Alpaca sandbox order + JIT polling.
2. Deploy Sepolia `AAPL‑RAT` (simple OpenZeppelin ERC‑20) – fund minter, verify mint.
3. Implement logging & Grafana dashboard.
4. Build admin UI with override switches + gas balance display.
5. Schedule internal demo after AC1–AC6 green ➜ book demo slot.

---

> **Verdict:** With custody clarification, LATAM notes, logging, and safety toggles in place, the PoC remains **low‑risk & 4‑sprint‑achievable** by a 2‑person squad.

