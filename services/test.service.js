"use strict";
module.exports={

  name:"test",

  version: 3,

  params: {

    num: "number"
  },

  actions:{

    rua: async function(ctx){
      let mongo = await global.mongoPool.acquire();
      console.log(mongo);
      await mongo.db().collection("rua").insertOne({rua : ctx.params.num});
      global.mongoPool.release(mongo);
      return Number(ctx.params.num)+1;
    },


  },
  events: {
    "order.create": {
      group:"norua",
      handler(payload){
        console.log(payload);
      }

    }

  },


};