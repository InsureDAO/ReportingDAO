require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const fs = require("fs");
const key = fs.readFileSync(".key").toString().trim();
const infuraKey = fs.readFileSync(".infuraKey").toString().trim();

module.exports = {
  solidity: "0.8.7",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0,
      //forking: {url: "https://eth-mainnet.alchemyapi.io/v2/-vmufhhPyGeTxZH6ep9q2PuHjaPp4l0u",} //remove comment when testing mainnet fork
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraKey}`,
      accounts: [`0x${key}`]
    }
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test/",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};