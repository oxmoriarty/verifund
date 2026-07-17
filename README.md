# Verifund

Verifund is an autonomous Retroactive Public Goods Funding (RPGF) platform built entirely on GenLayer Intelligent Contracts. 

It leverages GenLayer's built-in non-deterministic execution to scrape the web and use consensus-driven LLMs to dynamically evaluate, score, and rank public goods projects—completely trustlessly.

## Project Structure
- `contracts/` - GenLayer Intelligent Contracts written in Python.
- `tests/` - Direct and integration tests for contract logic.
- `deploy/` - Scripts for deploying contracts to GenLayer networks.
- `frontend/` - Next.js React frontend for user interactions.

## Prerequisites
- Node.js >= 18
- Python >= 3.10
- [GenLayer CLI](https://docs.genlayer.com)

## Quick Start

### 1. Run Tests
You can run the direct unit tests or the integration tests using the `gltest` suite:
```bash
gltest tests/direct/ -v
gltest tests/integration/ -v --network bradbury
```

### 2. Deploy Contract
To deploy the RPGF contract to the Bradbury testnet:
```bash
genlayer deploy --network bradbury
```
*Note: Make sure to copy the deployed `0x...` contract address.*

### 3. Run Frontend
Navigate into the `frontend/` directory, set up your `.env`, and run the development server:
```bash
cd frontend
npm install
npm run dev
```

Paste your newly deployed contract address into `frontend/.env` under `NEXT_PUBLIC_CONTRACT_ADDRESS` to interact with your live contract.
