"use strict";

const qiniu = require("qiniu");
const property = require("../properties/prop.js");
module.exports = {
  name:"qiniu",
    
  version: 1,

  settings: {

  },

  params: {
    fileName : "string",
    filePath : "string"
  },
    
  actions:{
		
    upload: {
      handler(ctx) {
        return this.uploadFileToQiNiu(ctx.params.fileName,ctx.params.filePath);
      }
    }


  },
  /**
	 * Events
	 */
  events: {
    "order.create": {
      group:"rua",
      handler(payload){
        console.log(payload);
      }

    }

  },

  /**
	 * Methods
	 */
  methods: {
		
    uploadFileToQiNiu(fileName,filePath) {
      let bucket = property.qiniu.bucket;
      let accessKey = property.qiniu.ACCESS_KEY;
      let secretKey = property.qiniu.SECRET_KEY;
      let domain = property.qiniu.domain;
      let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
      let options = {
        scope: bucket,
      };
      let putPolicy = new qiniu.rs.PutPolicy(options);
            
      let uploadToken = putPolicy.uploadToken(mac);
      let config = new qiniu.conf.Config();
      config.zone = qiniu.zone.Zone_z1;
      config.useCdnDomain = true;
      let resumeUploader = new qiniu.resume_up.ResumeUploader(config);
      // let key="test10M0.mp4";
      let key = fileName;
      // let localFile = "/home/zouwb/projects/orbit/microServices/qiniu/uploadFileTest/test10M.mp4";
      let localFile = filePath;
      let putExtra = new qiniu.resume_up.PutExtra();
      putExtra.resumeRecordFile = key + ".log";
      putExtra.progressCallback = function(uploadBytes, totalBytes) {
        console.log("progress:" + uploadBytes + "(" + totalBytes + ")");
      };
      let gen = new Promise((resolve,reject)=>{
        resumeUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
          respBody, respInfo) {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode == 200) {
            let downLoadURL = domain+ "/" + respBody.key; 
            resolve(downLoadURL);
          } else {
            reject(respBody);
          }
        });
      });
      return gen.then((value)=>{
        this.logger.info(value);
        return {
          msg: "上传成功",
          data: {
            url: value
          }
        };
      }).catch((err)=>{
        this.logger.info(err);
        return {
          msg: "上传失败",
          err: err
        };
      });
			
    },
  },



};