import { expect } from "chai";
import { ethers } from "hardhat";

export default (): void => {
  it("DAO-ADD-PROPOSAL: Proposal is expected to be added", async function (): Promise<void> {
    const callData = this.instanceCallData.interface.encodeFunctionData(
      "setId",
      [this.testId]
    );

    await this.instance.addProposal(callData, this.testDescr);

    const { timestamp } = await ethers.provider.getBlock("latest");
    const proposalId = await this.instance.proposalId();
    const [
      id,
      status,
      startTime,
      endTime,
      votes,
      votesFor,
      votesAgaint,
      recipient,
      calldata,
      descr,
    ] = await this.instance.getProposal(proposalId);
    const result = [
      +id,
      status,
      +startTime,
      +endTime,
      +votes,
      +votesFor,
      +votesAgaint,
      recipient,
      calldata,
      descr,
    ];
    const expectResult = [
      +proposalId,
      1,
      timestamp,
      timestamp + this.days,
      0,
      0,
      0,
      this.owner.address,
      callData,
      this.testDescr,
    ];

    expect(expectResult).to.deep.eq(result);
  });
  it("DAO-ADD-PROPOSAL: Expected to return onlyOwner error", async function (): Promise<void> {
    const callData = this.instanceCallData.interface.encodeFunctionData(
      "setId",
      [this.testId]
    );

    await expect(
      this.instance.connect(this.acc1).addProposal(callData, this.testDescr)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });
};
