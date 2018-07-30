const { ServiceBroker } = require("moleculer");
const brokerSetting = require("./settings/brokerSetting.js");
const broker = new ServiceBroker(brokerSetting);
broker.loadServices(folder = "./services", fileMask = "**/*.service.js");
