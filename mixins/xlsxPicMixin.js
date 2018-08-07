"use strict";
const _ = require("lodash");
const xml2js = require('xml2js');
const fs = require("fs");
module.exports={

  methods:{
    getPicInfo : async function (dir) {
      //let dir = "/home/henbf/projects/moleculer-demo-services/filehenf/xl/drawings";
      let tmp = await new Promise((resolve)=>{
        let parser = new xml2js.Parser();
        let xmlfile = fs.readFileSync(dir+"/drawing1.xml");
        parser.parseString(xmlfile, function (err, result) {
          let res = [];
          let keys = Object.keys(result);
          // console.log(result[keys[0]]['xdr:twoCellAnchor']);
          //遍历所有的图片大数组
          let pics = result[keys[0]]['xdr:twoCellAnchor'];
          pics.map((mid)=>{
            //mid是每一个图片的参数综合
            //取出左上角坐标
            // console.log(mid['xdr:from']);
            let singleFile = {};
            singleFile['col'] = mid['xdr:from'][0]['xdr:col'][0];
            singleFile['row'] = mid['xdr:from'][0]['xdr:row'][0];
            singleFile['rid'] = mid['xdr:pic'][0]['xdr:blipFill'][0]['a:blip'][0]['$']['r:embed'];

            res.push(singleFile);
          });

          resolve(res);
        });
      });
      //处理下一个xml
    

      let result= await new Promise((resolve)=>{
        let finalResult = [];
        let parser = new xml2js.Parser();
        let xmlfile = fs.readFileSync(dir+"/_rels/drawing1.xml.rels");
        parser.parseString(xmlfile, function (err, result) {
          let url = result['Relationships']['Relationship'];
          let newUrls = [];
          //遍历图片资源数组
          url.map((u)=>{
            newUrls.push(u['$']);
          });

          tmp.map((u,i)=>{
                
            let index = _.findIndex(newUrls,function(o){
              return  o.Id == u.rid;
            });
            tmp[i]['url'] = newUrls[index]['Target'];
            finalResult.push(tmp[i]);
          });
                
          resolve (finalResult) ;
        });
            
      });

      return result;

    }

  }
};