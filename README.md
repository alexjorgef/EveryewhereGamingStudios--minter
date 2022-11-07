# Cosmic Exodus Hackathon 2022 Moralis Contracts

This project requires `node@>=16` and have support to `ethereum`, `goerli`, `polygon`, `mumbai` and `hardhat` networks.

Dependencies:

* [@optionality.io/clone-factory](https://github.com/optionality/clone-factory)

Contracts:

* CosmicNFT: 0x280AcF5d5121bbBC276bB5Ada57C5564Dc296862
* Marketplace: 0xF3fF34d0A8ddF4e681eb84E05B294242cd99C0B6

## Testing and Local Development

* Install dependencies: `yarn`
* Compile contracts: `yarn compile`
* Run tests: `yarn test`
* Run linter: `yarn lint`
* Run formatter: `yarn format`
* Check contracts size: `yarn size`
* Hardhat commands
  * Run Hardhat tasks and scripts:
    * Print accounts: `npx hardhat accounts`
    * Clean cache: `npx hardhat clean`
    * Run contracts specific tasks (make sure you append `--network <NETWORK_NAME>`):
      * Collection: `npx hardhat collection:<TASK_NAME>`
        * Deploy: `npx hardhat collection:deploy`
      * Marketplace: `npx hardhat marketplace:<TASK_NAME>`
        * Deploy: `npx hardhat marketplace:deploy`
  * Run local server: `npx hardhat node`
  * Give flatten contracts: `npx hardhat flatten ./contracts/<CONTRACT_NAME>.sol | clipcopy`
  * To check all available tasks: `npx hardhat help`
* Run a script: `npx ts-node scripts/sample-script.ts` (you need to have a Hardhat local server listening)

Some environment variables should be defined in your `.env` file (copy [`.env.example`](.env.example) template):

* [Alchemy](https://alchemyapi.io/) API keys for RPC gateways:
  * **POLYGON_ALCHEMY_API_KEY** used for Polygon RPC;
  * **MUMBAI_ALCHEMY_API_KEY** used for Polygon testnet RPC;
  * **ETHEREUM_ALCHEMY_API_KEY** for Ethereum RPC;
  * and **GOERLI_ALCHEMY_API_KEY** for Ethereum testnet RPC;
* Network Explorers:
  * A API key for [Polygonscan](https://polygonscan.com/): **POLYGONSCAN_API_KEY**;
  * And a key for [Etherscan](https://etherscan.io/): **ETHERSCAN_API_KEY**;
* Finally a private key for administration of smart contracts: **WALLET_PRIVATE_KEY** (used as signer and deployer).

Tasks Order:

1. collection:deploy
2. marketplace:deploy
3. marketplace:whitelist-collection-add
4. collection:mint-all
5. collection:approve-all
6. marketplace:make-all
