

module.exports = {
  
  
  //负载均衡设置
  registry:{ 
    strategy:"CpuUsage",
    strategyOptions:{ 
      sampleCount:3,
      lowCpuUsage:10
    }
  },
  // nodeID: "zwbTest",

  logLevel: "fatal",

  transporter: "AMQP",//设定通信方式为NATS 默认连接到'nats://nats-server:4222'
    
  serializer: "JSON",//设定序列化格式
    
  requestTimeout: 10 * 1000,//设定超时时间
    
};