"use strict";

const xlsx = require('node-xlsx');

module.exports={
  name:"xls",

  version: 3,

  params: {

    filepath: "string"
  },

  actions:{
    parseToJson: async function (ctx) {
      let workSheetsFromFile = xlsx.parse(ctx.params.filepath);
      let result =await workSheetsFromFile.map(sheet=>{
        let sheetJson = [];
        let resSingleSheet=[];
        //第一层遍历sheet
        // console.log(sheet.name);
        //第一行取出来当key
        let tit = sheet.data.shift();
            
        let fill=( accu , curr ) => {
          if(!curr[6]){
            return curr;
          }
          if( !curr[0] ) {
            curr[0] = accu[0];
          }
          if( !curr[1] ) {
            curr[1] = accu[1];
          }
          if( !curr[2] ) {
            curr[2] = accu[2];
          }
          if(!curr[3]){
            curr[3] = "";
          }
          resSingleSheet.push(curr);
          return curr;
        };
        let xlsLength = 0;
        let temp = {
          name :"",
          parent : [],
          children : []
        };
        let parseJson = (accu,curr,index) => {
                
          if(!curr[6] || !accu){
            return curr;
          }
          if(curr[0] !== accu[0]) {
            sheetJson.push(temp);
            temp = {
              name :"",
              parent : [],
              children : []
            };
            for(let ii = 0 ; ii<=3 ; ii++){
              let t = {};
              let t1 = tit[ii];
              let t2 = curr[ii];
              t[t1] = t2;
              temp.parent.push(t);
            }
    
          }
    
          for(let ii = 4 ; ii<=6 ; ii++){
            let t = {};
            let t1 = tit[ii];
            let t2 = curr[ii];
            t[t1] = t2;
            temp.children.push(t);
    
          }
    
          if(++index === xlsLength){
            sheetJson.push(temp);
          }
          return curr;
        };
    
        sheet.data.reduce(fill,[]);
        xlsLength = resSingleSheet.length;
        // console.log(resSingleSheet);
        resSingleSheet.reduce(parseJson,[]);
            
        sheetJson.shift();
        // console.log(JSON.stringify(sheetJson));
        return  sheetJson;
        
      });
      return result;
    }
    
  }
};