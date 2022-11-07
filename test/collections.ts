import { ethers } from 'hardhat'
import { Contract } from 'ethers'
import { assert, expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('Collections contracts', function () {
    let contractCollection: Contract
    let owner: SignerWithAddress
    let addr1: SignerWithAddress
    let addr2: SignerWithAddress

    before(async function () {
        ;[owner, addr1, addr2] = await ethers.getSigners()
    })

    describe('Deployment', function () {
        it('First test', async function () {
            expect(true).to.equal(true)
        })
    })

    describe('Mint', function () {
        it('First test', async function () {
            expect(true).to.equal(true)
        })
    })
})
