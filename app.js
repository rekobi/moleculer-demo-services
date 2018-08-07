"use strict";
const { ServiceBroker } = require("moleculer");
const brokerSetting = require("./settings/broker.js");
const connPool = require("./utils/connectionPool.js");
const broker = new ServiceBroker(brokerSetting);
connPool();
broker.loadServices();
broker.repl();
broker.start();