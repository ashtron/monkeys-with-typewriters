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

    it("Reads name and symbol", async function() {
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
        const { MonkeysWithTypewriters, signer1 } = await loadFixture(deployTokenFixture)

        await MonkeysWithTypewriters.mint()
        await MonkeysWithTypewriters.addSentence("A strange game.", 0)
        const sentence = await MonkeysWithTypewriters.stories(0, 0)

        expect(sentence[0]).to.equal("A strange game.")
    })

    it("Stores sentences correctly", async function() {
        const { MonkeysWithTypewriters, signer1, signer2 } = await loadFixture(deployTokenFixture)

        await MonkeysWithTypewriters.mint()

        await MonkeysWithTypewriters.addSentence("A strange game.", 0)
        await MonkeysWithTypewriters.transferFrom(signer1.address, signer2.address, 0)
        await MonkeysWithTypewriters.connect(signer2).addSentence("The only winning move is not to play.", 0)

        const firstSentence = await MonkeysWithTypewriters.stories(0, 0)
        const secondSentence = await MonkeysWithTypewriters.stories(0, 1)

        expect(`${firstSentence[0]} ${secondSentence[0]}`).to.equal("A strange game. The only winning move is not to play.")
    })

    it("Only the owner of an NFT can add sentences", async function() {
        const { MonkeysWithTypewriters, signer1, signer2 } = await loadFixture(deployTokenFixture)

        await MonkeysWithTypewriters.mint()

        await expect(MonkeysWithTypewriters.connect(signer2).addSentence("A strange game.", 0))
            .to.be.revertedWith("Only the NFT owner can add a new sentence.")
    })

    it("Doesn't allow the last sentence adder to add the next sentence", async function() {
        const { MonkeysWithTypewriters, signer1 } = await loadFixture(deployTokenFixture)

        await MonkeysWithTypewriters.mint()
        await MonkeysWithTypewriters.addSentence("A strange game.", 0)
        
        await expect(MonkeysWithTypewriters.addSentence("The only winning move is not to play.", 0)).to.be.revertedWith("A different address must add the next sentence.")
    })
})