const Child = artifacts.require("Child");
const Factory = artifacts.require("Factory"); 
module.exports = async (_deployer) => {
    await _deployer.deploy(Child);
    await _deployer.deploy(Factory, Child.address); 
};