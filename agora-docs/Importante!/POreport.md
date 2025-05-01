Okay team, let's translate the MVP vision, constraints, and blueprints into an actionable backlog. As your Regulatory Product Owner, my focus is ensuring every item we build directly supports our mission: a compliant, technically sound, user-friendly "Buy→Mint" MVP for LATAM, starting with BR/PY and Seychelles VASP requirements.

This backlog is crafted directly from the **Architect's v0.5 Blueprint**, the **BA's v0.2 Requirements Pack**, and our **MVP Execution Handbook**. It prioritizes regulatory necessity and core user value within the defined technical constraints.

Remember our core constraints: KYC-Light, Fireblocks Sandbox, Alpaca Paper, ERC-20 Mint-Only, Testnet, Manual PoR, No Burn/Secondary Trading. The Smart Contract Audit is a critical dependency *before* Testnet deployment.

Here is the initial MVP Backlog, structured by our key Epics:

---

### **Agora MVP Backlog (Initial Draft)**

**Prioritization Note:** Items are roughly ordered within features based on the algorithm (Reg Risk * 3 + User Value * 2 + ROI / (Effort + Tech Debt)). Regulatory and core flow items are higher.

---

#### **Epic: Regulatory Compliance**
*Goal: Ensure the MVP meets foundational Seychelles VASP and BR/PY sandbox requirements.*

**Feature: KYC-Light Onboarding (Tier 1)**
*Description: Implement the minimal user verification flow required for the MVP's daily transaction limit.*

*   **MVP-ID**: RAT-MVP-001
    **Title**: Implement CPF/RUC-Based KYC Light Verification
    **As** <LATAM Retail User>
    **I Need** <To submit my Name, Email, Country, and Tax ID (CPF/RUC)>
    **To Achieve** <Approval for Tier 1 transactions (≤$1k/day) and comply with BR/PY sandbox rules.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Backend API] | [Sequence Flow 3.2] | [Data Schema: User]
    *Tech Stack*: FastAPI Endpoint (`POST /api/v1/users/onboard`) | PostgreSQL DB

    **Acceptance Criteria (Gherkin)**
    1. GIVEN User provides valid Name, Email, Country (BR/PY), and CPF/RUC
    WHEN submitting KYC-light form via FE
    THEN create User record in DB with status=APPROVED (manual/mock for MVP)
    AND associate wallet_address with User record
    AND allow user to proceed to the Buy flow

    **Regulatory Gates**
    - [ ] Seychelles VASP Article 4.2(b) (Customer Due Diligence) clause mapping confirmed
    - [ ] KYC tier impact analysis (MVP: Tier 1 ≤$1k/day limit enforced by backend logic)
    - [ ] Data sovereignty annotation (BR/PY test users' data stored in managed DB)
    - [ ] Manual PoR reporting requirement (User data linked to potential future PoR reports)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 sequence flow 3.2
    - [ ] Uses PostgreSQL User schema from blueprint
    - [ ] Authentication mechanism (Clerk/JWT) integrated

*   **MVP-ID**: RAT-MVP-002
    **Title**: Enforce Tier 1 Transaction Limits
    **As** <Agora Backend Service>
    **I Need** <To track user transaction volume>
    **To Achieve** <Compliance with the MVP's KYC Tier 1 daily limit (≤$1k/day or equivalent) and prevent unauthorized minting beyond the limit.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Backend API] | [Sequence Flow 3.1] | [Data Schema: Order, User]
    *Tech Stack*: FastAPI Endpoint (`POST /api/v1/orders`) | PostgreSQL DB

    **Acceptance Criteria (Gherkin)**
    1. GIVEN a Tier 1 APPROVED user
    WHEN they attempt to place an order that exceeds the daily limit (e.g., >$1k total value for the day)
    THEN the order request is rejected
    AND the user receives an informative error message

    **Regulatory Gates**
    - [ ] Seychelles VASP Article 4.2(b) (Transaction Monitoring) clause mapping confirmed
    - [ ] KYC tier impact analysis (MVP: Logic specifically for Tier 1 limit)
    - [ ] Data sovereignty annotation (Transaction data linked to user)
    - [ ] Manual PoR reporting requirement (Transaction data feeds into potential reports)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 sequence flow 3.1 (pre-Alpaca call)
    - [ ] Uses PostgreSQL Order and User schemas
    - [ ] Logic implemented within the Backend API service

**Feature: Manual Proof-of-Reserve Reporting**
*Description: Implement the internal data collection and reporting mechanism for MVP compliance.*

*   **MVP-ID**: RAT-MVP-003
    **Title**: Implement Internal PoR Data Aggregation
    **As** <Agora Compliance Admin>
    **I Need** <To collect data on minted tokens and corresponding custody records>
    **To Achieve** <The ability to manually compile the MVP Proof-of-Reserve report required by regulators.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Backend API] | [Sequence Flow 3.3] | [Data Schema: CustodyRecord, MintTx]
    *Tech Stack*: FastAPI Endpoint (Internal Admin API) | PostgreSQL DB

    **Acceptance Criteria (Gherkin)**
    1. GIVEN the internal admin tool is accessed
    WHEN the PoR data export is triggered
    THEN the system queries and aggregates total minted quantity from MintTx records
    AND queries and aggregates total custody quantity from CustodyRecord records
    AND queries simulated balance from Fireblocks sandbox (if available/mocked)
    AND presents this data via an internal endpoint or report file

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Proof of Reserve - *placeholder, map to specific article*) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (Aggregation respects data location)
    - [ ] Manual PoR reporting requirement (Core implementation of the data source)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 sequence flow 3.3
    - [ ] Uses PostgreSQL CustodyRecord and MintTx schemas
    - [ ] Access restricted to internal admin users

