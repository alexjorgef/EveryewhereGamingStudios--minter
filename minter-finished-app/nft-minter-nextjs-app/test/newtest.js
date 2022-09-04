require('dotenv').config();
const assert = require("chai").assert;

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const Factory = artifacts.require('Factory');

/** @type {import('@openzeppelin/truffle-upgrades/dist/utils').ContractClass} */
const Child = artifacts.require('Child');

contract("Factory", function (/* accounts */) {
    it("should assert true", async function () {
      await Factory.deployed();
      return assert.isTrue(true);
    });
  
    describe("#createChild()",async () => {
      let factory;
      beforeEach(async ()=>{
        factory = await Factory.deployed();
      });
  
      it("should create a new child", async () => {
        await factory.createChild(1);
        await factory.createChild(2);
        await factory.createChild(3);
        const children = await factory.getChildren();
        //console.log(children);
        const child1 = await Child.at(children[0]);
        const child2 = await Child.at(children[1]);
        const child3 = await Child.at(children[2]);
  
        const child1Data = await child1.data();
        const child2Data = await child2.data();
        const child3Data = await child3.data();
  
        assert.equal(children.length, 3);
        assert.equal(child1Data, 1);
        assert.equal(child2Data, 2);
        assert.equal(child3Data, 3);
  
      });
    });
  });