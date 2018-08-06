"use strict";


const XLSX = require('node-xlsx');
module.exports={

  name:"excel",

  version: 3,

  params: {

    filepath: "string"
  },

  actions:{

    json: async function (ctx) {
      let filepath = ctx.params.filepath;

      let workbook = XLSX.parse(filepath);

      let mapsData = [];
      workbook.forEach(rows => {
        let headers = rows.data.shift();
        let temp = {};
        rows.data = rows.data.map(row => {
          let block = {};
          for (var i = 0; i < row.length; i++){
            if(row[i] !== undefined || row[1] !==undefined){
              temp[i] = row[i] || "";
            }
            if(row[i] === undefined){
              block[headers[i]] = temp[i];
            }else{
              block[headers[i]] = row[i];
            }
          }
          return block;
        });
        mapsData.push({
          name: rows.name,
          data: rows.data
        });
      });


      let item = {},
        endData ={
          data : null,
          other: null
        },
        returnData = [],
        others = [];
      for (let i = 0; i < mapsData[0].data.length; i++) {
        let ai = mapsData[0].data[i];
        if(!ai.对内配置){
          let other = Object.values(ai);
          if(JSON.stringify(other) != "[]"){
            other.map((v)=>{
              if(v.length !=0){
                others.push(v);
              }
            });
            
          }
        }else{
          if (!item[ai.材料名称]) {
            let row = Object.assign({},ai);
            delete row.材料名称;
            delete row.是否为必选;
            delete row.是否为单选;
            delete row.说明;
            returnData.push({
              name: ai.材料名称,
              isMust:this.isTrue(ai.是否为必选),
              isSingle: this.isTrue(ai.是否为单选),
              describe: ai.说明,
              rows: [row],
            });
                
            item[ai.材料名称] = ai;
          } else {
            for (let j = 0; j < returnData.length; j++) {
              let temp = returnData[j];
              if (temp.name == ai.材料名称) {
                delete ai.材料名称;
                delete ai.是否为必选;
                delete ai.是否为单选;
                delete ai.说明;
                temp.rows.push(ai);
                break;
              }
            }
          }
        }
        
      }
      endData.data = returnData;
      endData.other = others;
      return JSON.stringify(endData);
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
  methods:{
    isTrue: (value)=>{
      if (value === "Y") {
        return true;
      }else{
        return false;
      }
    }
  }


};