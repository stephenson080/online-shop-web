const path = require("path")
const fs = require("fs")
const PDFDocument = require("pdfkit")
const axios = require('axios').default

const Product = require("../models/product")
const Order = require("../models/order")


const ITEMS_PER_PAGE = 2


exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1
    let totalProduct;
    Product.countDocuments().then(numProduct => {
        totalProduct = numProduct
        return Product
            .find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
    })
        .then(products => {
            res.render("shop/product-list",
                {
                    products: products,
                    docTitle: "Products",
                    path: "/products",
                    hasNextPage: (ITEMS_PER_PAGE * page) < totalProduct,
                    hasPrevPage: page > 1,
                    currentPage: page,
                    nextPage: page + 1,
                    prevPage: page - 1,
                    lastPage: Math.ceil((totalProduct / ITEMS_PER_PAGE))
                })
        })
        .catch(err => {
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })

}
exports.getProductDetails = (req, res) => {
    const productId = req.params.productId

    Product.findById(productId)
        .then(product => {
            res.render("shop/product-detail", { product: product, path: "/products", docTitle: product.title })
        })
        .catch(err => {
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
    // Product.findAll({where: {
    //     id: productId
    // }})
    // .then(product=>{
    //     res.render("shop/product-detail", {product: product[0], path: "/products", docTitle: product[0].title})
    // }).catch(err => console.log(err))


}
exports.getIndex = (req, res) => {
    const page = +req.query.page || 1
    let totalProduct;
    Product.countDocuments().then(numProduct => {
        totalProduct = numProduct
        return Product
            .find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
    })
        .then(products => {
            res.render("shop/index",
                {
                    products: products,
                    docTitle: "Shop",
                    path: "/",
                    hasNextPage: (ITEMS_PER_PAGE * page) < totalProduct,
                    hasPrevPage: page > 1,
                    currentPage: page,
                    nextPage: page + 1,
                    prevPage: page - 1,
                    lastPage: Math.ceil((totalProduct / ITEMS_PER_PAGE))
                })
        })
        .catch(err => {
            console.log(err)
            // const error = new Error(err)
            // error.statusCode = 500
            // return next(error)
        })

}
exports.getCart = (req, res) => {
    req.user.populate("cart.items.productId")
        .execPopulate()
        .then(user => {
            const cartProducts = user.cart.items
            res.render("shop/cart", { docTitle: "Your Cart", path: "/cart", cartProducts: cartProducts })
        })
        .catch(err => {
            console.log(err)
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
    // Cart.getCartProducts(cart =>{
    //     Product.getAllProducts(products=>{
    //         const cartProducts = []
    //         for(let product of products){
    //             const cartProductsData = cart.products.find(prod=> prod.id === product.id)
    //             if(cartProductsData){
    //                 cartProducts.push({productData: product, qty: cartProductsData.qty})
    //             }
    //         }
    //         res.render("shop/cart", {docTitle: "Your Cart", path: "/cart", cartProducts: cartProducts})
    //     })
    // })

}

exports.addToCart = (req, res) => {
    const productId = req.body.productId
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            console.log(result)
            res.redirect("/cart")
        })
        .catch(err => {
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
    // let fetchedCart
    // let newQuantity = 1 
    // req.user
    // .getCart()
    // .then(cart =>{
    //     fetchedCart= cart
    //     return cart.getProducts({where: {id: productId}})
    // })
    // .then(products=>{
    //     let product
    //     if (products.length > 0){
    //         product = products[0]
    //     }
    //     if(product){
    //         const oldQuantity = product.cartItem.quantity
    //         newQuantity = oldQuantity + 1
    //         return product
    //     }
    //     return Product.findAll({
    //         where: {
    //             id: productId
    //         }
    //     })

    // })
    // .then(fetchedProduct=>{
    //     return fetchedCart.addProduct(fetchedProduct, {through: {quantity: newQuantity}})
    // })
    // .then(result=>{
    //     res.redirect("/cart")
    // })
    // .catch(err=>{
    //     console.log(err)
    // })
    // Product.findProductById(productId, product=>{
    //     Cart.addProduct(productId, product.price)
    // })

}

exports.deleteProductFromCart = (req, res) => {
    const productId = req.body.productId
    req.user.deleteProductFromCart(productId)
        .then(result => {
            res.redirect("/cart")
        })
        .catch(err => {
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
    // req.user
    // .getCart()
    // .then(cart=>{
    //     return cart.getProducts({where: {id: productId}})
    // })
    // .then(products=>{
    //     const product = products[0]
    //     return product.cartItem.destroy()
    // })
    // .then(result=>{
    //     res.redirect("/cart")
    // })
}
exports.fetchOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then(orders => {
            res.render("shop/orders", { docTitle: "Your Orders", path: "/orders", orders: orders })
        })
        .catch(err => {
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
    // req.user
    // .getOrders({include: ['products']})
    // .then(orders=>{
    //     res.render("shop/orders", {docTitle: "Your Orders", path: "/orders", orders: orders})
    // })
}
exports.checkout = async (req, res, next) => {
    try {
        let amount = 0
        const user = await req.user.populate("cart.items.productId").execPopulate()
        const products = user.cart.items
        products.forEach(prod => {
            amount += prod.quantity * prod.productId.price
        })
        return res.render("shop/checkout", {
            path: '/checkout',
            docTitle: 'checkout',
            amount: amount / 100,
            email: user.email,
            cartProducts: products
        })

    } catch (err) {
        res.redirect("/500")
        const error = new Error(err)
        error.statusCode = 500
        return next(error)
    }

}
exports.verifyPayment = async (req, res, next) => {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    exports.verifyPayment = async (req, res) => {
        try {
            const reference = req.params.ref
            console.log(reference)
            const resData = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            })
            res.json({
                data: resData.data
            })
        } catch (error) {
            console.log(err)
        }

    }
}
exports.AddToOrders = (req, res) => {
    req.user.populate("cart.items.productId")
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(item => {
                return { quantity: item.quantity, product: { ...item.productId._doc } }
            })
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            })
            return order.save()
        })
        .then(result => {
            return req.user.clearCart()
        })
        .then(() => {
            res.redirect("/orders")
        })
        .catch(err => {
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })



    // req.user.addOrder()
    // .then(result=>{
    //     res.redirect("/orders")
    // })
    // .catch(err=> console.log(err))



    // .getCart()
    // .then(cart=>{
    //     fetchCart = cart
    //     return cart.getProducts()
    // })
    // .then(products=>{
    //     return req.user.createOrder()
    //     .then(order=>{
    //         console.log(order)
    //         return order.addProduct(products.map(product=>{
    //             product.orderItem = {quantity: product.cartItem.quantity}
    //             return product
    //         }))
    //     }).catch(err=> console.log(err))
    // })
    // .then(result=>{
    //     return fetchCart.setProducts(null)
    // })
    // .then(result=>{
    //   res.redirect("/orders")  
    // })
    // .catch(err=> console.log(err))

}


exports.getOrderInvoice = (req, res, next) => {
    const orderId = req.params.orderId
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next("No Order")
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error("You are UnAuthurised"))
            }
            const invoiceName = "invoice-" + orderId + ".pdf"
            const invoicePath = path.join("data", "invoices", invoiceName)
            // fs.readFile(invoicePath, (err, invoice) => {
            //     if (err) {
            //         return next(err)
            //     }
            //     res.setHeader("Content-Type", "application/pdf")
            //     res.setHeader("Content-Disposition", "inline;", "flename='", + invoiceName + "'")
            //     res.send(invoice)
            // })
            const pdfDoc = new PDFDocument()
            res.setHeader("Content-Type", "application/pdf")
            res.setHeader("Content-Disposition", "inline;", "filename='", + invoiceName + "'")
            pdfDoc.pipe(fs.createWriteStream(invoicePath))
            let totalPrice = 0
            pdfDoc.pipe(res)

            pdfDoc.fontSize(26).text("Orderd-" + orderId)
            pdfDoc.text("=========================")
            order.products.forEach(prod => {
                totalPrice += prod.product.price * prod.quantity
                pdfDoc.fontSize(14).text(prod.product.title + "-" + prod.quantity + "x" + prod.product.price)
            })
            pdfDoc.fontSize(20).text("Total Price:" + totalPrice)
            pdfDoc.end()
            // const file = fs.createReadStream(invoicePath)

            // file.pipe(res)
        })
        .catch(err => next(new Error(err))
        )


}

