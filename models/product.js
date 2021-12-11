const {Schema, model} = require("mongoose")

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})



// const {getDatabase} = require("../util/database")
// const mongoDb = require("mongodb")

// class Product {
//     constructor(title, imageUrl, price, description, _id, userId){
//         this.title = title
//         this.imageUrl = imageUrl
//         this.price = price
//         this.description = description
//         this._id = _id ? new mongoDb.ObjectID(_id) : null
//         this.userId = userId
//     }
//     save(){
//         const db = getDatabase()
//         let dbOperation
//         if(this._id){
//             dbOperation = db.collection("products").updateOne({_id: this._id}, {$set: this})
//         }else{
//             dbOperation = db.collection("products")
//             .insertOne(this)
//         }
//         return dbOperation
//         .then(result=>{
            
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     }
//     static getAllProducts(){
//         const db = getDatabase()
//         return db.collection("products")
//         .find()
//         .toArray()
//         .then(products=>{
            
//             return products
//         })
//     }
//     static getProductById(productId){
//         const db = getDatabase()
//         return db.collection("products")
//         .find({_id: new mongoDb.ObjectID(productId)})
//         .next()
//         .then(product=>{
//             console.log(product)
//             return product
//         })
//         .catch(err => console.log(err))
//     }
//     static deleteProductById(productId){
//         const db = getDatabase()
//         return db.collection("products")
//         .deleteOne({_id: new mongoDb.ObjectID(productId)})
//     }
// }

// const {DataTypes} = require("sequelize")

// const sequelize = require("../util/database")

// const Product = sequelize.define("product", {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     title: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     price: {
//         type: DataTypes.DOUBLE,
//         allowNull: false
//     },
//     description: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     image_url: {
//         type: DataTypes.STRING(1000),
//         allowNull: false,
//     }
// })

module.exports = model("Product", productSchema)


// const fs = require("fs")
// const path = require("path")
// const database = require("../util/database")

// const rootDir = require("../util/path")
// const Cart = require("./cart")

// const pathname = path.join(rootDir, "data", "products.json")

// const getProductsFromFile = (callBackFn)=>{
//     fs.readFile(pathname,(err, fileContent)=>{
//         if (err){
//             callBackFn([])
//         }
//         callBackFn(JSON.parse(fileContent))
//     })
// }

// module.exports = class Product {
//     constructor(id, title, image_url, price, description){
//         this.id = id
//         this.title = title,
//         this.image_url = image_url,
//         this.price = price,
//         this.description = description
//     }

//     addProduct(){
//         const productDetails = [this.title, this.price, this.image_url, this.description]
//         return database.query("INSERT INTO products (title, price, image_url, description) VALUES ($1, $2, $3, $4)", productDetails)
//     }
//     static deleteProduct(id){
//         getProductsFromFile(products=>{
//             const updatedProducts = products.filter(product=> product.id !== id)
//             const product = products.find(prod => prod.id === id)
//             fs.writeFile(pathname, JSON.stringify(updatedProducts), err=>{
//                 if(!err){
//                     Cart.deleteProductFromCart(id, product.price)
//                 }
//             })
//         })
//     }
//     static getAllProducts(){
//         return database.query("SELECT * FROM products")
//     }
//     static findProductById(productId){
//         return database.query("SELECT * FROM products WHERE products.id = $1", [productId])
//     }
// }