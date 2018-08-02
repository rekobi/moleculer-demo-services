"use strict";
module.exports={

  name:"test",

  version: 3,

  params: {

    num: "number"
  },

  actions:{

    rua: async function(){
      // let mongo = await global.mongoPool.acquire();
      // await mongo.db().collection("rua").insertOne({rua : ctx.params.num});
      // global.mongoPool.release(mongo);
      return {
        "name":"rua"
      };
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