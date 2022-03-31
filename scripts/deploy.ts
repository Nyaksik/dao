import { ethers } from "hardhat";

async function main() {
  const CallData = await ethers.getContractFactory("CallData");
  const callData = await CallData.deploy();

  await callData.deployed();

  console.log(`CallData deployed to: ${callData.address}`);

  const TokenDAO = await ethers.getContractFactory("TokenDAO");
  const tokenDAO = await TokenDAO.deploy();

  await tokenDAO.deployed();

  console.log(`TokenDAO deployed to: ${tokenDAO.address}`);

  const DAO = await ethers.getContractFactory("DAO");
  const dao = await DAO.deploy(tokenDAO.address);

  await dao.deployed();

  console.log(`DAO deployed to: ${dao.address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
