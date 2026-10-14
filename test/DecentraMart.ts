import { expect } from 'chai';
import hre from 'hardhat';
const { ethers } = hre;
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers.js';
describe('DecentraMart',()=>{
 async function setup(){const [seller,buyer,other]=await ethers.getSigners();const market=await (await ethers.getContractFactory('DecentraMart')).deploy();return {market,seller,buyer,other};}
 it('lists products and emits listing event',async()=>{const {market,seller}=await loadFixture(setup);await expect(market.connect(seller).listProduct(100n,'ipfs://demo')).to.emit(market,'ProductListed').withArgs(1,seller.address,100n,'ipfs://demo');const item=await market.listings(1);expect(item.available).eq(true);});
 it('pays seller and emits purchase event',async()=>{const {market,seller,buyer}=await loadFixture(setup);await market.connect(seller).listProduct(1000n,'demo');const before=await ethers.provider.getBalance(seller.address);await expect(market.connect(buyer).purchase(1,{value:1000n})).to.emit(market,'ProductPurchased').withArgs(1,buyer.address,seller.address,1000n);expect(await ethers.provider.getBalance(seller.address)).eq(before+1000n);});
 it('rejects underpayment, invalid, sold, and self purchase',async()=>{const {market,seller,buyer}=await loadFixture(setup);await market.connect(seller).listProduct(1000n,'demo');await expect(market.connect(buyer).purchase(1,{value:1n})).revertedWith('incorrect payment');await expect(market.connect(buyer).purchase(99,{value:1000n})).revertedWith('invalid listing');await expect(market.connect(seller).purchase(1,{value:1000n})).revertedWith('seller cannot buy own listing');await market.connect(buyer).purchase(1,{value:1000n});await expect(market.connect(buyer).purchase(1,{value:1000n})).revertedWith('listing unavailable');});
 it('rejects zero price',async()=>{const {market,seller}=await loadFixture(setup);await expect(market.connect(seller).listProduct(0,'demo')).revertedWith('price must be positive');});
});

describe('DecentraMart failed seller payout',()=>{
 it('rolls back listing state when seller rejects ETH',async()=>{
  const [,buyer]=await ethers.getSigners();
  const market=await (await ethers.getContractFactory('DecentraMart')).deploy();
  const seller=await (await ethers.getContractFactory('RejectingSeller')).deploy();
  await seller.list(await market.getAddress(),1000n);
  await expect(market.connect(buyer).purchase(1,{value:1000n})).revertedWith('seller payment failed');
  const item=await market.listings(1);
  expect(item.available).eq(true);
  expect(item.buyer).eq(ethers.ZeroAddress);
  expect(await ethers.provider.getBalance(await seller.getAddress())).eq(0n);
 });
});
