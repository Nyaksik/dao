import { artifacts, ethers, waffle } from "hardhat";
import { Artifact } from "hardhat/types";
import DAOAddProposal from "./DAOAddProposal";
import DAOdeposit from "./DAOdeposit";
import DAOwithdraw from "./DAOwithdraw";

export default describe("DAO contract testing", async function () {
  before(async function () {
    [this.owner, this.acc1, this.acc2] = await ethers.getSigners();
    this.mintAmount = 1e9;
    this.maxTestAmount = 1e7;
    this.minTestAmount = 1e4;
    this.testId = 1;
    this.testDescr = "Test descr";
    this.days = 259200;
  });
  beforeEach(async function () {
    const artifactToken: Artifact = await artifacts.readArtifact("TokenDAO");
    this.instanceToken = await waffle.deployContract(this.owner, artifactToken);
    const artifact: Artifact = await artifacts.readArtifact("DAO");
    this.instance = await waffle.deployContract(this.owner, artifact, [
      this.instanceToken.address,
    ]);
    const artifactCallData: Artifact = await artifacts.readArtifact("CallData");
    this.instanceCallData = await waffle.deployContract(
      this.owner,
      artifactCallData
    );
  });
  DAOdeposit();
  DAOwithdraw();
  DAOAddProposal();
});
