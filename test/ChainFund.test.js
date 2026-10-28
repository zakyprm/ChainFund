const { expect } = require("chai");
const { ethers } = require("hardhat");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("ChainFund", function () {
  const GOAL = ethers.parseEther("1");

  async function deployFixture() {
    const [owner, donor, other] = await ethers.getSigners();
    const chainFund = await ethers.deployContract("ChainFund");
    return { chainFund, owner, donor, other };
  }

  // Fixture yang sudah punya 1 kampanye (id 0) milik `owner`.
  async function withCampaignFixture() {
    const base = await deployFixture();
    await base.chainFund
      .connect(base.owner)
      .createCampaign("Bantu Sekolah", "Renovasi atap", GOAL);
    return base;
  }

  describe("createCampaign", function () {
    it("menyimpan data kampanye dengan benar dan emit event", async function () {
      const { chainFund, owner } = await loadFixture(deployFixture);

      await expect(
        chainFund.connect(owner).createCampaign("Bantu Sekolah", "Renovasi atap", GOAL)
      )
        .to.emit(chainFund, "CampaignCreated")
        .withArgs(0, owner.address, "Bantu Sekolah", GOAL);

      expect(await chainFund.getCampaignCount()).to.equal(1);

      const c = await chainFund.getCampaign(0);
      expect(c.owner).to.equal(owner.address);
      expect(c.title).to.equal("Bantu Sekolah");
      expect(c.description).to.equal("Renovasi atap");
      expect(c.goal).to.equal(GOAL);
      expect(c.totalRaised).to.equal(0);
      expect(c.withdrawn).to.equal(false);
    });

    it("gagal kalau judul kosong", async function () {
      const { chainFund } = await loadFixture(deployFixture);
      await expect(chainFund.createCampaign("", "desc", GOAL)).to.be.revertedWithCustomError(
        chainFund,
        "EmptyTitle"
      );
    });

    it("gagal kalau target 0", async function () {
      const { chainFund } = await loadFixture(deployFixture);
      await expect(chainFund.createCampaign("Judul", "desc", 0)).to.be.revertedWithCustomError(
        chainFund,
        "ZeroGoal"
      );
    });
  });

  describe("donate", function () {
    it("menambah totalRaised dan mencatat donatur", async function () {
      const { chainFund, donor } = await loadFixture(withCampaignFixture);
      const amount = ethers.parseEther("0.4");

      await expect(chainFund.connect(donor).donate(0, { value: amount }))
        .to.emit(chainFund, "DonationReceived")
        .withArgs(0, donor.address, amount);

      expect((await chainFund.getCampaign(0)).totalRaised).to.equal(amount);

      const list = await chainFund.getDonations(0);
      expect(list.length).to.equal(1);
      expect(list[0].donor).to.equal(donor.address);
      expect(list[0].amount).to.equal(amount);
      expect(list[0].timestamp).to.be.greaterThan(0);
    });

    it("gagal kalau donasi 0 ETH", async function () {
      const { chainFund, donor } = await loadFixture(withCampaignFixture);
      await expect(
        chainFund.connect(donor).donate(0, { value: 0 })
      ).to.be.revertedWithCustomError(chainFund, "ZeroDonation");
    });

    it("gagal kalau kampanye tidak ada", async function () {
      const { chainFund, donor } = await loadFixture(withCampaignFixture);
      await expect(
        chainFund.connect(donor).donate(99, { value: 1 })
      ).to.be.revertedWithCustomError(chainFund, "CampaignNotFound");
    });
  });

  describe("withdraw", function () {
    it("gagal kalau dipanggil non-owner", async function () {
      const { chainFund, donor, other } = await loadFixture(withCampaignFixture);
      await chainFund.connect(donor).donate(0, { value: GOAL });

      await expect(chainFund.connect(other).withdraw(0)).to.be.revertedWithCustomError(
        chainFund,
        "NotCampaignOwner"
      );
    });

    it("gagal sebelum target tercapai", async function () {
      const { chainFund, owner, donor } = await loadFixture(withCampaignFixture);
      await chainFund.connect(donor).donate(0, { value: ethers.parseEther("0.5") });

      await expect(chainFund.connect(owner).withdraw(0)).to.be.revertedWithCustomError(
        chainFund,
        "GoalNotReached"
      );
    });

    it("berhasil oleh owner setelah target tercapai, saldo owner bertambah", async function () {
      const { chainFund, owner, donor } = await loadFixture(withCampaignFixture);
      await chainFund.connect(donor).donate(0, { value: GOAL });

      await expect(chainFund.connect(owner).withdraw(0))
        .to.emit(chainFund, "FundsWithdrawn")
        .withArgs(0, owner.address, GOAL);

      expect((await chainFund.getCampaign(0)).withdrawn).to.equal(true);
    });

    it("saldo owner naik sebesar dana kampanye dan contract kosong", async function () {
      const { chainFund, owner, donor } = await loadFixture(withCampaignFixture);
      await chainFund.connect(donor).donate(0, { value: GOAL });

      await expect(chainFund.connect(owner).withdraw(0)).to.changeEtherBalances(
        [owner, chainFund],
        [GOAL, -GOAL]
      );
    });

    it("gagal kalau withdraw dua kali", async function () {
      const { chainFund, owner, donor } = await loadFixture(withCampaignFixture);
      await chainFund.connect(donor).donate(0, { value: GOAL });
      await chainFund.connect(owner).withdraw(0);

      await expect(chainFund.connect(owner).withdraw(0)).to.be.revertedWithCustomError(
        chainFund,
        "AlreadyWithdrawn"
      );
    });
  });
});
