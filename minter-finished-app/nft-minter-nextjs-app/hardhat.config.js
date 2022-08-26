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
      sources: "./solidty",
      tests: "./tests",
      cache: "./cache",
      artifacts: "./artifacts"
    },
    mocha: {
      timeout: 40000
    }
  }