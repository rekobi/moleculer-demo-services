"use strict";
const mongoMix = require("../mixins/mongoMixin.js");


const XLSX = require('node-xlsx');
module.exports={


  name:"ZouwbTest",

  mixins: [mongoMix],


  version: 3,

  params: {

    num: "number",
    filepath: "string"
  },

  actions:{

    mT: async function(ctx){
      let mongo = ctx.params.mongo;
      let result = await mongo.db().collection("rua").findOne({"testid":1});
      return result.testname;

    },

    rua: async function(ctx){
      // let mongo = await global.mongoPool.acquire();
      let mongo = ctx.params.mongo;
      return await mongo.db().collection("rua").find({"testid":1});
      // global.mongoPool.release(mongo);
      
    },
    son: async function (ctx) {
      // console.log(dir);
      var workbook = XLSX.parse("/home/henbf/projects/moleculer-demo/"+ ctx.params.filepath);

      var result = [];
      workbook.forEach(wb => {
        var headers = wb.data.shift();
        wb.data = wb.data.map(wbd => {
          var wbdi = {};
          headers.forEach((h, i) => {
            wbdi[h] = wbd[i] || '';
          });
          // console.log(wbdi);
          return wbdi;
        });
        result.push({
          name: wb.name,
          data: wb.data
        });
      });
      
      console.log(JSON.stringify(result[0].data));
      return JSON.stringify(result[0].data);
    }


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