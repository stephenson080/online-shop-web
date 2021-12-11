const Product = require("../models/product")
const { ObjectID } = require("mongodb")
const { validationResult } = require("express-validator")
const { delefile } = require("../util/file")

exports.postAddProducts = (req, res, next) => {
    const { title, price, description } = req.body
    console.log(req.file)
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
    // req.user.createProduct({
    //     title: title,
    //     image_url: imageUrl,
    //     price: price,
    //     description: description
    // })
    // .then(result=>{
    //     res.redirect("/products")
    // })
    // .catch(err=> console.log(err))
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
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
    // Product.create({
    //     title: title,
    //     image_url: imageUrl,
    //     price: price,
    //     description: description,
    //     userId: req.user.id
    // })

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
    // Product.findAll({where: {
    //     id: productId
    // }})
    // .then(product=>{
    //     if (!product){
    //         return res.redirect("/")
    //     }
    //     res.render("admin/edit-product",
    //      {docTitle: "Edit Product",
    //       path: "/admin/edit-product",
    //        editing: editMode,
    //         product: product[0]})
    // }).catch(err=> console.log(err))    
}

exports.editProduct = (req, res, next) => {
    console.log("in editMethod")
    const { productId, title, price, description } = req.body
    const image = req.file
    console.log(image)
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log(errors.array())
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
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
    // Product.findAll({where: {
    //     id: id
    // }})
    // .then(product=>{
    //     console.log(product[0])
    //     product[0].title = title
    //     product[0].image_url = imageUrl
    //     product[0].price = price
    //     product[0].description = description
    //     return product[0].save()
    // })
    // .then(result=>{
    //     res.redirect("/admin/products")
    // }).catch(err=> console.log(err))
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId
    console.log(productId)
    Product.findById(productId).then(product => {
        if (!product) {
            return next("No Product Found")
        }
        delefile(product.imageUrl)
        return Product.deleteOne({ _id: productId, userId: req.user._id })
    })
    .then(() => {
            res.status(200).json({message: "Success"})
    })
    .catch(err => {
            res.status(500).json({message: "Could not delete product"})
    })
    // Product.findAll({where:{
    //     id: productId
    // }}).then(product=>{
    //     return product[0].destroy()
    // }).then(result=>{
    //     res.redirect("/admin/products")
    // }).catch(err=>{
    //     console.log(err)
    // })

}
exports.getProducts = (req, res) => {
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render("admin/products", { products: products, docTitle: "Admin Products", path: "/admin/products" })
        })
        .catch(err => {
            console.log(err)
            res.redirect("/500")
            const error = new Error(err)
            error.statusCode = 500
            return next(error)
        })
    // Product.findAll()
    // .then(products=> {
    //     res.render("admin/products", {products: products, docTitle: "Admin Products", path: "/admin/products"})
    // })
    //     // .catch(err => console.log(err))
    //     // Product.getAllProducts(products=>{

    //     // }
    //     // )
}