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
    expect(await main.then(()=>broker.call("v3.ZouwbTest.mT",{useMongo:true}))).toEqual("rua");
    main.then(()=>broker.stop());
    
    await global.mongoPool.drain().then(function() {
      global.mongoPool.clear();
    });
  });
});