---

#### **Epic: Technical Integrity**
*Goal: Build a secure, robust (for MVP scale), and integrated system based on the blueprint.*

**Feature: Core Backend Services**
*Description: Build the foundational API and worker services to orchestrate the flow.*

*   **MVP-ID**: RAT-MVP-004
    **Title**: Setup FastAPI Backend and Celery Worker Infrastructure
    **As** <Agora DevOps Engineer>
    **I Need** <The core backend and worker services to be deployable>
    **To Achieve** <A functional environment for the MVP application logic.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Backend API, Async Worker, Cache] | [IaC Skeleton] | [Tech Stack]
    *Tech Stack*: FastAPI, Celery, Redis, Docker, IaC (Terraform/Pulumi)

    **Acceptance Criteria (Gherkin)**
    1. GIVEN IaC scripts are executed
    WHEN deploying the core services
    THEN FastAPI backend container is running and accessible (internally/via Load Balancer)
    AND Celery worker container is running and connected to Redis broker
    AND Redis instance is running and accessible by Celery/Backend

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Infrastructure) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (Services deployed in target region if required)
    - [ ] Manual PoR reporting requirement (N/A directly)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Container Diagram
    - [ ] Uses specified Tech Stack (FastAPI, Celery, Redis)
    - [ ] IaC Skeleton implemented

*   **MVP-ID**: RAT-MVP-005
    **Title**: Implement Core Order State Management
    **As** <Agora Backend Service>
    **I Need** <To save and update order status throughout the buy-settle-mint flow>
    **To Achieve** <Persistence and tracking of each user's transaction.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: PostgreSQL Database] | [Sequence Flow 3.1] | [Data Schema: Order]
    *Tech Stack*: PostgreSQL DB | FastAPI/SQLAlchemy ORM

    **Acceptance Criteria (Gherkin)**
    1. GIVEN a user submits a buy order
    WHEN the order is received by the backend
    THEN a new Order record is created in the DB with status=PENDING
    2. GIVEN an Order record exists
    WHEN an external event (e.g., Alpaca fill) occurs
    THEN the corresponding Order record is updated with the new status (e.g., FILLED) and details

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Record Keeping) clause mapping confirmed
    - [ ] KYC tier impact analysis (Order linked to user)
    - [ ] Data sovereignty annotation (Order data stored in DB)
    - [ ] Manual PoR reporting requirement (Order data feeds into reports)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Sequence Flow 3.1 (DB interactions)
    - [ ] Uses PostgreSQL Order schema from blueprint
    - [ ] ORM implementation aligns with blueprint

