const {DataTypes} = require("sequelize")
const sequelize = require("../util/database")


const Cart = sequelize.define("cart", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  }
})

module.exports = Cart




// const fs = require("fs")
// const path = require("path")

// const rootDir = require("../util/path")

// const pathname = path.join(rootDir, "data", "cart.json")

// module.exports = class Cart {
//     static addProduct(productId, productPrice) {
//       // Fetch the previous cart
//       fs.readFile(pathname, (err, fileContent) => {
//         let cart = { products: [], totalPrice: 0 };
//         if (!err) {
//           cart = JSON.parse(fileContent);
//         }
//         // Analyze the cart => Find existing product
//         const existingProductIndex = cart.products.findIndex(
//           prod => prod.id === productId
//         );
//         const existingProduct = cart.products[existingProductIndex];
//         let updatedProduct;
//         // Add new product/ increase quantity
//         if (existingProduct) {
//           updatedProduct = { ...existingProduct };
//           updatedProduct.qty = updatedProduct.qty + 1;
//           cart.products = [...cart.products];
//           cart.products[existingProductIndex] = updatedProduct;
//         } else {
//           updatedProduct = { id: productId, qty: 1 };
//           cart.products = [...cart.products, updatedProduct];
//         }
//         cart.totalPrice = cart.totalPrice + (+productPrice);
//         fs.writeFile(pathname, JSON.stringify(cart), err => {
//           console.log(err);
//         });
//       });
//     }
//     static deleteProductFromCart(id, productPrice){
//       fs.readFile(pathname,(err, fileContent)=>{
//         if (err) {
//           console.log(err)
//           return;
//         }
//         const updatedCart = {...JSON.parse(fileContent)}
//         const product = updatedCart.products.find(product => product.id === id)
//         if(!product){
//           return
//         }
//         const productQty = product.qty
//         updatedCart.products = updatedCart.products.filter(prod => prod.id !== id)
//         updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty
//         fs.writeFile(pathname, JSON.stringify(updatedCart), err=>{
//           console.log(err)
//         })
//       })
//     }
//     static getCartProducts(callBackFn){
//       fs.readFile(pathname, (err, fileContent)=>{
//         if(err){
//           callBackFn(null)
//         }else{
//           callBackFn(JSON.parse(fileContent))
//         }
//       })
//     }
//   };
  