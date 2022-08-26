require("@nomiclabs/hardhat-ethers");
require('@openzeppelin/hardhat-upgrades');

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 module.exports = {
    defaultNetwork: "cronos_test",
    networks: {
      cronos_test: {
        url: "https://evm-t3.cronos.org",
      },
      ganache: {
        url: "HTTP://127.0.0.1:7545",
      }
    },
    solidity: {
      version: "0.8.16",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    },
    paths: {
      sources: "./contracts",
      tests: "./test",
      cache: "./cache",
      artifacts: "./artifacts"
    },
    mocha: {
      timeout: 40000
    }
  }