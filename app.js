const { ServiceBroker } = require("moleculer");
const brokerSetting = require("./settings/broker.js");
const broker = new ServiceBroker(brokerSetting);
broker.loadServices(folder = "./services", fileMask = "**/*.service.js");
broker.repl();
broker.start();