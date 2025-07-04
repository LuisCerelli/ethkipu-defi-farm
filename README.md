# Project: Simple DeFi Yield Farming

## ✨ Overview

This project implements a simplified version of a **Yield Farming (Token Farm)** system, inspired by platforms like PancakeSwap. It uses three smart contracts written in Solidity:

* `LPToken.sol`: Liquidity Provider (LP) token, the asset users deposit into the Farm.
* `DAPToken.sol`: Platform token (DAPP), distributed as a reward.
* `FarmProportionalBonus.sol`: Main Farm contract, where staking, reward distribution, and withdrawals occur.

The system follows the goals and bonus features defined by the "Simple DeFi Yield Farming" exercise.

---

## 📂 Contracts

### `LPToken.sol`

ERC20 contract representing the LP token. Includes:

* Name: "LP Token"
* Symbol: "LP"
* `mint(address, uint256)` function accessible by the owner

> This is the token users deposit into the `FarmProportionalBonus` contract for staking.

---

### `DAPToken.sol`

ERC20 contract representing the reward token of the platform. Includes:

* Name: "DApp Token"
* Symbol: "DAP"
* `mint(address, uint256)` function accessible by the owner

> This token is used as a staking reward. The Farm contract receives a balance of DAPP previously minted by the owner for distribution.

---

### `FarmProportionalBonus.sol`

Main Farm contract:

* Allows users to:

  * Deposit LP tokens (`deposit()`)
  * Withdraw LP tokens (`withdraw(uint256)`)
  * Claim accumulated rewards (`claimRewards()`)
* Allows the owner to:

  * Change the reward per block (`setRewardPerBlock()`)
  * Set the withdrawal fee (`setWithdrawalFee()`)
  * Withdraw accumulated fees (`withdrawTreasury()`)
  * Distribute rewards globally (`distributeRewardsAll()`)

#### Structure

* `struct Staker`: includes `amount`, `rewardDebt`, `lastBlock`
* `mapping(address => Staker) public stakers`
* `uint256 rewardPerBlock`, `uint256 withdrawalFee`, `uint256 treasury`

#### Implemented Bonus Features

* ✅ **Bonus 1: Modifiers**

  * `onlyStaker`: validates if user is staking
  * `onlyOwner`: contract owner

* ✅ **Bonus 2: Struct**

  * Mappings replaced by a `Staker` struct

* ✅ **Bonus 3: Complete unit testing**

* ✅ **Bonus 4: Variable rewards**

  * `rewardPerBlock` can be updated

* ✅ **Bonus 5: Withdrawal fee**

  * Fee collected on `claimRewards`, stored in `treasury`

---

## ✅ Tests Performed (`FarmProportionalBonus.test.ts`)

The tests were written using Hardhat + Ethers v6 and cover the following scenarios:

1. ✅ **Mint LP tokens and deposit**

   * Tests `mint()` and `deposit()`
   * Verifies LP tokens are transferred to the Farm

2. ✅ **Proportional reward distribution**

   * Uses `evm_mine()` to simulate block mining
   * Compares `rewardDebt` between users

3. ✅ **Claiming rewards**

   * Mints DAPP tokens to the contract
   * Verifies `claimRewards()` transfers tokens and updates `rewardDebt`

4. ✅ **Withdraw LP while keeping rewards**

   * Tests `withdraw(uint256)`
   * Verifies LP tokens are returned and rewards remain claimable

---

## 🔁 Available Scripts (`/scripts`)

These TypeScript scripts automate common tasks for development, testing, and deployment of the Token Farm.

| File                          | Description                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| `deploy.ts`                   | Deploys `LPToken`, `DAPToken`, and `FarmProportionalBonus` to local network.              |
| `deploy_farm_proportional.ts` | Deploys only `FarmProportionalBonus`. Useful if you already have tokens deployed.         |
| `mint.ts`                     | Mints LP tokens to a specific address.                                                    |
| `mint_and_deposit.ts`         | Mints LP tokens and deposits them into the Farm in a single operation.                    |
| `mint_dap_to_farm.ts`         | Mints DAPP tokens and transfers them to the `FarmProportionalBonus` contract for rewards. |
| `claim_and_withdraw.ts`       | Allows a user to claim rewards and withdraw their staking.                                |
| `balance.ts`                  | Displays LP and DAPP balances for a specific address.                                     |

### 🛠 Usage (example)

```bash
npx hardhat run scripts/mint_and_deposit.ts --network localhost
```

> 📌 Tip: You can easily modify these scripts to use Sepolia, Goerli or other testnets.

---

## 💡 How to Use

### 1. Clone and install dependencies

```bash
npm install
```

### 2. Compile contracts

```bash
npx hardhat compile
```

### 3. Run tests

```bash
npx hardhat test
```

### 4. Local deployment (optional)

```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

---
## 🌐 Web Interface (Frontend)

A simple **React + ethers.js** interface (no extra libraries) was developed to easily interact with the `FarmProportionalBonus` contract deployed on the **Sepolia** network.

### 🧩 Available Features

From the browser, a user can:

* ✅ Connect their Metamask wallet
* ✅ View their LP and DAPP token balances
* ✅ Deposit 50 LP tokens
* ✅ Withdraw 50 LP tokens
* ✅ Claim generated rewards
* ✅ Check pending rewards

### 🗂 Frontend Structure

* Folder: `/token-farm-frontend`
* Main file: `App.tsx`
* Contracts: ABIs of `FarmProportionalBonus`, `LPToken`, and `DAPToken` are located in the `/abi` folder
* Contract addresses: read from `deployed_addresses.json`

### 🚀 Instructions to run the frontend

```bash
cd token-farm-frontend
npm install
npm run dev
```

> Make sure your Metamask is connected to Sepolia and has enough funds to interact with the contracts.

---

## 📅 Reference Links

* PancakeSwap Docs: [https://docs.pancakeswap.finance/products/yield-farming/how-to-use-farms](https://docs.pancakeswap.finance/products/yield-farming/how-to-use-farms)
* OpenZeppelin ERC20: [https://docs.openzeppelin.com/contracts/4.x/api/token/erc20](https://docs.openzeppelin.com/contracts/4.x/api/token/erc20)

---

## ✉ Author

**Luis Alberto Cerelli**
Project developed as part of the Ethereum/Web3 course - ETH-KIPU.
