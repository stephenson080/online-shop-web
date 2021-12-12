const path = require("path")
const express = require("express")
const router = express.Router();

const {getProducts, getIndex, getCart, fetchOrders, getProductDetails, addToCart, deleteProductFromCart, AddToOrders, getOrderInvoice, checkout, verifyPayment} = require("../controllers/shop")
const isAuth = require("../middleware/is-auth")

router.get("/products", getProducts)
router.get("/products/:productId", getProductDetails)
router.get("/cart", isAuth, getCart)
router.post("/cart", isAuth, addToCart)
router.post("/cart-delete-item", isAuth, deleteProductFromCart)
router.post("/create-order", isAuth, AddToOrders)
router.get('/verify-payment/:ref', isAuth, verifyPayment )
router.get("/orders", isAuth, fetchOrders)
router.get("/orders/:orderId", isAuth, getOrderInvoice)
router.get("/checkout", isAuth, checkout )
router.get("/", getIndex)

module.exports = router

// https://cdn.pixabay.com/photo/2016/03/31/20/51/book-1296045_960_720.png