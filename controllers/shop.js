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
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
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
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
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
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })

}

exports.addToCart = (req, res) => {
    const productId = req.body.productId
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
        })
        .then(result => {
            res.redirect("/cart")
        })
        .catch(err => {
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
}

exports.deleteProductFromCart = (req, res) => {
    const productId = req.body.productId
    req.user.deleteProductFromCart(productId)
        .then(result => {
            res.redirect("/cart")
        })
        .catch(err => {
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
}
exports.fetchOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then(orders => {
            res.render("shop/orders", { docTitle: "Your Orders", path: "/orders", orders: orders })
        })
        .catch(err => {
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
}
exports.checkout = async (req, res, next) => {
    try {
        let amount = 0
        const user = await req.user.populate("cart.items.productId").execPopulate()
        const products = user.cart.items
        products.forEach(prod => {
            amount += prod.quantity * prod.productId.price * 489
        })
        return res.render("shop/checkout", {
            path: '/checkout',
            docTitle: 'Checkout',
            amount: amount / 100,
            email: user.email,
            paystackPK: process.env.PAYSTACK_PUBLIC_KEY,
            cartProducts: products
        })

    } catch (err) {
        const error = new Error(err)
        error.statusCode = 500
        return next(error)
    }

}
exports.verifyPayment = async (req, res, next) => {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
    try {
        const reference = req.params.ref
        const resData = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        })
        req.user.clearCart()
        res.render('shop/success', {
            docTitle: 'Payment Status',
            path: '/status',
            message: `Payment ${resData.data.data.gateway_response}`
        })
    } catch (err) {
        const error = new Error(err.message)
        error.statusCode = 500
        return next(error)
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
            const error = new Error(err.message)
            error.statusCode = 500
            return next(error)
        })
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

        })
        .catch(err => next(new Error(err.message))
        )


}

