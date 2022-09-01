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

    it("Mints a new token", async function() {
        const { MonkeysWithTypewriters, signer1, signer2 } = await loadFixture(deployTokenFixture)

        await MonkeysWithTypewriters.mint()
        await MonkeysWithTypewriters.connect(signer2).mint()

        expect(await MonkeysWithTypewriters.ownerOf(0)).to.equal(signer1.address)
        expect(await MonkeysWithTypewriters.ownerOf(1)).to.equal(signer2.address)
    })

    it("Can add a sentence", async function() {
        const { MonkeysWithTypewriters, signer1, signer2 } = await loadFixture(deployTokenFixture)

        await MonkeysWithTypewriters.mint()
        await MonkeysWithTypewriters.addSentence("A strange game.", 0)
        const sentence = await MonkeysWithTypewriters.stories(0, 0)

        expect(sentence[0]).to.equal("A strange game.")
    })

    it("Stores sentences correctly", async function() {
        const { MonkeysWithTypewriters, signer1, signer2 } = await loadFixture(deployTokenFixture)

        await MonkeysWithTypewriters.mint()

        await MonkeysWithTypewriters.addSentence("A strange game.", 0)
        await MonkeysWithTypewriters.addSentence("The only winning move is not to play.", 0)

        const firstSentence = await MonkeysWithTypewriters.stories(0, 0)
        const secondSentence = await MonkeysWithTypewriters.stories(0, 1)

        expect(`${firstSentence[0]} ${secondSentence[0]}`).to.equal("A strange game. The only winning move is not to play.")
    })
})