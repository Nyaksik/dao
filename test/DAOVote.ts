import { expect } from "chai";
import { ethers } from "hardhat";

export default (): void => {
  it("DAO-VOTE: Expected to vote", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.mintAmount);
    await this.instanceToken.mint(this.acc2.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc2)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc2).deposit(this.mintAmount);

    const callData = this.instanceCallData.interface.encodeFunctionData(
      "setId",
      [this.testId]
    );

    await this.instance.addProposal(callData, this.testDescr);

    const proposalId = await this.instance.proposalId();

    await this.instance
      .connect(this.acc1)
      .vote(proposalId, this.minTestAmount, 1);
    await this.instance
      .connect(this.acc2)
      .vote(proposalId, this.minTestAmount, 2);

    const [_, __, ___, endTime, votes, votesFor, votesAgainst] =
      await this.instance.proposals(proposalId);
    const [____, time] = await this.instance.participants(this.acc1.address);
    const result = [+endTime, +votes, +votesFor, +votesAgainst];
    const expectResult = [
      +time,
      this.minTestAmount * 2,
      this.minTestAmount,
      this.minTestAmount,
    ];

    expect(result).to.deep.eq(expectResult);
  });
  it("DAO-VOTE: EndTime is expected not to change", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.mintAmount);

    const callData1 = this.instanceCallData.interface.encodeFunctionData(
      "setId",
      [this.testId]
    );
    const callData2 = this.instanceCallData.interface.encodeFunctionData(
      "setId",
      [-this.testId]
    );

    await this.instance.addProposal(callData1, this.testDescr);
    await ethers.provider.send("evm_increaseTime", [100]);
    await this.instance.addProposal(callData2, this.testDescr);
    await this.instance.connect(this.acc1).vote(2, this.minTestAmount, 1);
    await this.instance.connect(this.acc1).vote(1, this.minTestAmount, 1);

    const [_, __, ___, endTime] = await this.instance.proposals(2);
    const [____, time] = await this.instance.participants(this.acc1.address);

    expect(endTime).to.eq(time);
  });
  it("DAO-VOTE: Expected to return ProposalIsOver error", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.mintAmount);

    const callData = this.instanceCallData.interface.encodeFunctionData(
      "setId",
      [this.testId]
    );

    await this.instance.addProposal(callData, this.testDescr);
    await ethers.provider.send("evm_increaseTime", [this.days]);

    const proposalId = await this.instance.proposalId();

    await expect(
      this.instance.connect(this.acc1).vote(proposalId, this.minTestAmount, 1)
    ).to.be.revertedWith("ProposalIsOver()");
  });
  it("DAO-VOTE: Expected to return IncorrectAmount error", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.minTestAmount);

    const [deposit] = await this.instance.participants(this.acc1.address);
    const callData = this.instanceCallData.interface.encodeFunctionData(
      "setId",
      [this.testId]
    );

    await this.instance.addProposal(callData, this.testDescr);

    const proposalId = await this.instance.proposalId();

    await expect(
      this.instance.connect(this.acc1).vote(proposalId, this.maxTestAmount, 1)
    ).to.be.revertedWith(`IncorrectAmount(${this.maxTestAmount}, ${deposit})`);
  });
  it("DAO-VOTE: Expected to return AlreadyVoted error", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.mintAmount);

    const callData = this.instanceCallData.interface.encodeFunctionData(
      "setId",
      [this.testId]
    );

    await this.instance.addProposal(callData, this.testDescr);

    const proposalId = await this.instance.proposalId();

    await this.instance
      .connect(this.acc1)
      .vote(+proposalId, this.minTestAmount, 1);

    await expect(
      this.instance.connect(this.acc1).vote(+proposalId, this.minTestAmount, 1)
    ).to.be.revertedWith("AlreadyVoted()");
  });
};
