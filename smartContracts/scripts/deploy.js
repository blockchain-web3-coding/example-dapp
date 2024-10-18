const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy Lock
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const unlockTime = currentTimestampInSeconds + 60;
  // const lockedAmount = hre.ethers.parseEther("0.001");
  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  // await lock.waitForDeployment();
  // console.log("Lock deployed to:", await lock.getAddress());

  // Deploy TestToken (ERC20)
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy();
  await testToken.waitForDeployment();
  console.log("TestToken deployed to:", await testToken.getAddress());

  // Deploy TestNFT (ERC721)
  const TestNFT = await hre.ethers.getContractFactory(
    "contracts/src/ERC721.sol:TestNFT"
  );
  const testNFT = await TestNFT.deploy();
  await testNFT.waitForDeployment();
  console.log("TestNFT deployed to:", await testNFT.getAddress());

  // Deploy Test1155 (ERC1155)
  const Test1155 = await hre.ethers.getContractFactory("Test1155");
  const test1155 = await Test1155.deploy();
  await test1155.waitForDeployment();
  console.log("Test1155 deployed to:", await test1155.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
