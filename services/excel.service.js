"use strict";


const XLSX = require('node-xlsx');
const exec = require('child_process').exec;
const path = require('path');

const xlsxPicMix = require('../mixins/xlsxPicMixin.js');

module.exports={

  name:"excel",

  mixins: [xlsxPicMix],

  version: 3,

  params: {

    filepath: "string"
  },

  

  actions:{

    json: async function (ctx) {
      try {
        let filepath = ctx.params.filepath;
        let xmlPath = '';
        await this.unzip(filepath,"filehenf").then((res)=>{
          xmlPath = res;

        });
        let images = await this.getPicInfo(path.dirname(__dirname) + "/" + xmlPath);
        await images.map((res)=>{
          console.log(res);
          ctx.call("v1.qiniu.upload", { fileName: "456.png", filePath: res.imagePath });
        });
        
        // console.log(d);

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
                description: ai.说明,
                headers: ["对内配置","对外配置","成本/元"],
                rows: [Object.values(row)],
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
                  temp.rows.push(Object.values(ai));
                  break;
                }
              }
            }
          }
        
        }
        endData.data = returnData;
        endData.other = others;
        return JSON.stringify(endData);
      } catch (error) {
        console.log(error);
      }
      
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
    },
    unzip: async function(filePath, unzipFolder) {
      return await new Promise((resolve, reject) => {
        let command = `unzip -o ${filePath} -d ${unzipFolder}`;
        exec(command, (err) => {
          if(err) { reject(err); }
    
          // let filePaths = stdout
          // .split('\n')
          // .map(i => i.split(': ')[1])
          // .filter(i => i)
          // .map(i => i.trim());
          
          resolve(unzipFolder + "/xl/drawings");
        });
      });
    }
  }


};