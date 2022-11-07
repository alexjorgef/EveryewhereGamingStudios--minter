import { ethers } from 'hardhat'

async function main() {
    const [owner, addr1, addr2, ...addrs] = await ethers.getSigners()

    console.log(owner.address)
    console.log(addr1.address)
    console.log(addr2.address)
    for (const addr of addrs) {
        console.log(addr.address)
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
