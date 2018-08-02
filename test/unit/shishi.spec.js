"use strict";
const brokerSettings = require("../../settings/broker.js");
const testService = require("../../services/test.service.js");
const { ServiceBroker } = require("moleculer");
const connectionPool = require("../../utils/connectionPool.js");
describe('wo shi shi',()=>{
  connectionPool();
  let broker = new ServiceBroker(brokerSettings);
  broker.createService(testService);
  it('ruaaaaaaaa',async function () {
    let main = broker.start();
    let num = 1919;
    expect(await main.then(()=>broker.call("v3.test.rua",{num:num}))).toEqual(++num);
    main.then(()=>broker.stop());
    global.mongoPool.destroy();
  });

});