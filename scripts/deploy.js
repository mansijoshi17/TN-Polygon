const hre = require("hardhat");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const StreamFactoryContract = await hre.ethers.getContractFactory(
    "StreamFactory"
  );
  const stream = await StreamFactoryContract.deploy();

  console.log("Stream Factory Contract address is: ", stream.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
