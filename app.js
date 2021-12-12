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

const shopRoutes = require("./routes/shop")
const adminRoutes = require("./routes/admin")
const authRoutes = require("./routes/auth")
const {get404Page,get500Page} = require("./controllers/errors")

const store = new MongoDbStore({
    uri: process.env.DATABASE_URL,
    collection: "session"
})
const csrfProtection = csrf()
const User = require("./models/user")

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, "images")
    },
    filename: (req,file,cb)=>{
        cb(null, Date.now().toString() + "_" + file.originalname)
    }
})


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
