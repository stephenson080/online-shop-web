const Product = require("../models/product")
const { ObjectID } = require("mongodb")
const { validationResult } = require("express-validator")
const { delefile } = require("../util/file")

exports.postAddProducts = (req, res, next) => {
    const { title, price, description } = req.body
    const image = req.file
    if (!image) {
        return res.status(422).render("admin/edit-product", {
            docTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: "attached fle is not an image",
            validationError: []
        })
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            docTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationError: errors.array()
        })
    }
    const imageUrl = image.path
    const product = new Product({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user
    })
    product.save()
        .then(() => {
            res.redirect("/products")
        })
        .catch(err => {
            const error = new Error(err.message)
            error.statusCode = 500
            return next(error)
        })
}

exports.getAddProductPage = (req, res) => {
    res.render("admin/edit-product",
        {
            docTitle: "Add Product",
            path: "/admin/add-product",
            editing: false,
            errorMessage: null,
            hasError: null,
            validationError: []
        }
    )
}

exports.getEditProductPage = (req, res) => {
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect("/")
    }
    const productId = req.params.productId
    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect("/")
            }
            if (!product) {
                return res.redirect("/")
            }
            res.render("admin/edit-product",
                {
                    docTitle: "Edit Product",
                    path: "/admin/edit-product",
                    editing: editMode,
                    product: product,
                    errorMessage: null,
                    validationError: [],
                    hasError: null
                })
        })
}

exports.editProduct = (req, res, next) => {
    const { productId, title, price, description } = req.body
    const image = req.file
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render("admin/edit-product", {
            docTitle: "Edit Product",
            path: "admin/edit-product",
            editing: true,
            hasError: true,
            product: {
                _id: productId,
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationError: errors.array()
        })
    }
    Product.findById(productId)
        .then(product => {
            product.title = title
            product.price = price
            product.description = description
            if (image) {
                delefile(product.imageUrl)
                product.imageUrl = image.path
            }
            return product.save()
        })
        .then(() => {
            res.redirect("/admin/products")
        })
        .catch(err => {
            const error = new Error(err.message)
            error.statusCode = 500
            return next(error)
        })
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId).then(product => {
        if (!product) {
            return next("No Product Found")
        }
        delefile(product.imageUrl)
        return Product.deleteOne({ _id: productId, userId: req.user._id })
    })
        .then(() => {
            res.status(200).json({ message: "Success" })
        })
        .catch(err => {
            res.status(500).json({ message: "Could not delete product" })
        })
}
exports.getProducts = (req, res) => {
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render("admin/products", { products: products, docTitle: "Admin Products", path: "/admin/products" })
        })
        .catch(err => {
            const error = new Error(err.message)
            error.statusCode = 500
            return next(error)
        })
}