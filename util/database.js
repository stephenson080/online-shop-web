const {MongoClient} = require("mongodb")

let _db

const mongoConnection = (callBackFn)=>{
    MongoClient
    .connect("mongodb+srv://stephen:pathagoras1555@cluster0.xrlnc.mongodb.net/online-shop?retryWrites=true&w=majority", {useUnifiedTopology: true, useNewUrlParser: true})
    .then(client=>{
        console.log("Connected!")
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


// const {Sequelize} = require("sequelize")

// const sequelize = new Sequelize("online-shop", "postgres", "pathagoras1555", {
//     dialect: "postgres",
//     host: "localhost",
//     port: "5433"
// })
// exports.pool = new Pool({
//     host: "localhost",
//     user: "postgres",
//     password: "pathagoras1555",
//     port: "5433",
//     database: "online-shop"
// })
// const client = new Client({
//     host: "localhost",
//     user: "postgres",
//     password: "pathagoras1555",
//     port: "5433",
//     database: "online-shop"
// })

// client.connect()
// module.exports = sequelize