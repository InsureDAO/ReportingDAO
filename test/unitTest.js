const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");

describe("ReportingToken", function () {
  const name = "Reporting Token"
  const symbol = "RPT"
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

  beforeEach(async () => {
    //import
    [creator, alice, bob, futureOwner] = await ethers.getSigners();
    const ReportingToken = await ethers.getContractFactory("ReportingToken");

    //deploy
    token = await ReportingToken.deploy(name, symbol);
  });

  describe("Condition", function () {
    it("Should contracts be deployed", async () => {
      expect(token.address).to.exist;

      expect(await token.name()).to.equal(name)
      expect(await token.symbol()).to.equal(symbol)
      expect(await token.admin()).to.equal(creator.address)
      expect(await token.future_admin()).to.equal(ZERO_ADDRESS)
    });
  });

  describe("assign", function () {
    it("only Owner", async () => {
      await expect(token.connect(alice).assign(alice.address)).to.revertedWith("onlyOwner")
    });

    it("revert when zero address", async () => {
      await expect(token.assign(ZERO_ADDRESS)).to.revertedWith("assign to the zero address")
    });

    it("Should increment balance", async () => {
      expect(await token.balanceOf(alice.address)).to.equal(0)
      expect(await token.totalSupply()).to.equal(0)

      await token.assign(alice.address)

      expect(await token.balanceOf(alice.address)).to.equal(1)
      expect(await token.totalSupply()).to.equal(1)
    });

    it("revert when account already has token", async () => {
      await token.assign(alice.address)
      expect(await token.balanceOf(alice.address)).to.equal(1)
      expect(await token.totalSupply()).to.equal(1)

      await expect(token.assign(alice.address)).to.revertedWith("already assigned")

      expect(await token.balanceOf(alice.address)).to.equal(1)
      expect(await token.totalSupply()).to.equal(1)
    });
  });


  describe("resign", function () {
    beforeEach(async () => {
      await token.assign(alice.address)
    });

    it("revert when not admin nor holder", async () => {
      await expect(token.connect(alice).resign(bob.address)).to.revertedWith("onlyOwner or holder")
    });

    it("revert when zero address", async () => {
      await expect(token.assign(ZERO_ADDRESS)).to.revertedWith("assign to the zero address")
    });

    it("Should decrement balance", async () => {
      expect(await token.balanceOf(alice.address)).to.equal(1)
      expect(await token.totalSupply()).to.equal(1)

      await token.resign(alice.address)

      expect(await token.balanceOf(alice.address)).to.equal(0)
      expect(await token.totalSupply()).to.equal(0)
    });

    it("Should decrement balance for himself", async () => {
      expect(await token.balanceOf(alice.address)).to.equal(1)
      expect(await token.totalSupply()).to.equal(1)

      await token.connect(alice).resign(alice.address)

      expect(await token.balanceOf(alice.address)).to.equal(0)
      expect(await token.totalSupply()).to.equal(0)
    });

    it("revert when account already resigned", async () => {
      await token.resign(alice.address)
      expect(await token.balanceOf(alice.address)).to.equal(0)
      expect(await token.totalSupply()).to.equal(0)

      await expect(token.resign(alice.address)).to.revertedWith("not assigned")

      expect(await token.balanceOf(alice.address)).to.equal(0)
      expect(await token.totalSupply()).to.equal(0)
    });
  });

  describe("commit_transfer_ownership", function () {
    it("revert when not admin", async () => {
      await expect(token.connect(alice).commit_transfer_ownership(futureOwner.address))
      .to.revertedWith("onlyOwner")
    });

    it("change future admin", async () => {
      expect(await token.admin()).to.equal(creator.address)
      expect(await token.future_admin()).to.equal(ZERO_ADDRESS)

      await token.commit_transfer_ownership(futureOwner.address)

      expect(await token.admin()).to.equal(creator.address)
      expect(await token.future_admin()).to.equal(futureOwner.address)
    });
  });

  describe("accept_transfer_ownership", function () {
    beforeEach(async () => {
      await token.commit_transfer_ownership(futureOwner.address)
    });

    it("revert when not futureAdmin", async () => {
      await expect(token.connect(alice).accept_transfer_ownership())
      .to.revertedWith("onlyFutureOwner")
    });

    it("change admin", async () => {
      expect(await token.admin()).to.equal(creator.address)
      expect(await token.future_admin()).to.equal(futureOwner.address)

      await token.connect(futureOwner).accept_transfer_ownership()

      expect(await token.admin()).to.equal(futureOwner.address)
      expect(await token.future_admin()).to.equal(futureOwner.address)
    });
  });
});
