
**Document Title:** Agora PoC MVP Requirements: Asset Purchase & RAT Minting

**Version:** 1.0

**Date:** 2025-04-25

**Author:** Business Analyst (Gemini)

**1. Core MVP Requirements**

The primary goal of this PoC MVP is to demonstrate the core mechanism: A user initiates a purchase of a specific Real-World Asset (RWA), the system executes the purchase via a broker, confirms custody, and mints a corresponding 1:1 asset-backed token (RAT) to a platform-managed user wallet, with the platform sponsoring the gas fees for minting.

  * **Core User Journey:**

    1.  **Initiation:** A pre-identified test user accesses a minimal UI and indicates intent to purchase 1 unit of the designated asset (e.g., AAPL).
    2.  **Execution:** The Agora backend system receives the request and places a market buy order for 1 unit of the underlying asset (AAPL) via the designated Broker API (Alpaca).
    3.  **Settlement & Custody:** The system monitors (or receives notification) for trade settlement and confirmation from the designated Custodian (Fireblocks) that 1 unit of AAPL is secured in Agora's omnibus custody account.
    4.  **Minting:** Upon custody confirmation, the Agora backend triggers the minting function on the designated RAT Smart Contract (e.g., AAPL-RAT on Sepolia testnet).
    5.  **Token Delivery:** The smart contract mints 1 AAPL-RAT token directly to the user's platform-managed wallet address. The backend sponsors the gas fee for this transaction.
    6.  **Confirmation:** The minimal UI displays a confirmation message to the user, indicating the RAT has been minted (potentially including the transaction hash).

  * **Inputs, Outputs, and Basic Business Rules:**

    | Step                 | Inputs                                                                 | Outputs                                                                   | Basic Business Rules (MVP)                                                                                                                                                              |
    | :------------------- | :--------------------------------------------------------------------- | :------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
    | **1. Initiation** | User Identifier (e.g., Test User Email), Asset Ticker (Fixed: 'AAPL'), Quantity (Fixed: 1) | Purchase Request Confirmation (UI Message)                                | - Only pre-defined test users allowed. \<br\> - Only designated asset ('AAPL') selectable. \<br\> - Quantity fixed at 1 unit. \<br\> - UI is extremely basic (e.g., single button).                 |
    | **2. Execution** | Asset Ticker ('AAPL'), Quantity (1), Side ('buy'), Order Type ('market') | Broker Order ID, Execution Status (e.g., 'filled')                        | - Use pre-configured Broker API keys. \<br\> - Execute as a market order. \<br\> - Handle basic API success/failure response from Broker.                                                     |
    | **3. Settlement** | Broker Order ID (for tracking/correlation)                             | Settlement Confirmation Signal, Custody Confirmation Signal                   | - Settlement timeframe assumed (e.g., T+1/T+2). \<br\> - **Crucial:** Need confirmation from Custodian (Fireblocks) that the *specific asset* (1 AAPL) is received and secured. Mechanism TBD (Webhook/Polling/Manual Sim). |
    | **4. Minting Trigger** | Custody Confirmation, User's Managed Wallet Address, Quantity (1)      | Smart Contract Mint Transaction Request                                   | - Minting is triggered *only* after successful custody confirmation. \<br\> - Backend holds/retrieves the user's associated managed wallet address.                                    |
    | **5. Token Delivery** | Target Wallet Address, Quantity (1), Gas Fee Payment                     | Mint Transaction Hash, Mint Success/Failure Status                            | - Backend uses its authorized address ('Minter Role') to call the smart contract. \<br\> - Backend pays gas fees using a pre-funded wallet. \<br\> - Target wallet is managed by the platform. |
    | **6. Confirmation** | Mint Transaction Hash, Success Status                                    | Final Confirmation Message (UI), Log entry                                | - Display success message on UI. \<br\> - Optionally display Etherscan link to Tx Hash.                                                                                                   |

  * **Essential Data Elements:**

      * `PoCUserID`: Identifier for the test user.
      * `UserManagedWalletAddress`: Blockchain address managed by Agora backend, associated with `PoCUserID`, where RAT is delivered.
      * `AssetTicker`: Ticker symbol of the target asset (Fixed: 'AAPL').
      * `OrderQuantity`: Quantity to purchase (Fixed: 1).
      * `BrokerOrderID`: Unique identifier returned by Broker API upon order placement.
      * `BrokerOrderStatus`: Status from Broker API (e.g., `new`, `filled`, `canceled`).
      * `CustodianConfirmationStatus`: Flag indicating asset received and secured by Custodian (e.g., `received`, `pending`).
      * `MintingTransactionHash`: Transaction hash of the successful RAT minting on the blockchain.
      * `MintingStatus`: Status of the minting process (e.g., `pending`, `submitted`, `confirmed`, `failed`).
      * `Timestamp`: Records for key events (request, execution, settlement confirmation, minting).