**Feature: External Integrations (Alpaca, Fireblocks, RPC)**
*Description: Connect the backend services to the required external sandbox/testnet APIs.*

*   **MVP-ID**: RAT-MVP-006
    **Title**: Integrate with Alpaca Paper Trading API for Order Placement & Polling
    **As** <Agora Backend/Worker Service>
    **I Need** <To send buy orders to Alpaca and track their status>
    **To Achieve** <Execution of the equity purchase leg of the flow.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Backend API, Async Worker] | [Sequence Flow 3.1] | [External System: AlpacaPaper]
    *Tech Stack*: Python HTTP Client/SDK | FastAPI | Celery

    **Acceptance Criteria (Gherkin)**
    1. GIVEN a PENDING order in the DB
    WHEN the backend sends the order to Alpaca via POST /v2/orders
    THEN Alpaca responds with an order_id and initial status
    AND the order_id is saved to the Order record
    2. GIVEN an order_id is saved
    WHEN the worker polls Alpaca via GET /v2/orders/{id}
    THEN the worker receives the current status (e.g., FILLED, CANCELLED)
    AND updates the Order status in the DB

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (External Service Provider Risk) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (API calls to external service)
    - [ ] Manual PoR reporting requirement (Filled quantity from Alpaca is input)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Sequence Flow 3.1 (BE/Worker -> BR)
    - [ ] Uses Alpaca Paper Trading API v2 as specified
    - [ ] Integration logic implemented in Backend/Worker

*   **MVP-ID**: RAT-MVP-007
    **Title**: Integrate with Fireblocks Sandbox API for Custody Record & Mint Signing
    **As** <Agora Async Worker>
    **I Need** <To record custody proof and initiate the mint transaction signing>
    **To Achieve** <The custody acknowledgement leg and secure on-chain minting.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Async Worker] | [Sequence Flow 3.1, 3.3] | [External System: FireblocksSandbox]
    *Tech Stack*: Python HTTP Client/SDK | Celery

    **Acceptance Criteria (Gherkin)**
    1. GIVEN an Order status is FILLED
    WHEN the worker interacts with Fireblocks sandbox (POST /vault/deposit or equivalent mock)
    THEN a CustodyRecord is created in the DB with status=PENDING
    AND the Fireblocks response (custody_tx_id) updates the CustodyRecord status to COMPLETED
    2. GIVEN a CustodyRecord status is COMPLETED
    WHEN the worker initiates a transaction via Fireblocks API (POST /v1/transactions)
    THEN Fireblocks signs the mint transaction using the MPC vault key
    AND returns a transaction ID/status

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Custody of Assets) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (Custody data stored in DB)
    - [ ] Manual PoR reporting requirement (CustodyRecord is core PoR data)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Sequence Flow 3.1 (WRK -> CU) and 3.3 (BE -> CU)
    - [ ] Uses Fireblocks Sandbox API as specified
    - [ ] Integration logic implemented in Worker

