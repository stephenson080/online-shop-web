const { Schema, model } = require("mongoose")

const userSchema = new Schema({
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    token: String,
    toExp: Date,
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity: {
                type: Schema.Types.Number,
                required: true
            }
        }]
    }
})

userSchema.methods.addToCart = function (product) {
    let newQuantity = 1
    const cartProductIndex = this.cart.items.findIndex(p => p.productId.toString() == product._id.toString())
    const updatedCartItems = [...this.cart.items]
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
        updatedCartItems.push({ productId: product._id, quantity: newQuantity })
    }
    const updatedCart = { items: updatedCartItems }
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.deleteProductFromCart = function (productId) {
    const updatedItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString())
    this.cart.items = updatedItems
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] }
    return this.save()
}


// const {ObjectID} = require("mongodb")
// const {getDatabase} = require("../util/database")


// class User{
//     constructor(name, email,cart, id){
//         this.name = name
//         this.email = email
//         this._id = id
//         this.cart = cart

//     }
//     save(){
//         const db = getDatabase()
//         return db.collection("users").insertOne(this)
//     }
//     addToCart(product){
//         let newQuantity = 1
//         const cartProductIndex = this.cart.items.findIndex(p=> p.productId.toString() == product._id.toString())
//         const updatedCartItems = [...this.cart.items]
//         if(cartProductIndex>=0){
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1
//             updatedCartItems[cartProductIndex].quantity = newQuantity
//         }else{
//             updatedCartItems.push({productId: product._id, quantity: newQuantity})
//         }
//         const updatedCart = {items: updatedCartItems}
//         const db = getDatabase()
//         return db.collection("users").updateOne({_id: new ObjectID(this._id)}, {$set: {cart: updatedCart}})
//     }
//     static findById(userId){
//         const db = getDatabase()
//         return db.collection("users").findOne({_id: new ObjectID(userId)}).then(user=>{
//             console.log(user)
//             return user
//         }).catch(err=> console.log(err))
//     }
//     getCartProducts(){
//         const db = getDatabase()
//         const productIds = this.cart.items.map(item=> item.productId)
//         return db.collection("products")
//         .find({_id: {$in: productIds}})
//         .toArray()
//         .then(products=>{
//             return products.map(product=>{
//                 return{
//                     ...product,
//                     quantity: this.cart.items.find(item=>{
//                         return item.productId.toString() === product._id.toString()
//                     }).quantity
//                 }
//             })
//         })
//     }
//     deleteProductFromCart(productId){
//         const updatedItems = this.cart.items.filter(item => item.productId.toString() !== productId)
//         const db = getDatabase()
//         return db.collection("users")
//         .updateOne({_id: new ObjectID(this._id)}, {$set: {cart: {items: updatedItems}}})
//     }
//     addOrder(){
//         const db = getDatabase()
//         return this.getCartProducts()
//         .then(products=>{
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new ObjectID(this._id),
//                     name: this.name
//                 }
//             }
//             return db.collection("orders").insertOne(order)
//         })
//         .then(result=>{
//             this.cart= {items: []}
//             return db.collection("users")
//             .updateOne({_id: new ObjectID(this._id)}, {$set: {cart: {items: []}}})
//         })
//     }
//     getOrders(){
//         const db = getDatabase()
//         return db.collection("orders")
//         .find({"user._id": new ObjectID(this._id)})
//         .toArray()
//     }
// }

// const {DataTypes} = require("sequelize");
// const sequelize = require("../util/database")

// const User = sequelize.define("user",{
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         allowNull: false,
//         autoIncrement: true
//     },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     email: {
//         type: DataTypes.STRING(50),
//         allowNull: false
//     }
// })

module.exports = model("User", userSchema)