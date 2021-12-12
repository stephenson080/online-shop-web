const {MongoClient} = require("mongodb")

let _db

const mongoConnection = (callBackFn)=>{
    MongoClient
    .connect(process.env.DATABASE_URL, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(client=>{
        _db = client.db()
        callBackFn()
    })
    .catch(err=>{
        console.log(err)
    })
}

const getDatabase = ()=>{
    if(_db){
        return _db
    }
    throw "No Databese Fouund!"
}

exports.mongoConnection = mongoConnection
exports.getDatabase = getDatabase


