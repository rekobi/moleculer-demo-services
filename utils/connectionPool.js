"use strict";
const MongoClient = require("mongodb").MongoClient;
const generic_pool = require("generic-pool");
const mongoSettings = require("../settings/mongo.js");
module.exports = async function (options) {
  //先加载mongo设定
  options = options || {};
  let host = options.host || mongoSettings.host;
  let port = options.port || mongoSettings.port;
  let max = options.max || mongoSettings.pool_connection_max;
  let min = options.min || mongoSettings.pool_connection_min;
  let timeout = options.timeout || 30000;
  let db = options.db || mongoSettings.dbName;
  let mongoUrl = options.uri || options.url;
  //拼装url
  if(!mongoUrl) {
    if (options.user && options.pass) {
      mongoUrl = 'mongodb://' + options.user + ':' + options.pass + '@' + host + ':' + port;
    } else {
      mongoUrl = 'mongodb://' + host + ':' + port;
    }
    if (db) {
      mongoUrl = mongoUrl + '/' + db;
    }
  }
  //造一个factory
  const factory = {
    create: function() {
      return new Promise((resolve) => {
        MongoClient.connect(mongoUrl, {
          poolSize: 1,
          native_parser: true,
          useNewUrlParser: true
        }, function (err, client) {
          if (err) throw err;
          resolve(client);
        });
      });
    },
    destroy: function (client) {
      client.close();
    }
  };

  //创造连接池实例
  try{
    let mongoPool = generic_pool.createPool(factory, {
      max,
      min,
      idleTimeoutMillis : timeout
    });
      //放入全局变量以供调用
    global.mongoPool = mongoPool;
    console.log("连接池创建成功！");
  }
  catch(e){
    console.error("连接池创建失败！");
    console.error(e);
  }
  


};

