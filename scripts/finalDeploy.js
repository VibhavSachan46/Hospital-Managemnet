const {ethers} = require("hardhat");

async function main() {
  const Medical = await ethers.getContractFactory("Medical");
  const medical = await Medical.deploy();

  await medical.waitForDeployment();

  const deployedAddress = await medical.getAddress();

  console.log("Address of contract :", deployedAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});