*   **MVP-ID**: RAT-MVP-008
    **Title**: Integrate with L2 Testnet RPC for Minting & Status
    **As** <Agora Async Worker>
    **I Need** <To broadcast the signed mint transaction and confirm its status>
    **To Achieve** <The final token minting step on the blockchain.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Async Worker] | [Sequence Flow 3.1] | [External System: EthTestnet]
    *Tech Stack*: Python Web3.py | Celery | Standard Ethereum RPC (Infura/Alchemy/thirdweb/Scroll)

    **Acceptance Criteria (Gherkin)**
    1. GIVEN a signed mint transaction from Fireblocks
    WHEN the worker broadcasts the transaction via the RPC endpoint
    THEN a MintTx record is created in the DB with status=PENDING and tx_hash
    2. GIVEN a MintTx record exists
    WHEN the worker/monitor polls the RPC for the tx_hash status
    THEN upon confirmation, the MintTx status is updated to CONFIRMED in the DB

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Blockchain Interaction) clause mapping confirmed
    - [ ] KYC tier impact analysis (MintTx linked to order/user)
    - [ ] Data sovereignty annotation (N/A directly for public testnet)
    - [ ] Manual PoR reporting requirement (MintTx is core PoR data)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Sequence Flow 3.1 (WRK -> BC)
    - [ ] Uses Standard Ethereum RPC as specified
    - [ ] Integration logic implemented in Worker

**Feature: Smart Contracts**
*Description: Develop and deploy the minimal ERC-20 contract with minting logic.*

*   **MVP-ID**: RAT-MVP-009
    **Title**: Develop ERC-20 RAT Token Contract with Minting Logic
    **As** <Agora Smart Contract Engineer>
    **I Need** <A minimal, secure ERC-20 contract>
    **To Achieve** <The on-chain representation of the Real Asset Token for the MVP.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Smart Contracts] | [Sequence Flow 3.1] | [Tech Stack: Solidity, Hardhat/Foundry]
    *Tech Stack*: Solidity 0.8.x | ERC-20 Standard | Hardhat/Foundry

    **Acceptance Criteria (Gherkin)**
    1. GIVEN the contract is deployed
    WHEN the `mint(address to, uint256 amount, string brokerTradeId)` function is called by the authorized minter role
    THEN the `to` address receives `amount` tokens
    AND `totalSupply` increases by `amount`
    AND a `Transfer` event is emitted (0x0 -> `to`)
    AND the `brokerTradeId` is recorded/mapped to prevent replay attacks (using `setBrokerTx` or similar)
    2. GIVEN the contract is deployed
    WHEN a non-authorized address calls `mint`
    THEN the transaction reverts

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Token Standard Compliance) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (N/A directly for public testnet)
    - [ ] Manual PoR reporting requirement (TotalSupply is key PoR data point)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Container Diagram (Smart Contracts)
    - [ ] Uses ERC-20 Minimal with Replay Protection as specified
    - [ ] Implements `mint` signature from blueprint/BA pack

*   **MVP-ID**: RAT-MVP-010
    **Title**: Conduct External Smart Contract Audit (Pre-Testnet)
    **As** <Agora Security Lead>
    **I Need** <The RAT smart contract to be reviewed by a third party>
    **To Achieve** <Identification and mitigation of critical vulnerabilities before Testnet deployment.>

    **Technical Anchor**
    *Blueprint Reference*: [Security Plan 7] | [Initial Audit Plan] | [Smart Contracts]
    *Tech Stack*: N/A (External Process)

    **Acceptance Criteria (Gherkin)**
    1. GIVEN the `RATMintingContract.sol` code is finalized and frozen for audit
    WHEN the external audit firm completes their review
    THEN a formal audit report is delivered
    AND all critical and high-severity findings are addressed and verified by the auditor or internal team.

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Security Requirements) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (N/A directly)
    - [ ] Manual PoR reporting requirement (N/A directly)

    **Architectural Sign-Off**
    - [ ] Mandatory gate before Testnet deployment as per v0.5 Security Plan
    - [ ] Scope limited to `RATMintingContract.sol` core logic

**Feature: Observability**
*Description: Implement basic monitoring for the MVP flow.*

