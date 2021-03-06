import { expect } from "chai";
import { ethers } from "hardhat";

export default (): void => {
  it("DAO-DEPOSIT: Deposit is made", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);

    const balance = await this.instanceToken.balanceOf(this.acc1.address);

    expect(balance).to.eq(this.mintAmount);

    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.mintAmount);

    const balanceAfterDeposit = await this.instanceToken.balanceOf(
      this.acc1.address
    );
    const balanceDAO = await this.instanceToken.balanceOf(
      this.instance.address
    );
    const totalProvided = await this.instance.totalProvided();

    expect(balanceAfterDeposit).to.eq(0);
    expect(balanceDAO).to.eq(this.mintAmount);
    expect(totalProvided).to.eq(this.mintAmount);
  });
  it("DAO-DEPOSIT: Expected that if endTime is greater than zero, then it will not change.", async function (): Promise<void> {
    await this.instanceToken.mint(this.acc1.address, this.mintAmount);
    await this.instanceToken
      .connect(this.acc1)
      .approve(this.instance.address, this.mintAmount);
    await this.instance.connect(this.acc1).deposit(this.minTestAmount);

    const { timestamp } = await ethers.provider.getBlock("latest");

    await this.instance.connect(this.acc1).deposit(this.minTestAmount);

    const [_, endTime] = await this.instance.participants(this.acc1.address);

    expect(timestamp).to.eq(+endTime);
  });
};
