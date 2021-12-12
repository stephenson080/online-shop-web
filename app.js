const path = require("path")
const moongoose = require("mongoose")
const session = require("express-session")
const MongoDbStore = require("connect-mongodb-session")(session)
const express = require("express");
const bodyParser = require("body-parser")
const csrf = require("csurf")
const flash = require("connect-flash")
const multer = require("multer")

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// const {mongoConnection} = require("./util/database")

const shopRoutes = require("./routes/shop")
const adminRoutes = require("./routes/admin")
const authRoutes = require("./routes/auth")
const {get404Page,get500Page} = require("./controllers/errors")

const store = new MongoDbStore({
    uri: process.env.DATABASE_URL,
    collection: "session"
})
const csrfProtection = csrf()
// const Product = require("./models/product")
const User = require("./models/user")
// const Cart = require("./models/cart")
// const CartItem = require("./models/cart-item")
// const Order = require("./models/order")
// const OrderItem = require("./models/order-item")

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "images")
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now().toString() + "_" + file.originalname)
    }
})
// const fileFilter = (req, file,cb)=>{
//     if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg", file.mimetype === "image/png"){
//         cb(null, true)
//     }else{
//         cb(null, false)
//     }
// }

app.set("view engine", "ejs")
app.set("views", "views")

app.use(bodyParser.urlencoded({extended: false}))
app.use(multer({storage: fileStorage}).single("image"))
app.use(express.static(path.join(__dirname, "public")))
app.use("/images", express.static(path.join(__dirname, "images")))
app.use(session({
    resave: false, saveUninitialized: false, secret: "PathTech", store: store 
}))
app.use(csrfProtection)
app.use(flash())
app.use((req,res, next)=>{
    if(!req.session.user){
        return next()
    }
    User.findById(req.session.user._id)
    .then(user=>{
        if(!user){
            return next()
        }
        req.user = user
        next()
    }).catch(err=> {
        throw new Error(err)
    })
    
    // User.findAll({
    //     where: {
    //         id: 1
    //     }
    // }).then(user=>{
    //     req.user = user[0]
    //     next()
    // }).catch(err=> console.log(err))
})

app.use((req,res,next)=>{
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use("/admin", adminRoutes )
app.use(shopRoutes);
app.use(authRoutes)

app.get("/500", get500Page )

app.use(get404Page)

app.use((err,req,res,next)=>{
    res.redirect("/500")
})

const PORT = process.env.PORT || 3000

moongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(result=>{
    app.listen(PORT,()=>{
        console.log("app is running")
    })
})
// mongoConnection(()=>{
//     app.listen(3000,()=>{
//         console.log("app is running")
//     })
// })

// app.use((req,res, next)=>{
//     User.findAll({
//         where: {
//             id: 1
//         }
//     }).then(user=>{
//         req.user = user[0]
//         next()
//     }).catch(err=> console.log(err))
// })







// Product.belongsTo(User)
// User.hasMany(Product)
// User.hasOne(Cart)
// Cart.belongsTo(User)
// Cart.belongsToMany(Product, {through: CartItem})
// Product.belongsToMany(Cart, {through: CartItem})
// User.hasMany(Order)
// Order.belongsTo(User)
// Product.belongsToMany(Order, {through: OrderItem})
// Order.belongsToMany(Product, {through: OrderItem})
// sequelize
//     // .sync({force: true})
//     .sync()
//     .then(result=>{
//         // console.log(result)
//         return User.findAll({where: {
//             id: 1
//         }})
//     })
//     .then(user=>{
//         if(!user[0]){
//             return User.create({
//                 name: "Stephen",
//                 email: "test@test.com"
//             })
//         }
//         return user[0]
//     })
//     .then(user=>{
//         return user.createCart()
//     })
//     .then(cart =>{
//         console.log(cart)
//         app.listen(3000, ()=>{
//             "app is running"
//         })
//     })
//     .catch(err => console.log(err))
