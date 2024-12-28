require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000||process.env.PORT;
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');




//TEMPLATING ENGINE
app.use(express.static('public'));
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine','ejs');



//  connecting to database
const DB = process.env.DATA.replace('<PASSWORD>', encodeURIComponent(process.env.PASS));



mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(con => {
    console.log('DB connection successful!');
}).catch(err => {
    console.error('DB connection error:', err);
});


//REQUIRING NPMS FOR ADMIN REGISTRATION 
const cookieParser = require("cookie-parser"); 
const MongoStore = require("connect-mongo");
const session = require('express-session');

//PASSING MIDDLEWARES FOR GTTING INPUT FROM THE WEBSITE
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store:MongoStore.create({
        mongoUrl: process.env.DATA.replace('<PASSWORD>', encodeURIComponent(process.env.PASS))
    })
    
}))


//ROUTES
mainRoute = require('./server/routes/main');
adminRoute = require('./server/routes/admin');


//INITIALISING ROUTES
app.use('/',mainRoute);
app.use('/',adminRoute);


app.listen(PORT,()=>{
    console.log(`The app is listening to port ${PORT}`);
})