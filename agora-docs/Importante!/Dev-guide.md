
---

**Project Overview**

*   **Project:** Agora DeFi RealAssetToken (RAT) MVP
*   **Current Phase:** MVP Development Kick-off / Sprint 1 Planning
*   **Tech Stack:** **Next.js**, React, Wallet Connect (Integration required)
*   **Environment:** Development (Local), Target: **Testnet** (interacting via Backend with Alpaca Paper, Fireblocks Sandbox, L2 Testnet RPC)

**Conversation**

*   **Last Topic:** Review of Initial MVP Product Backlog (PO Presentation & Story Details)
*   **Key Decisions:**
    *   Prioritize core "Buy -> Mint" flow for MVP.
    *   Implement KYC-Light (Tier 1) onboarding first (RAT-MVP-012).
    *   Limit MVP to single ticker: AAPL (RAT-MVP-013).
    *   Require display of order status/confirmation (RAT-MVP-014) and balance (RAT-MVP-015).
    *   FE Tech Stack confirmed as Next.js.

**User Context**

*   **Target User:** LATAM Retail User (initially BR/PY).
*   **Technical Level:** Assumed Moderate (Familiar with web applications, potentially crypto wallets, but seeking user-friendly experience).

**Implementation Status**

*   **Active Feature:** Preparing to start work on **KYC-Light Onboarding UI (RAT-MVP-012)** and potentially **Buy Order UI (RAT-MVP-013)** in the upcoming Sprint.
*   **Progress:** 0% - Project Kick-off. No FE code implemented yet.
*   **Blockers:**
    *   Potential lack of detailed UI/UX mockups or style guide (Dependency for UI tasks).
    *   Need for defined API contracts from Backend for KYC submission (RAT-MVP-012), price estimation (RAT-MVP-013), status polling/updates (RAT-MVP-014), and balance fetching (RAT-MVP-015).

**Code Evolution**

*   **Recent Changes:** N/A - Project Kick-off.

**Working Patterns:**

*   None established yet (To be defined via Sprint process: Daily Scrums, Planning, Reviews, Retros).

**Failed Approaches:**

*   None attempted yet.

**Requirements**

*   **Implemented:** None.
*   **In Progress:** None (Sprint 1 about to start).
*   **Pending:**
    *   RAT-MVP-012: Build KYC-Light Onboarding Form UI (incl. Wallet Connect).
    *   RAT-MVP-013: Build Single-Ticker (AAPL) Buy Order UI.
    *   RAT-MVP-014: Display Order Status and Mint Confirmation UI.
    *   RAT-MVP-015: Display User's AAPL-RAT Balance (Read-Only) UI.

**Technical Constraints:**

*   Must use **Next.js**.
*   Must integrate **Wallet Connect** for wallet address input (RAT-MVP-012).
*   UI limited to **single asset (AAPL)** for MVP.
*   Balance display is **read-only**.
*   Dependent on **Backend APIs** (FastAPI) for data submission and retrieval.
*   Must function correctly within the target **Testnet** environment context (via Backend).

**Critical Memory**

*   **Must Preserve:**
    *   **Regulatory Compliance:** Ensure KYC-Light form accurately captures Name, Email, Country (BR/PY), Tax ID (CPF/RUC), and Wallet Address.
    *   **User Flow Adherence:** UI must reflect the logical steps: Onboarding -> Buy -> Status Tracking -> Balance View.
    *   **MVP Scope:** Focus strictly on the defined features (AAPL only, KYC-Light, core flow) and avoid adding extras.
*   **User Requirements:**
    *   Simple, clear KYC submission process.
    *   Intuitive way to specify AAPL quantity and initiate purchase.
    *   Transparent feedback on order status and minting success (incl. Tx Hash).
    *   Easy visibility of their resulting AAPL-RAT token balance.

**Known Issues:**

*   None documented yet.

**Next Actions**

*   **Immediate:**
    *   Participate actively in **Sprint Planning** to refine, estimate, and select initial FE tasks/stories.
    *   **Clarify availability** of UI/UX mockups or style guides.
    *   **Collaborate with Backend team** during Sprint Planning/early Sprint to define initial API contracts needed for selected stories (e.g., POST /onboard payload, GET /price endpoint structure).
*   **Open Questions:**
    *   Are detailed UI mockups or a style guide available now or expected soon?
    *   What are the exact API request/response structures for RAT-MVP-012 (KYC Submit) and RAT-MVP-013 (Get Estimated Price)?
    *   Are there specific preferences or existing libraries for Wallet Connect integration within Agora?

---

