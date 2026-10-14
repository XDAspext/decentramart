import hre from 'hardhat';
const { ethers } = hre;
async function main(){const factory=await ethers.getContractFactory('DecentraMart');const market=await factory.deploy();await market.waitForDeployment();console.log('DecentraMart deployed to:',await market.getAddress());}
main().catch(e=>{console.error(e);process.exitCode=1});
