# Cosmic Exodus Hackathon 2022 Moralis Contracts

## Testing and Local Development

This project requires `node@>=14` and some environment variables should be defined in your `.env` file (copy [`.env.example`](.env.example) template):

* [Alchemy](https://alchemyapi.io/) API keys for RPC gateways:
  * **POLYGON_ALCHEMY_API_KEY** used for Polygon RPC;
  * **MUMBAI_ALCHEMY_API_KEY** used for Polygon testnet RPC;
  * **ETHEREUM_ALCHEMY_API_KEY** for Ethereum RPC;
  * and **GOERLI_ALCHEMY_API_KEY** for Ethereum testnet RPC;
* Network Explorers:
  * A API key for [Polygonscan](https://polygonscan.com/): **POLYGONSCAN_API_KEY**;
  * And a key for [Etherscan](https://etherscan.io/): **ETHERSCAN_API_KEY**;
* Finally a private key for administration of smart contracts: **WALLET_PRIVATE_KEY** (used as signer and deployer).

### Install dependencies

`yarn`

### Compile contracts

`yarn compile`

### Run tests

`yarn test`

### Run linter

`yarn lint`

### Run tasks and scripts

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat clean
npx hardhat collections:deploy --network mumbai
```

To run run scripts, try this:

```shell
npx hardhat node
npx ts-node scripts/sample-script.ts
```

To check all available tasks run `npx hardhat help` on terminal.


## Dependencies

* [@optionality.io/clone-factory](https://github.com/optionality/clone-factory)
