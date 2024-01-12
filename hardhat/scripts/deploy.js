const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { FEE, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH } = require("../constants");

async function main() {
    // deploy the contract
    const RandomWinnerGame = await ethers.getContractFactory("RandomWinnerGame");

    // Assuming `initialOwner` is an address you want to set as the owner
    const initialOwner = "0x4EfA5775E88580A988044fDd1aAfA8F8aa11890B"; //deployer.address;

    const deployedContract = await RandomWinnerGame.deploy(
        VRF_COORDINATOR,
        LINK_TOKEN,
        KEY_HASH,
        FEE,
        initialOwner // Include the initialOwner parameter if required
    );

    await deployedContract.waitForDeployment();

    // print the address of the deployed contract
    console.log("Deployed Contract Address:", deployedContract.target);

    console.log("Sleeping.....");
    // Wait for etherscan to notice that the contract has been deployed
    await sleep(30000);

    // Verify the contract after deploying
    await hre.run("verify:verify", {
        address: deployedContract.target,
        constructorArguments: [VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, FEE, initialOwner],
    });
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
