const { ethers, network } = require("hardhat")
const fs = require("fs")
const FRONT_END_ADDRESS_FILE = "../nft-lottery-ui/pages/src/constants/contractAddress.json"
const FRONT_END_ABI_FILE = "../nft-lottery-ui/pages/src/constants/abi.json"
module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end...")
        updateContractAddress()
        updateAbi()
    }
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    const abi = raffle.interface.format(ethers.utils.FormatTypes.json)
    fs.writeFileSync(FRONT_END_ABI_FILE, JSON.stringify(abi))
}

async function updateContractAddress() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId.toString()
    const currentAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESS_FILE, "utf8"))
    if (chainId in currentAddress) {
        if (!contractAddress[chainId].includes(raffle.address)) {
            contractAddress[chainId].push(raffle.address)
        }
    }
    {
        currentAddress[chainId] = raffle.address
    }
    fs.writeFileSync(FRONT_END_ADDRESS_FILE, JSON.stringify(currentAddress))
}

module.exports.tags = ["all", "frontend"]
