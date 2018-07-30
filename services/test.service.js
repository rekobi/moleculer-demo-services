module.exports={

name:"test",

version: 3,

params: {

    num: "number"
},

actions:{

    rua: async function(ctx){
        return Number(ctx.params.num)+1;
    },


},



};