Below are (1) an incremental file-structure plan that extends your current Next 13 +/app router build and wires it to a slim FastAPI backend — enough to satisfy Story #1; and (2) three **condensed, higher-signal PoC stories** that replace the original five.  
Unnecessary bells & whistles (multi-asset router, on-chain proofs, etc.) are parked for later epics.

---

## 1 · Minimal Project Layout to Finish Story #1  
(_Clerk login ➜ session JWT ➜ FastAPI “hello-wallet” call_)

```
/agora-walletless-poc
├── frontend/
│   ├── app/                       ← Next.js  15 (app router)
│   │   ├── (auth)/
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx          ← “Trade” stub
│   │   ├── api/                  ← Edge runtime proxies Clerk → FastAPI
│   │   │   └── identity/
│   │   │       └── route.ts      ← POST → https://api.local/identity/kyc
│   │   └── page.tsx              ← marketing landing
│   ├── clerk.json                ← publishable & secret keys
│   ├── env.local                 ← NEXT_PUBLIC_API_URL, CLERK_PUBLISHABLE_KEY
│   └── tsconfig.json
└── backend/
    ├── main.py                   ← FastAPI root, Uvicorn
    ├── routers/
    │   ├── identity.py           ← /identity/kyc (Story #2)
    │   └── wallet.py             ← /wallet/create  (Story #3)
    ├── services/
    │   ├── sumsub.py
    │   └── aa_factory.py
    ├── requirements.txt
    └── Dockerfile
```

**Key glue**

| Area | Detail |
|------|--------|
| **Clerk → FastAPI auth** | In `page.tsx` (dashboard) call `useAuth()` → get `getToken()`. Forward that JWT in `Authorization: Bearer` to FastAPI. |
| **FastAPI middleware** | `from fastapi_clerk_auth import ClerkBearer` to validate the token server-side. |
| **Edge proxy** | The `/app/api/identity/route.ts` endpoint lets you stay inside Vercel’s Edge while hiding your backend URL from the browser. |
| **Dev-compose** | Add a `docker-compose.dev.yml` that spins up `frontend` (Vite/Turbo) + `backend` + `ngrok` if you need Sumsub callbacks. |

Once the round-trip “login → call FastAPI → JSON 200” works, Story #1 is done.

---

## 2 · Re-scoped, High-leverage PoC Stories

> **Backlog source**: Jira board `RAT-Product`  
> **Sprint goal**: *User can sign up with Clerk, pass KYC Tier-1 and receive a gas-sponsored smart-account able to buy 1 RAT-USDc lot on Optimism-Sepolia.*

---

### **Story ID: RAT-101**  
**Title**: Login & session via Clerk (Next JS)  

**As a** prospective trader  
**I want** to sign in with email/OAuth through Clerk  
**So that** I obtain a JWT session the backend trusts  

**Acceptance (Gherkin)**  
1. GIVEN the unauthenticated `/dashboard` route  
   WHEN the user completes Clerk’s sign-up/sign-in flow  
   THEN `useAuth().isLoaded === true` **AND** `getToken()` returns a JWT accepted by the FastAPI `/whoami` probe  

**DoR**: value clear · acceptance testable · Figma auth screens · Clerk keys in Vault · ≤ 5 SP  
**DoD**: unit test passes · `/whoami` returns 200 · demo in Sprint review  

**Reg-Checklist**  
- ✅ Seychelles VASP scope ok (custodial architecture)  
- ✅ No restricted instrument touched  
- ✅ KYC tier remains ≤ US$1 k/day  

---

### **Story ID: RAT-102**  
**Title**: Tier-1 KYC via `identity-svc` ↔ Sumsub  

**As a** compliance officer  
**I want** each new session to pass Sumsub Tier-1 (name + ID selfie)  
**So that** Agora fulfils Seychelles VASP §6 before wallet creation  

**Acceptance (Gherkin)**  
1. GIVEN a valid Clerk JWT  
   WHEN POST `/identity/kyc` is called  
   THEN identity-svc creates a Sumsub applicant, returns `status=pending` **OR** `status=approved`  
2. GIVEN `status=approved`  
   THEN the user is marked `kyc_passed=true` in Supabase and may invoke `/wallet/create`  

**DoR**: business value clear · Sumsub sandbox creds · webhook URL white-listed · ≤ 8 SP  
**DoD**: unit + integration tests · manual happy-path recorded · webhook retry logic documented  

**Reg-Checklist**  
- ✅ Applicant data encrypted at rest (AES-256)  
- ✅ Only Tier-1 fields collected  
- ✅ Data-retention policy < 5 y stored in S3 Glacier (PoC: local disk)  

---

### **Story ID: RAT-103**  
**Title**: Wallet-less AA account & first sponsored trade  

**As a** KYC-cleared user  
**I want** the backend to deploy an ERC-4337 smart-account and sponsor my first RAT-USDc buy  
**So that** I can trade without holding ETH for gas  

**Acceptance (Gherkin)**  
1. GIVEN `kyc_passed=true`  
   WHEN POST `/wallet/create` is invoked  
   THEN a smart-account is deployed on Optimism-Sepolia and its address stored in Supabase  
2. GIVEN a JSON body `{pair:"RAT-USDc", side:"buy", qty:1}`  
   WHEN POST `/trade/aa` is invoked  
   THEN gas-sponsor-svc signs paymaster data, the bundler relays the UserOp, and the endpoint returns `{txHash}` in ≤ 3 s  

**DoR**: Factory address configured · paymaster key in KMS · testnet usdc faucet ready · ≤ 13 SP  
**DoD**: Slither scan 0 critical issues · p95 latency < 4 s in Grafana · demo video posted  

**Reg-Checklist**  
- ✅ Paymaster daily cap ≤ US$5/user  
- ✅ No fiat offramp required (testnet)  
- ✅ Event logs retained for audit  

---

### Why these three?

| Risk/Value Driver | Covered Story |
|-------------------|---------------|
| **User funnel drop-off** | RAT-101 |
| **Regulatory licence gating** | RAT-102 |
| **Core tech unknown (AA + gas sponsor)** | RAT-103 |

Everything else (multi-pair router, Merkle proof-of-reserve, p95 < 2 s optimisation) is noise for a 4-week PoC and can sit in the Parking-Lot column.

---

### 3 · Next Micro-Steps (today–tomorrow)

1. **Wire Clerk JWT to FastAPI**: add `fetch('/api/whoami')` on dashboard mount; backend echoes Clerk subject.  
2. **Create `identity.py` router** with `/kyc` POST, plus a `/sumsub/webhook` endpoint.  
3. **Stub `aa_factory.py`**: use Ethers-JS in a Python subprocess or call a simple `POST /deploy` on an Anvil script.  
4. **Grafana board**: import panels 101-104; point Prometheus to FastAPI `/metrics`.

You now have a lean PoC backlog and a directory blueprint that will take you from empty repo to demo-able wallet-less trade within one sprint. Good luck—ping me when the first UserOp lands 🎉