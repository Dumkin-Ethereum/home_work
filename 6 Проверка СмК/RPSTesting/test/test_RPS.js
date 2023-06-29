const { expect } = require('chai');
const { ethers } = require("hardhat");

describe("All tests", () => {

    describe("RPS unit tests", () => {
        async function deployFixture() {
            const [owner, otherAccount, thirdAccount] = await ethers.getSigners();

            const contract = await ethers.deployContract("RPS");

            //OWNER COMMIT
            const ownerChoice = 0;
            const ownerSecret = '0x7365637265740000000000000000000000000000000000000000000000000000'
            const ownerCommit = ethers.solidityPackedKeccak256(['uint', 'bytes32', 'address'], [ownerChoice, ownerSecret, owner.address]);

            //OTHER ACCOUNT COMMIT
            const otherAccountChoice = 1;
            const otherAccountSecret = '0x7365637265740000000000000000000000000000000000000000000000000000';
            const otherAccountCommit = ethers.solidityPackedKeccak256(['uint', 'bytes32', 'address'], [otherAccountChoice, otherAccountSecret, otherAccount.address]);

            const thirdAccountCommit = ethers.solidityPackedKeccak256(['uint', 'bytes32', 'address'], ['2', '0x7365637265740000000000000000000000000000000000000000000000000000', owner.address]);

            return { contract, owner, otherAccount, thirdAccount, ownerCommit, otherAccountCommit, thirdAccountCommit, ownerChoice, ownerSecret, otherAccountChoice, otherAccountSecret };
        }

        it('should register owner account and return true', async () => {
            const {contract, owner} = await deployFixture();

            await contract.registration();

            const ownerResult = await contract.participantsData(owner.address);

            expect(ownerResult[1]).to.equal(true);
        })

        it('should register only owner\'s account and don\'t other\'s', async () => {
            const {contract, owner, otherAccount} = await deployFixture();

            await contract.registration();

            const ownerResult = await contract.participantsData(owner.address);
            const otherAccountResult = await contract.participantsData(otherAccount.address);

            expect(ownerResult[1]).to.equal(true);
            expect(otherAccountResult[1]).to.equal(false);
        })

        it('should register both accounts', async () => {
            const {contract, owner, otherAccount} = await deployFixture();

            await contract.registration();
            await contract.connect(otherAccount).registration();

            const ownerResult = await contract.participantsData(owner.address);
            const otherAccountResult = await contract.participantsData(otherAccount.address);

            expect(ownerResult[1]).to.equal(true);
            expect(otherAccountResult[1]).to.equal(true);
        })

        it('should\'t register third account and should throw exception', async () => {
            const {contract, owner, otherAccount, thirdAccount} = await deployFixture();

            let exceptionThrown = false;

            try {
                await contract.registration();
                await contract.connect(otherAccount).registration();
                await contract.connect(thirdAccount).registration();
            }
            catch (e) {
                exceptionThrown = true;
            }
            finally {
                const ownerResult = await contract.participantsData(owner.address);
                const otherAccountResult = await contract.participantsData(otherAccount.address);
                const thirdAccountResult = await contract.participantsData(thirdAccount.address);

                expect(ownerResult[1]).to.equal(true);
                expect(otherAccountResult[1]).to.equal(true);
                expect(thirdAccountResult[1]).to.equal(false);
                expect(exceptionThrown).to.equal(true);
            }
        })

        it('should save owner\'s and other account\'s commits', async () => {
            const {contract, owner, otherAccount, ownerCommit, otherAccountCommit} = await deployFixture();

            await contract.registration();
            await contract.connect(otherAccount).registration();

            await contract.connect(owner).choose(ownerCommit)
            await contract.connect(otherAccount).choose(otherAccountCommit)

            const ownerResult = await contract.participantsData(owner.address);
            const otherAccountResult = await contract.participantsData(otherAccount.address);


            expect(ownerResult[0]).to.equal(ownerCommit);
            expect(otherAccountResult[0]).to.equal(otherAccountCommit);
        })

        it('should save owner\'s commit and should\'t save third account\'s commit', async () => {
            const {contract, owner, otherAccount, thirdAccount, ownerCommit, otherAccountCommit, thirdAccountCommit} = await deployFixture();

            let exceptionThrown = false;

            try {
                await contract.registration();
                await contract.connect(otherAccount).registration();

                await contract.connect(owner).choose(ownerCommit)
                await contract.connect(thirdAccount).choose(thirdAccountCommit)
            }
            catch (e){
                exceptionThrown = true;
            }
            finally {
                const ownerResult = await contract.participantsData(owner.address);

                expect(ownerResult[0]).to.equal(ownerCommit);
                expect(exceptionThrown).to.equal(true);
            }

        })

        it('should\'t throw exception on reveal', async () => {
            const {contract, owner, otherAccount, ownerCommit, ownerChoice, ownerSecret, otherAccountCommit, otherAccountChoice, otherAccountSecret} = await deployFixture();

            let exceptionThrown = false;

            try {
                await contract.registration();
                await contract.connect(otherAccount).registration();

                await contract.connect(owner).choose(ownerCommit)
                await contract.connect(otherAccount).choose(otherAccountCommit)

                await contract.connect(owner).revealChoice(ownerChoice, ownerSecret)
                await contract.connect(otherAccount).revealChoice(otherAccountChoice, otherAccountSecret)
            }
            catch (e) {
                exceptionThrown = true;
            }
            finally {
                expect(exceptionThrown).to.equal(false);
            }


        })
    })

    describe("RPS and SmCInteraction integration tests", () => {

        async function deployFixture() {
            const [owner] = await ethers.getSigners();

            const RPS = await ethers.deployContract("RPS");
            const SmCInteraction = await ethers.deployContract("SmCInteraction", [await RPS.getAddress()]);

            return { RPS, owner,  SmCInteraction};
        }

        it("should\'t throw error and addresses should match", async () => {
            const { RPS, owner,  SmCInteraction } = await deployFixture();

            let exceptionThrown = false;

            try{
                await SmCInteraction.registrate();
            }
            catch (e) {
                exceptionThrown = true;
            }
            finally {
                expect(exceptionThrown).to.equal(false);
                expect(await RPS.getAddress()).to.equal(await SmCInteraction.RPSAddress())
            }
        })

        it("should throw error", async () => {
            const { RPS, owner,  SmCInteraction } = await deployFixture();

            let exceptionThrown = false;

            try{
                for (let i = 0; i < 3; i++)
                await SmCInteraction.registrate();
            }
            catch (e) {
                exceptionThrown = true;
            }
            finally {
                expect(exceptionThrown).to.equal(true);
            }
        })
    })


})