*   **MVP-ID**: RAT-MVP-011
    **Title**: Integrate OpenTelemetry/Grafana for Core Flow Metrics & Logging
    **As** <Agora DevOps/Engineer>
    **I Need** <Visibility into the performance and errors of the Buy->Mint flow>
    **To Achieve** <The ability to monitor the MVP's health and diagnose issues.>

    **Technical Anchor**
    *Blueprint Reference*: [Observability 10] | [Integration Report 5]
    *Tech Stack*: Grafana Cloud, OpenTelemetry SDK, Loki

    **Acceptance Criteria (Gherkin)**
    1. GIVEN the backend and worker services are running
    WHEN a user completes the Buy->Mint flow (or it fails)
    THEN logs are generated for each major step (Order Submitted, Alpaca Filled, Custody Confirmed, Mint Tx Sent, Mint Confirmed)
    AND these logs are discoverable in Grafana Loki
    AND core latency metrics (Order Latency, Custody Latency, Mint Latency) are visible in the Grafana dashboard
    AND alerts for critical failures (e.g., retry-exceeded) are configured (e.g., to Slack)

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Monitoring & Reporting) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (Log data storage location considered)
    - [ ] Manual PoR reporting requirement (Monitoring helps verify data flow)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Observability section
    - [ ] Uses Grafana Cloud + OpenTelemetry as specified

---

#### **Epic: User Value**
*Goal: Deliver a frictionless "Buy→Mint" experience for LATAM users within MVP constraints.*

**Feature: Frontend User Interface**
*Description: Build the Next.js interface for user interaction.*

*   **MVP-ID**: RAT-MVP-012
    **Title**: Build KYC-Light Onboarding Form UI
    **As** <LATAM Retail User>
    **I Need** <A simple form to submit my basic information>
    **To Achieve** <Completion of the KYC-light step.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Frontend] | [Sequence Flow 3.2] | [Tech Stack: Next.js, Wallet Connect]
    *Tech Stack*: Next.js | React Forms | Wallet Connect (for wallet address input)

    **Acceptance Criteria (Gherkin)**
    1. GIVEN I visit the application
    WHEN I initiate the onboarding flow
    THEN I see a form requesting Name, Email, Country (dropdown limited to BR/PY), and Tax ID (label changes based on country)
    AND I can connect my wallet via Wallet Connect
    AND upon submission, the data is sent to the backend `/onboard` endpoint

    **Regulatory Gates**
    - [ ] Seychelles VASP Article 4.2(b) compliance confirmed (UI collects required data)
    - [ ] KYC tier impact analysis (UI supports Tier 1 data collection)
    - [ ] Data sovereignty annotation (User informed of data collection?)
    - [ ] Manual PoR reporting requirement (N/A directly)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Sequence Flow 3.2 (User -> FE -> BE)
    - [ ] Uses Next.js and Wallet Connect as specified

*   **MVP-ID**: RAT-MVP-013
    **Title**: Build Single-Ticker (AAPL) Buy Order UI
    **As** <LATAM Retail User>
    **I Need** <To select AAPL and specify a quantity to buy>
    **To Achieve** <Initiation of the tokenization process.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Frontend] | [Sequence Flow 3.1] | [Tech Stack: Next.js]
    *Tech Stack*: Next.js | React Components

    **Acceptance Criteria (Gherkin)**
    1. GIVEN I am an APPROVED KYC-light user
    WHEN I navigate to the buy page
    THEN I see "AAPL" as the only selectable asset
    AND I can input a quantity (allowing fractional, minimum 0.01)
    AND I see an estimated price (fetched from backend/Alpaca)
    AND I can click a "Buy AAPL-RAT" button

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Product Disclosure) clause mapping confirmed (Asset info displayed)
    - [ ] KYC tier impact analysis (Buy button enabled only for APPROVED users)
    - [ ] Data sovereignty annotation (N/A directly)
    - [ ] Manual PoR reporting requirement (N/A directly)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Sequence Flow 3.1 (User -> FE)
    - [ ] Uses Next.js as specified

