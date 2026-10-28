const hre = require("hardhat");

async function main() {
  const chainFund = await hre.ethers.deployContract("ChainFund");
  await chainFund.waitForDeployment();

  const address = await chainFund.getAddress();
  console.log(`ChainFund deployed to: ${address}`);
  console.log(`Network: ${hre.network.name}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
