const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")

describe("MonkeysWithTypewriters contract", function() {
    async function deployTokenFixture() {
        const [signer1, signer2] = await ethers.getSigners()

        const MonkeysWithTypewritersFactory = await ethers.getContractFactory("MonkeysWithTypewriters")
        const MonkeysWithTypewriters = await MonkeysWithTypewritersFactory.deploy()
        await MonkeysWithTypewriters.deployed()

        return { MonkeysWithTypewriters, signer1, signer2 }
    }

    it("Read name and symbol", async function() {
        const { MonkeysWithTypewriters } = await loadFixture(deployTokenFixture)
        
        const name = await MonkeysWithTypewriters.name()

        expect(name).to.equal("MonkeysWithTypewriters")
    })
})