"use strict";


const XLSX = require('node-xlsx');
module.exports={

  name:"testaaa",

  version: 3,

  params: {

    num: "number",
    filepath: "string"
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