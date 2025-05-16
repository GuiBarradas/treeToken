require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const TreeToken = await ethers.getContractFactory("TreeToken");

  const treeToken = await TreeToken.deploy();

  await treeToken.waitForDeployment();

  console.log(`✅ Token deployed at: ${treeToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
