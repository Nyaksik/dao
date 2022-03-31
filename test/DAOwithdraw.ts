import { expect } from "chai";

export default (): void => {
  it("DAO_WITHDRAW: Tokens withdraw", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.mintAmount);
    await this.instance.connect(this.acc1).withdraw(this.mintAmount);

    const balance = await this.instanceToken.balanceOf(this.acc1.address);

    expect(balance).to.eq(this.mintAmount);
  });
  it("DAO_WITHDRAW: IncorrectAmount error expected", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.minTestAmount);

    await expect(
      this.instance.connect(this.acc1).withdraw(this.maxTestAmount)
    ).to.be.revertedWith(
      `IncorrectAmount(${this.maxTestAmount}, ${this.minTestAmount})`
    );
  });
  it("DAO_WITHDRAW: ProposalInProgress error expected", async function (): Promise<void> {
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

    await expect(
      this.instance.connect(this.acc1).withdraw(this.maxTestAmount)
    ).to.be.revertedWith("ProposalInProgress()");
  });
};
