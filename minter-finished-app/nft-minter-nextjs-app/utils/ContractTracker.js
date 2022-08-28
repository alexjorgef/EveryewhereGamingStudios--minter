const fs = require('fs');
const path = require('path');

Object.defineProperty(Promise.prototype, "state", {
    get: function(){
        const o = {};
        return Promise.race([this, o]).then(
            v => v === o ? "pending" : "resolved",
            () => "rejected");
    }
});

class CoinTracker {

    #ContractTrackerPath = "";
    #Contracts = {};

    get Contracts() {
        return this.#Contracts;
    }

    /**
     * @param {string} ContractTrackerPath
     */
    set ContractTrackerPath(ContractTrackerPath) {
        this.#ContractTrackerPath = path.resolve(process.cwd(), ContractTrackerPath);
    }

    constructor() {
        this.#ContractTrackerPath = (process && process.env && process.env.ContractTrackerPath) ? process.env.ContractTrackerPath : path.resolve(process.cwd(), '../test/contracts.json');
    }

    async init() {
        console.log('CoinTracker init()');
        const data = await fs.promises.readFile(this.#ContractTrackerPath);
        this.#Contracts = JSON.parse(data);
        console.log('this.#Contracts: ', this.#Contracts);
    }

    async track (name, address) {
        console.log('Track orig data: ', this.Contracts);

        if(!this.Contracts) {
            this.Contracts = {};
        }

        this.Contracts[name] = (address.address) ? address.address : address;

        await fs.promises.writeFile(this.#ContractTrackerPath, JSON.stringify(this.Contracts));
    }
}

module.exports = new CoinTracker();