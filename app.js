if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require ("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require('console');

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() =>{
        console.log("Connected to database");
    })
    .catch(err => console.log(err) );

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride ("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "public")));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on(error , () => {
    console.log("Error on MongoDB Session store" , err);
})

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpsOnly : true,
    },
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

app.all("*" , (req , res , next) => {
    next(new ExpressError(404 ,"Page not Found"));
})

app.use(( err , req , res , next) => {
    let {statusCode=500 , message="Something went wrong"} = err;
    res.status(statusCode).render("./error.ejs" , {message});
});

app.listen(8080 , () => {
    console.log("app is listening to port 8080");
})