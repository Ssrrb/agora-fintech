Okay Front-End team (Next.js experts!),

Based on the excellent Product Backlog provided by our PO, focusing on delivering the core user value for the RAT MVP within our regulatory and technical framework, here are 5 potential tasks derived directly from the User Stories.

Remember, during Sprint Planning, *you* as the Development Team will discuss these, refine them, break them down further if needed, estimate them, and decide which ones you can commit to pulling into the Sprint Backlog to meet the Sprint Goal. My role is to facilitate this process, not assign work.

These suggestions are based on stories **RAT-MVP-012, RAT-MVP-013, RAT-MVP-014, and RAT-MVP-015**:

---

**Potential Front-End Tasks for Sprint Planning Consideration:**

1.  **Task Suggestion (from RAT-MVP-012): Implement KYC-Light Form UI Components**
    *   **Goal:** Create the reusable Next.js components for the KYC onboarding form.
    *   **Potential Steps:** Build input fields for Name, Email, Country (Dropdown: BR/PY only), and Tax ID (with dynamic label based on country). Ensure basic structure and styling according to any available mockups/design guidelines. Focus on the UI elements themselves, initially without backend integration.
    *   **Dependencies:** Design mockups/guidelines (if available).

2.  **Task Suggestion (from RAT-MVP-012): Integrate Wallet Connect for Address Input**
    *   **Goal:** Allow users to connect their wallet to populate the wallet address field during KYC onboarding.
    *   **Potential Steps:** Add the Wallet Connect library/provider to the Next.js app. Implement the "Connect Wallet" button logic. Ensure the connected wallet address is captured and potentially displayed (or stored in component state) for form submission.
    *   **Dependencies:** Wallet Connect library setup, understanding of how the address needs to be passed to the backend (from RAT-MVP-012 AC).

3.  **Task Suggestion (from RAT-MVP-013): Build Static Buy Order UI**
    *   **Goal:** Create the visual layout for the single-ticker (AAPL) buy order page.
    *   **Potential Steps:** Develop the Next.js component structure. Display "AAPL" prominently. Add an input field for quantity (allowing decimals, potentially enforcing min 0.01 via basic validation). Include placeholders for estimated price and the "Buy AAPL-RAT" button. Focus on the static layout and elements first.
    *   **Dependencies:** Design mockups/guidelines (if available). Clarity on how the estimated price will eventually be fetched (API endpoint needed from Backend).

4.  **Task Suggestion (from RAT-MVP-014): Develop Order Status Display Component Shell**
    *   **Goal:** Create the UI component responsible for showing the user the status of their ongoing buy/mint order.
    *   **Potential Steps:** Design and build a reusable React component that can visually represent different states (e.g., "Processing", "Tokens Minting", "Complete"). Include placeholders for the transaction hash and block explorer link. Initially, this can be driven by mock data or component props.
    *   **Dependencies:** Design mockups/guidelines. Understanding of the distinct statuses the backend will provide (PENDING, FILLED, CUSTODY_CONFIRMED, MINT_CONFIRMED).

5.  **Task Suggestion (from RAT-MVP-015): Implement User Balance Display Component**
    *   **Goal:** Create the UI element to show the user's current AAPL-RAT token balance.
    *   **Potential Steps:** Build a simple Next.js component (e.g., for a dashboard or profile area). Implement the visual display for the token balance. Initially, this can display a static value or fetch from a *mocked* backend endpoint until the real `GET /api/v1/users/{user_id}/balance` endpoint (RAT-MVP-015) is available.
    *   **Dependencies:** Design mockups/guidelines. Clarity on where this component will live in the user flow. Backend endpoint `GET /api/v1/users/{user_id}/balance` (RAT-MVP-015) will be needed for real data later.

---

**Next Steps in Sprint Planning:**

*   We will discuss these stories and potential tasks together.
*   You will clarify requirements with the PO/BA if needed.
*   You will break these down further into the specific technical steps *you* see necessary.
*   You will estimate the effort (e.g., using Story Points).
*   You will select the work you are confident you can complete this Sprint to contribute to the Sprint Goal.

Let's get ready for a productive Sprint Planning session! My job is to help you clear any roadblocks and ensure you have everything you need.