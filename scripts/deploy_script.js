// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const ReportingMemberERC20 = await hre.ethers.getContractFactory("ReportingMemberERC20");

  //config
  const admin = "0xA390CC058bC0af57845eb1c363dE6194c2c089Af"
  const name = "Reporting Token";
  const simbol = "RPTINSURE";

  //deploy
  rpt_insure  = await ReportingMemberERC20.deploy(admin, name, simbol);

  console.log(rpt_insure.address)

  await rpt_insure.mint(admin);
  console.log("minted")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
