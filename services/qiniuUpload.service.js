const qiniu = require("qiniu");
const property = require("../properties/prop.js");
module.exports = {
	name:"qiniu",

	settings: {

	},
	actions:{
		
		upload: async function(){
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
			let key="test10M0.mp4";
			let localFile = "/home/zouwb/projects/orbit/microServices/qiniu/uploadFileTest/test10M.mp4";
			let putExtra = new qiniu.resume_up.PutExtra();
			putExtra.resumeRecordFile = key + ".log";
			putExtra.progressCallback = function(uploadBytes, totalBytes) {
				console.log("progress:" + uploadBytes + "(" + totalBytes + ")");
			};
			await resumeUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
					respBody, respInfo) {
					if (respErr) {
						throw respErr;
					}
					if (respInfo.statusCode == 200) {
						let downLoadURL = domain+ "/" + respBody.key; 
						return {
							result: "Success",
							res : downLoadURL
						}
					} else {
						return {
							result :"Failed",
							res : respBody
						}
					}
				});
		
			// return gen.then((value)=>{
			// 	this.logger.info(value);
			// 	return {
			// 		msg: "上传成功",
			// 		data: {
			// 			url: value
			// 		}
			// 	};
			// }).catch((err)=>{
			// 	this.logger.info(err);
			// 	return {
			// 		msg: "上传失败",
			// 		err: err
			// 	};
			// });

		},


	},
	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		

	},



};