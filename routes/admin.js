// const path = require("path")
const { body } = require("express-validator/check")
const express = require("express")

const router = express.Router()

const { postAddProducts, getAddProductPage, getProducts, getEditProductPage, editProduct, deleteProduct } = require("../controllers/admin")
const isAuth = require("../middleware/is-auth")


router.post("/add-product", isAuth,
    [
        body("title").isString().isLength({min: 3}).withMessage("Title field is required"),
        body("price").isFloat(),
        body("description").isLength({ min: 8, max: 400 }).withMessage("description field must greater than 8 characters")
    ], postAddProducts)
router.get("/add-product", isAuth, getAddProductPage)
router.post("/edit-product",
    [
        body("title").isString().isLength({min: 3}).withMessage("Title field is required"),
        body("price").isFloat(),
        body("description").isLength({ min: 8, max: 400 }).withMessage("description field must greater than 8 characters")
    ], isAuth, editProduct)
router.get("/edit-product/:productId", isAuth, getEditProductPage)

router.delete("/product/:productId", isAuth, deleteProduct)
router.get("/products", isAuth, getProducts)


module.exports = router