*   **MVP-ID**: RAT-MVP-014
    **Title**: Display Order Status and Mint Confirmation
    **As** <LATAM Retail User>
    **I Need** <To see the progress of my buy order and know when my tokens are minted>
    **To Achieve** <Transparency and confirmation of the transaction.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Frontend] | [Sequence Flow 3.1] | [Tech Stack: Next.js]
    *Tech Stack*: Next.js | WebSocket (optional) or Polling | React Components

    **Acceptance Criteria (Gherkin)**
    1. GIVEN I have placed a buy order
    WHEN the order status changes (PENDING -> FILLED -> CUSTODY_CONFIRMED -> MINT_CONFIRMED)
    THEN the UI updates to show the current status (e.g., "Order Processing", "Tokens Minting", "Tokens Minted!")
    2. GIVEN tokens are minted
    WHEN the MintTx is confirmed
    THEN the UI displays the mint transaction hash
    AND provides a link to the Testnet block explorer to view the transaction

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Transaction Confirmation) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (N/A directly)
    - [ ] Manual PoR reporting requirement (N/A directly)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 Sequence Flow 3.1 (BE -> FE -> User)
    - [ ] Uses Next.js as specified

*   **MVP-ID**: RAT-MVP-015
    **Title**: Display User's AAPL-RAT Balance (Read-Only)
    **As** <LATAM Retail User>
    **I Need** <To see how many AAPL-RAT tokens I hold>
    **To Achieve** <Visibility of my tokenized asset holdings.>

    **Technical Anchor**
    *Blueprint Reference*: [Container: Frontend, Backend API] | [External System: EthTestnet] | [API Spec 8]
    *Tech Stack*: Next.js | FastAPI Endpoint (`GET /api/v1/users/{user_id}/balance`) | Web3.py (backend)

    **Acceptance Criteria (Gherkin)**
    1. GIVEN I am logged in
    WHEN I view my dashboard/profile
    THEN I see my current AAPL-RAT balance on the selected Testnet (fetched via backend or direct RPC query)

    **Regulatory Gates**
    - [ ] Seychelles VASP Article X (Client Reporting) clause mapping confirmed
    - [ ] KYC tier impact analysis (N/A directly)
    - [ ] Data sovereignty annotation (N/A directly for public blockchain data)
    - [ ] Manual PoR reporting requirement (N/A directly)

    **Architectural Sign-Off**
    - [ ] Aligns with v0.5 API Spec 8
    - [ ] Uses Next.js and Backend API as specified

---

#### **Critical Dependencies / Pre-Sprint Tasks:**

*   **TASK**: Finalize and get sign-off on Manual PoR Report Template (Compliance/BA)
*   **TASK**: Secure Alpaca Paper & Fireblocks Sandbox API Keys (DevOps/Architect)
*   **TASK**: Setup Secrets Management for API Keys (DevOps/Architect)
*   **TASK**: Deploy RAT Smart Contract Stub to Sepolia Testnet (Smart Contract Engineer)
*   **TASK**: Configure Testnet RPC Endpoint and Contract Address in Backend/Worker Config (DevOps/Engineer)
*   **TASK**: Define and document Testnet Deployment Plan (DevOps/Architect)
*   **TASK**: **MANDATORY**: Complete External Smart Contract Audit for `RATMintingContract.sol` (Security/Smart Contract Engineer) - **This blocks Testnet deployment.**

---

This backlog provides a solid starting point, mapping our requirements and technical plan to actionable user stories and tasks. We will refine these stories in grooming sessions, adding more detailed technical acceptance criteria, effort estimates, and confirming the specific regulatory clauses for each item.

Let's ensure we stay laser-focused on this MVP scope and avoid the anti-patterns listed in the handbook. Our priority is delivering a compliant, working "Buy→Mint" loop on testnet.

Ready to discuss and refine!