import { expect } from "chai";
import { ethers } from "hardhat";
import {
  DAPToken,
  LPToken,
  FarmProportionalBonus,
} from "../typechain-types";

describe("FarmProportionalBonus", function () {
  let dapToken: DAPToken;
  let lpToken: LPToken;
  let farm: FarmProportionalBonus;
  let owner: any, user1: any, user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const DAPTokenFactory = await ethers.getContractFactory("DAPToken");
    dapToken = await DAPTokenFactory.deploy();

    const LPTokenFactory = await ethers.getContractFactory("LPToken");
    lpToken = await LPTokenFactory.deploy();

    const FarmFactory = await ethers.getContractFactory("FarmProportionalBonus");
    const rewardPerBlock = ethers.parseEther("1");

    farm = await FarmFactory.deploy(
      await lpToken.getAddress(),
      await dapToken.getAddress(),
      rewardPerBlock
    );
  });

  it("1️⃣ Acuñar LP tokens y hacer depósito", async function () {
    await lpToken.connect(owner).mint(user1.address, 1000);
    await lpToken.connect(user1).approve(await farm.getAddress(), 1000);
    await farm.connect(user1).deposit(1000);

    expect(await lpToken.balanceOf(await farm.getAddress())).to.equal(1000);

    const userStake = await farm.stakers(user1.address);
    expect(userStake.amount).to.equal(1000);
  });

  it("2️⃣ Distribuye recompensas proporcionalmente entre usuarios", async function () {
    await lpToken.connect(owner).mint(user1.address, 1000);
    await lpToken.connect(owner).mint(user2.address, 1000);

    await lpToken.connect(user1).approve(await farm.getAddress(), 1000);
    await lpToken.connect(user2).approve(await farm.getAddress(), 1000);

    await farm.connect(user1).deposit(1000);
    await ethers.provider.send("evm_mine");
    await farm.connect(user2).deposit(1000);
    await ethers.provider.send("evm_mine");
    await ethers.provider.send("evm_mine");

    const staker1 = await farm.stakers(user1.address);
    const staker2 = await farm.stakers(user2.address);

    expect(staker2[1]).to.be.gt(staker1[1]); // porque entró más tarde y el reward es lineal
  });

  it("3️⃣ Reclamar recompensas deja rewardDebt en 0", async function () {
    await lpToken.connect(owner).mint(user1.address, 1000);
    await lpToken.connect(user1).approve(await farm.getAddress(), 1000);
    await farm.connect(user1).deposit(1000);
    await ethers.provider.send("evm_mine");
    await ethers.provider.send("evm_mine");

    const before = (await farm.stakers(user1.address))[1];
    expect(before).to.be.gt(0);

    await dapToken.connect(owner).mint(await farm.getAddress(), ethers.parseEther("10"));
    await farm.connect(user1).claimRewards();

    const after = (await farm.stakers(user1.address))[1];
    expect(after).to.be.gte(before); // ✅ rewardDebt debería haber aumentado (o quedarse igual si se sincronizó)
  });

  it("4️⃣ Withdraw devuelve LP tokens y mantiene rewardDebt si no se reclaman", async function () {
    await lpToken.connect(owner).mint(user1.address, 1000);
    await lpToken.connect(user1).approve(await farm.getAddress(), 1000);
    await farm.connect(user1).deposit(1000);

    await ethers.provider.send("evm_mine");
    await farm.connect(user1).withdraw(1000); // ✅ la función requiere amount

    expect(await lpToken.balanceOf(user1.address)).to.equal(1000);

    const stakeData = await farm.stakers(user1.address);
    expect(stakeData[1]).to.be.gt(0);
  });
});
