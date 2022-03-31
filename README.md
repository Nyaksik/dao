# DAO contract Project

# Link

- **[Link to the DAO](https://rinkeby.etherscan.io/address/0x2e4a4a48705c2B40D8200Af7b61c0b1A0cF5EECE)** Rinkeby testnet)
- **[Link to the tokenERC20](https://rinkeby.etherscan.io/address/0xE7C784ae1F7F2d5b75d24229Fde0cF3539f1c7E4)** (Rinkeby testnet)
- **[Link to the calldata](https://rinkeby.etherscan.io/address/0x86fCBD9E42fB1448143eda1A9c13Bd02012aF4F7)** (Rinkeby testnet)

# Basic commands

## Use it to compile the contract

```TypeScript
npx hardhat clean && npx hardhat compile
// or
npm run compile
```

## Use it to deploy the contract locally

```TypeScript
npx hardhat run scripts/deploy.ts --network localhost
// or
npm run local
```

## Use it to deploy the contract in the rinkeby test network

```TypeScript
npx hardhat run scripts/deploy.ts --network rinkeby
// or
npm run rinkeby
```

## Use it to test

```TypeScript
npx hardhat test
// or
npm run test
```

## Use it to view the test coverage

```TypeScript
npx hardhat coverage
// or
npm run coverage
```

## Use it to view global options and available tasks

```TypeScript
npx hardhat help
// or
npm run help
```

# Basic task

## deposit

**Use to make a deposit**

```TypeScript
npx hardhat deposit --amount [DEPOSIT_AMOUNT] --network [NETWORK]
```

## add

**Use to make a proposal**

```TypeScript
npx hardhat proposal --calldata [CALLDATA] --descr [DESCRIPTION] --network [NETWORK]
```

## vote

**Use to vote**

```TypeScript
npx hardhat vote --id [PROPOSAL_ID] --amount [VOTING_AMOUNT] --decision [DECISION] --network [NETWORK]
```

## finish

**Use to finish voting**

```TypeScript
npx hardhat finish --id [PROPOSAL_ID] --network [NETWORK]
```
