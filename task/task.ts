import { task } from "hardhat/config";

task("deposit", "Make a deposit")
  .addParam("amount", "Deposit amount")
  .setAction(async ({ amount }, { ethers }) => {
    const DAO = await ethers.getContractAt(
      "DAO",
      process.env.DAO_ADDRESS as string
    );
    const value = await ethers.utils.parseEther(amount);

    await DAO.deposit(value);

    console.log(`Deposit made in the amount of: ${value}`);
  });

task("add", "Add proposal")
  .addParam("calldata")
  .addParam("descr")
  .setAction(async ({ calldata, descr }, { ethers }) => {
    const DAO = await ethers.getContractAt(
      "DAO",
      process.env.DAO_ADDRESS as string
    );

    await DAO.addProposal(calldata, descr);

    console.log(`Proposal added with description: ${descr}`);
  });

task("vote", "Vote for proposal")
  .addParam("id", "Proposal id")
  .addParam("amount", "Voting amount")
  .addParam("decision")
  .setAction(async ({ id, amount, decision }, { ethers }) => {
    const DAO = await ethers.getContractAt(
      "DAO",
      process.env.DAO_ADDRESS as string
    );
    const value = await ethers.utils.parseEther(amount);

    await DAO.vote(id, value, decision);

    console.log(`You voted for proposal with id: ${id}`);
  });

task("finish", "Finish voting")
  .addParam("id", "Proposal id")
  .setAction(async ({ id }, { ethers }) => {
    const DAO = await ethers.getContractAt(
      "DAO",
      process.env.DAO_ADDRESS as string
    );

    DAO.finishProposal(id);

    console.log(`Voting with id ${id} has finished`);
  });
