# Full-Stack Ethereum Project

This project demonstrates a full-stack Ethereum application with smart contracts and a web frontend.

## Project Structure

- `contracts/`: Contains all smart contract related files
  - `src/`: Solidity source files
  - `scripts/`: Deployment and interaction scripts
  - `test/`: Contract test files
  - `ignition/`: Hardhat Ignition modules
  - `hardhat.config.js`: Hardhat configuration file
- `webapp/`: Contains the web application (frontend)

## Smart Contracts

The `contracts/` directory contains a Hardhat project with sample contracts (ERC20, ERC721, ERC1155, and Lock), tests for those contracts, and a script that deploys the contracts.

### Getting Started with Smart Contracts

1. Navigate to the `contracts/` directory:

   ```
   cd contracts
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Run Hardhat commands:
   ```
   npx hardhat help
   npx hardhat test
   REPORT_GAS=true npx hardhat test
   npx hardhat node
   npx hardhat run scripts/deploy.js
   ```

### Deploying Contracts

To deploy the contracts to a local network:

1. Start a local Hardhat node:

   ```
   npx hardhat node
   ```

2. In a new terminal, deploy the contracts:
   ```
   npx hardhat run scripts/deploy.js --network localhost
   ```

## Web Application

The `webapp/` directory is prepared for your web application. You can use any frontend framework of your choice (e.g., React, Vue, Angular) to build your dApp interface.

(Add more instructions for the web application as you develop it)
