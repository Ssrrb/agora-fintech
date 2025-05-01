Here’s a ready-to-go **Sprint 1 Backlog**, fully focused on unblocking the Front-end team by delivering a working UI shell with mocked endpoints. You can drop these straight into your Scrum board and start refinement:

| **Sprint 1 Story ID** | **Title**                                                            | **Est. Pts** | **Acceptance Criteria (Summary)**                                                                                   | **Dependencies**             |
|-----------------------|----------------------------------------------------------------------|--------------|---------------------------------------------------------------------------------------------------------------------|------------------------------|
| RAT-MVP-101           | FE – Implement `WalletConnectButton` using Clerk / Wagmi             | 3            | - “Connect” button appears on `/auth/connect`<br>- Clicking it opens MetaMask and on success shows wallet address  | Clerk/Wagmi config in place  |
| RAT-MVP-102           | FE – Display connected wallet address in header/profile area         | 2            | - When user is connected, header shows `0xAb…1234`<br>- If disconnected, shows “Not connected”                      | RAT-MVP-101                  |
| RAT-MVP-201           | FE – Render Tier 1 KYC form (Name, Email, Country, CPF / RUC fields) | 5            | - All required fields render with labels and placeholders<br>- Country dropdown pre-filters BR / PY                  | Figma mocks available        |
| RAT-MVP-202           | FE – Client-side validation for KYC fields                            | 3            | - Invalid CPF / RUC shows inline error<br>- “Submit” stays disabled until all fields valid                           | RAT-MVP-201                  |
| RAT-MVP-203           | FE – “Submit KYC” calls mock `POST /users/onboard`                   | 3            | - Clicking “Submit” triggers fetch(`/users/onboard`, …)<br>- On 200 OK shows “KYC Submitted” toast                   | RAT-MVP-201, RAT-MVP-202     |
| RAT-MVP-301           | FE – Display AAPL-RAT asset info & quantity input on Buy page        | 3            | - `/dashboard/buy` lists “AAPL-RAT” with placeholder price<br>- Quantity input accepts ≥ 0.01                         | RAT-MVP-102                  |
| RAT-MVP-302           | FE – Implement “Buy” button calling mock `POST /orders`              | 3            | - Clicking “Buy” with valid qty triggers fetch(`/orders`, …)<br>- On 200 OK shows “Order Submitted” state           | RAT-MVP-301                  |
| RAT-MVP-303           | FE – Show basic order status feedback                                | 2            | - After mock submit, UI toggles from “Submit” to “Processing…”<br>- Then to “Submitted” or “Error”                   | RAT-MVP-302                  |
| RAT-MVP-401           | FE – Display mocked AAPL-RAT balance on Dashboard                    | 2            | - Dashboard “Balance” widget shows “0.00 AAPL-RAT”<br>- Balance updates when mock API returns a different value      | RAT-MVP-203, RAT-MVP-303     |



---

### Next Steps for Sprint 1 Planning

1. **Refinement Session**  
   - Confirm PO and FE team walk through each story’s Acceptance Criteria.  
   - Link to Figma screens for UI mocks.  
   - Agree mock-server responses (`{"status":"success"}`, placeholder price, balance values).

2. **Task Breakdown**  
   - Developers break each story into 1–3 sub-tasks (e.g., “Set up Clerk config”, “Build KYC form UI component”, “Write validation utils”).

3. **DoR Check**  
   - Figma link attached  
   - Draft AC present  
   - Mock API shape agreed  
   - Routing set up in codebase  
   - Tailwind tokens/styles available

4. **Plan Daily Scrums**  
   - Sprint 1 goal: “Ship a clickable UI flow from Connect → KYC → Buy → Balance (all mocked).”  
   - Use burndown or simple Kanban board to track “To Do / In Progress / Done.”

5. **Identify Impediments Up Front**  
   - Confirm dev environment has Clerk and Wagmi installed.  
   - Ensure mock-server or MSW setup for front-end stubbing.  
   - Flag any missing design tokens or mismatch with Figma.

---

With these **nine stories** prioritized and scoped, your Front-end team can immediately start delivering visible value—rendering screens, wiring up interactions, and demonstrating a click-through “Buy → Mint” shell—while Back-end and DevOps work in parallel on the real integrations.