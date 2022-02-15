// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  //config
  const ReportingToken = await hre.ethers.getContractFactory("ReportingToken");
  const name = "ReportingToken";
  const symbol = "RPT";

  //deploy
  rpt  = await ReportingToken.deploy(name, symbol);

  //setup
  await rpt.assign()


  //write
  let text = `ReportingToken = "${rpt.address}"`

  try {
    fs.writeFileSync("./scripts/deployments.js", text);
    console.log('write end');
  }catch(e){
    console.log(e);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
