"use strict";

module.exports = {
  //从连接池中取mongo链接，并在结束时释放
  hooks: {
    before: {
      "*": async function (ctx) {
        if (ctx.params.useMongo) {
          ctx.params.mongo = await global.mongoPool.acquire();
        }
      }
    },

    after: {

      "*": async function(ctx,res) {
        if (ctx.params.useMongo) {
          global.mongoPool.release(ctx.params.mongo);
          delete ctx.params.mongo;
          return res;
        }

      }


    }

  }


};