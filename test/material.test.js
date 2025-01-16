const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Material Contract', function () {
  let Material;
  let material;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Material = await ethers.getContractFactory('Material');
    material = await Material.deploy();
    await material.deployed();
  });

  it('Should create a market item', async function () {
    const tokenURI = 'https://example.com/token/1';
    const price = ethers.utils.parseEther('0.1');

    await material.createToken(tokenURI, price);
    const marketItems = await material.fetchMarketItems();

    expect(marketItems.length).to.equal(1);
    expect(marketItems[0].price).to.equal(price);
    expect(marketItems[0].sold).to.equal(false);
  });
});