**2. MVP Feature Scope**

  * **IN SCOPE (Must-Haves for PoC):**

      * **Minimal User Interface:** A web page or simple script allowing a pre-defined test user to trigger the purchase/minting flow for 1 unit of 'AAPL'.
      * **Backend Orchestration Service:** Core logic to manage the sequence: UI request -\> Broker API call -\> Monitor/Receive Settlement/Custody Confirmation -\> Trigger Smart Contract Mint -\> Handle Gas Sponsorship -\> Update Status.
      * **Broker Integration (Alpaca):** Basic integration to place a market buy order for 1 AAPL share using API keys stored securely in the backend. Handle basic success/error responses.
      * **Custodian Integration (Fireblocks):** Basic integration to receive confirmation that 1 AAPL share has been deposited into the designated Agora custody vault. The exact mechanism (webhook listener, API polling, simulated trigger) needs confirmation based on Fireblocks sandbox capabilities and PoC constraints.
      * **RAT Smart Contract (ERC-20):** A standard ERC-20 contract deployed on a testnet (e.g., Sepolia) for 'AAPL-RAT'. Must include a `mint` function restricted to an authorized address (the backend Minter).
      * **Platform-Managed Wallet:** Simple backend mechanism to associate a blockchain address with each test user for receiving the minted RAT (e.g., using Fireblocks Non-Custodial Wallets (NCW) or generating/managing keys *securely* via a KMS for the PoC scope). User does *not* manage keys.
      * **Gas Sponsorship Mechanism:** Backend logic and pre-funded wallet to pay for the gas fees associated with the `mint` transaction on the testnet.
      * **Basic Status Feedback:** Display simple status updates on the minimal UI (e.g., "Processing", "Order Filled", "Awaiting Settlement", "Minting Token", "Success - Token Minted [TxHash]").

  * **OUT OF SCOPE (Explicitly Deferred):**

      * User Onboarding/Authentication (Use pre-defined test users).
      * KYC/AML Procedures.
      * Support for multiple assets, variable quantities, or different order types (limit, stop).
      * Real-time price feeds or market data display.
      * User portfolio views, transaction history dashboards.
      * **RAT Redemption/Burning:** The reverse flow (selling RAT -\> burning token -\> selling RWA) is not part of this PoC.
      * Secondary market trading or transfers of RATs between users.
      * Complex fee structures (assume zero user fees for PoC).
      * Advanced error handling for all edge cases (focus on the "happy path").
      * Production-grade security, logging, monitoring, alerting.
      * Regulatory compliance features or reporting.
      * Mainnet deployment or readiness.
      * User control over private keys or connection of external wallets (e.g., MetaMask).
      * Fiat on/off ramps.
      * Sophisticated reconciliation logic between broker and custodian records.

**3. MVP Process Flow**

