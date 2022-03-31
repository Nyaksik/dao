import { expect } from "chai";
import { ethers } from "hardhat";

export default (): void => {
  it("DAO-FINISH: Proposal expected to finish", async function (): Promise<void> {
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

    await this.instance.connect(this.acc1).vote(proposalId, this.mintAmount, 1);
    await ethers.provider.send("evm_increaseTime", [this.days + 100]);
    await this.instance.connect(this.acc1).finishProposal(proposalId);

    const [_, status] = await this.instance.proposals(proposalId);

    expect(status).to.eq(2);
  });
  it("DAO-FINISH: Expected to return ProposalInProgress error", async function (): Promise<void> {
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

    await this.instance.connect(this.acc1).vote(proposalId, this.mintAmount, 1);

    await expect(
      this.instance.connect(this.acc1).finishProposal(proposalId)
    ).to.be.revertedWith("ProposalInProgress()");
  });
  it("DAO-FINISH: Expected to return ProposalIsOver error", async function (): Promise<void> {
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

    await this.instance.connect(this.acc1).vote(proposalId, this.mintAmount, 1);
    await ethers.provider.send("evm_increaseTime", [this.days + 100]);
    await this.instance.connect(this.acc1).finishProposal(proposalId);

    await expect(
      this.instance.connect(this.acc1).finishProposal(proposalId)
    ).to.be.revertedWith("ProposalIsOver()");
  });
  it("DAO-FINISH: _isMinimunQuorum condition with false result. Rejected status expected", async function (): Promise<void> {
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
      .vote(proposalId, this.minTestAmount, 1);
    await ethers.provider.send("evm_increaseTime", [this.days + 100]);
    await this.instance.connect(this.acc1).finishProposal(proposalId);

    const [_, status] = await this.instance.proposals(proposalId);

    expect(status).to.eq(3);
  });
  it("DAO-FINISH: _isRequisiteMajority condition with false result. Rejected status expected", async function (): Promise<void> {
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

    await this.instance.connect(this.acc1).vote(proposalId, this.mintAmount, 2);
    await ethers.provider.send("evm_increaseTime", [this.days + 100]);
    await this.instance.connect(this.acc1).finishProposal(proposalId);

    const [_, status] = await this.instance.proposals(proposalId);

    expect(status).to.eq(3);
  });
};