```mermaid
sequenceDiagram
    participant User
    participant Minimal_UI
    participant Agora_Backend
    participant Broker_API (Alpaca)
    participant Custodian_API (Fireblocks)
    participant RAT_Smart_Contract (Testnet)
    participant Blockchain (Testnet)

    User->>Minimal_UI: Initiate Purchase (1 AAPL)
    Minimal_UI->>Agora_Backend: POST /requestPurchase (UserEmail, Asset=AAPL, Qty=1)
    activate Agora_Backend
    Agora_Backend->>Broker_API (Alpaca): POST /v2/orders (symbol=AAPL, qty=1, side=buy, type=market)
    activate Broker_API
    Broker_API-->>Agora_Backend: Response (OrderID, Status=new/pending)
    deactivate Broker_API
    Agora_Backend-->>Minimal_UI: Update Status: "Order Submitted"

    %% Broker Execution & Settlement Occurs (External/Async) %%
    Broker_API-)Agora_Backend: Webhook/Poll Response: Order Status Update (OrderID, Status=filled)
    note right of Agora_Backend: Settlement T+1/T+2 Starts

    %% Custodian Confirmation (Mechanism TBD - Webhook/Poll/Simulated) %%
    Custodian_API (Fireblocks) -->> Agora_Backend: POST /webhook/custodyConfirmation (Asset=AAPL, Qty=1, Status=Confirmed)
    activate Custodian_API
    deactivate Custodian_API
    note right of Agora_Backend: Confirmed 1 AAPL secured in custody!
    Agora_Backend->>Agora_Backend: Retrieve UserManagedWalletAddress for UserEmail
    Agora_Backend->>Blockchain (Testnet): Prepare Mint Transaction (To: UserManagedWalletAddress, Amount: 1) with Gas Sponsorship
    activate Blockchain

    Agora_Backend->>RAT_Smart_Contract (Testnet): execute mint(UserManagedWalletAddress, 1)
    activate RAT_Smart_Contract
    RAT_Smart_Contract-->>Blockchain (Testnet): Emit Transfer Event
    RAT_Smart_Contract-->>Agora_Backend: Mint Success
    deactivate RAT_Smart_Contract
    Blockchain (Testnet)-->>Agora_Backend: Transaction Confirmation (TxHash)
    deactivate Blockchain

    Agora_Backend-->>Minimal_UI: Update Status: "Success - Token Minted", TxHash
    deactivate Agora_Backend
    User->>Minimal_UI: View Confirmation Message & TxHash


```

**4. Smart Contract Functional Requirements (for Handover)**

  * **Contract Standard:** ERC-20 Compliant Token.
  * **Network:** Ethereum Testnet (e.g., Sepolia).
  * **Core Functionality:**
      * `constructor(string memory name, string memory symbol)`: Initialize token name (e.g., "Agora Apple RAT"), symbol (e.g., "AAPL-RAT"), decimals (e.g., 18 or match underlying asset if fractional).
      * `mint(address to, uint256 amount)`:
          * **Access Control:** MUST be restricted. Only callable by a designated "Minter" address (controlled by the Agora Backend). Use `Ownable` pattern or specific Minter Role.
          * **Action:** Increases `totalSupply` by `amount` and increases the balance of the `to` address by `amount`.
          * **Trigger:** Called by the Agora Backend upon confirmed custody of the underlying asset.
          * **Input Data:** Recipient address (`to` = User's Managed Wallet Address), `amount` (corresponding to the quantity of the settled asset, fixed at 1 for PoC adjusted for decimals).
      * Standard ERC-20 View Functions: `name()`, `symbol()`, `decimals()`, `totalSupply()`, `balanceOf(address owner)`, `allowance(address owner, address spender)`.
      * Standard ERC-20 Transfer Functions: `transfer(address recipient, uint256 amount)`, `approve(address spender, uint256 amount)`, `transferFrom(address sender, address recipient, uint256 amount)` (While secondary transfers are out of scope for the *flow*, including standard functions makes it a valid ERC-20 for viewing in explorers/wallets).
  * **Out of Scope Functionality for PoC Contract:** `burn` or redemption logic.

**5. Key Integration Points & Requirements**

  * **Agora Backend \<-\> Broker API (Alpaca - Sandbox)**
      * **Authentication:** Secure storage and use of Alpaca API Key & Secret Key by the backend.
      * **API Call:** `POST /v2/orders` to place a market buy order for 1 AAPL.
      * **Data Needed from Broker:** Order ID (for tracking), Confirmation of successful order placement, Confirmation of order execution ('filled' status).
      * **Settlement Confirmation Dependency:** Define how the backend determines settlement *leading to* custody. Is there an Alpaca status/webhook, or is confirmation solely reliant on the Custodian? **Clarification needed.** For PoC, may need to *assume* 'filled' implies eventual settlement and wait for Fireblocks.
  * **Agora Backend \<-\> Custodian API (Fireblocks - Sandbox)**
      * **Authentication:** Secure storage and use of Fireblocks API Key & Credentials by the backend.
      * **Core Requirement:** Detect/Receive confirmation that 1 unit of AAPL, linked conceptually to the Alpaca trade, has arrived in the designated Fireblocks vault.
      * **Potential Mechanism:**
          * Listen to Fireblocks webhooks for incoming transactions to the vault.
          * Periodically poll Fireblocks API for vault balance changes or transaction history.
          * *PoC Simplification:* A manual trigger or simulated callback confirming custody might be acceptable if direct sandbox integration proves too complex/unreliable for the PoC timeline.
      * **Data Needed from Custodian:** Confirmation event/status including Asset Type ('AAPL'), Quantity (1), Target Vault ID, and Status ('COMPLETED'/'CONFIRMED'). Need a way to correlate this back to the initiating user request (perhaps via internal reference ID passed through, or simple time/asset/quantity matching for PoC).
  * **Agora Backend \<-\> RAT Smart Contract (Testnet)**
      * **Authentication:** Backend must control the private key of the authorized "Minter" address. Use secure key management (e.g., KMS, Fireblocks API Co-Signer if applicable).
      * **API Call:** Interact with the testnet via an RPC node (e.g., Infura, Alchemy) to send a signed transaction calling the `mint` function.
      * **Gas Funding:** The "Minter" wallet must be pre-funded with sufficient testnet ETH.
      * **Data Needed from Blockchain:** Transaction Hash, Confirmation of transaction success (receipt).

**6. MVP Acceptance Criteria**

  * **AC1:** A test user can trigger the AAPL purchase flow via the minimal UI.
  * **AC2:** The Agora backend successfully places a market buy order for 1 AAPL via the Alpaca sandbox API, and the order status eventually shows as 'filled'.
  * **AC3:** The Agora backend correctly receives or simulates the confirmation from Fireblocks sandbox API that 1 AAPL is secured in the designated vault.
  * **AC4:** Upon Fireblocks confirmation, the backend successfully constructs, signs, and broadcasts a `mint` transaction to the AAPL-RAT smart contract on the specified testnet.
  * **AC5:** The backend's designated wallet successfully pays the gas fee for the mint transaction.
  * **AC6:** The mint transaction is confirmed on the testnet blockchain.
  * **AC7:** Using a testnet block explorer (e.g., Sepolia Etherscan), 1 AAPL-RAT token (adjusted for decimals) is visible in the balance of the correct platform-managed user wallet address.
  * **AC8:** The minimal UI displays a final success message, including the minting transaction hash.

**7. MVP-Specific Risks**

  * **R1: Broker/Custodian Sandbox Unreliability:** Downtime, bugs, or limited functionality in Alpaca or Fireblocks sandbox environments impeding integration testing. (Mitigation: Contingency planning, mock servers for isolated testing, flexible demo scheduling).
  * **R2: Settlement/Custody Confirmation Latency:** Difficulty in getting timely and reliable confirmation triggers from sandbox environments, potentially requiring manual steps or simulation for the PoC demo. (Mitigation: Design for async flow, clearly define PoC simulation steps if needed).
  * **R3: Testnet Issues:** Ethereum testnet (e.g., Sepolia) congestion, downtime, or faucet unavailability impacting deployment and testing. (Mitigation: Have backup testnet options, pre-fund gas wallet generously).
  * **R4: Gas Sponsorship Failure:** Running out of testnet ETH in the sponsoring wallet or errors in the gas payment logic. (Mitigation: Monitor gas wallet balance, robust error handling around transaction submission).
  * **R5: Integration Mismatch:** Discrepancies between assumed API behavior and actual sandbox API behavior for Alpaca or Fireblocks. (Mitigation: Early integration spike/testing, close communication with dev team).
  * **R6: Wallet Management Complexity:** Even simple backend wallet management for the PoC requires careful handling of keys/security. (Mitigation: Use established service like Fireblocks NCW if possible, otherwise minimal secure implementation with clear PoC caveats).
  * **R7: Correlation Logic Failure:** Difficulty reliably linking the initial user request -\> Alpaca trade -\> Fireblocks deposit -\> Minting operation in the PoC context. (Mitigation: Use internal IDs, simplify matching logic for PoC, document assumptions).

**8. Communication**

This document outlines the minimal requirements for the Agora PoC MVP focused on demonstrating the core purchase-to-minting loop with wallet-less onboarding and gas sponsorship. It defines the essential features, process flow, integration points, smart contract needs, acceptance criteria, and risks specifically for this PoC build. This should serve as the primary input for the Product Manager, Architect, and Product Owner to scope and plan the development sprints for this specific initiative. Future features and complexities are explicitly deferred.


