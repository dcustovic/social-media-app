const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const app = express();

let sessionOptions = session({
    secret: "bezveze bezveze",
    store: new MongoStore({client: require('./config/database')}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24, httpOnly: true}
});

app.use(sessionOptions);
app.use(flash());

app.use(function(req, res, next) {

    // make current user id available on the req object
    if (req.session.user) {
        req.visitorId = req.session.user._id
    } else {
        req.visitorId = 0
    }
    // res.locals = object that will be available within ejs templates
    // make user session data available from within view templates
    res.locals.user = req.session.user
    next();
})

const router = require('./router')

// tells express to add user submited data to request object 
// so that it can be accessed through from req.body
// accepts: traditional HTML form submit
app.use(express.urlencoded({extended: false}));
// and also just sending over json data
app.use(express.json());
// tells express to use static files in the folder 'public'
app.use(express.static('public'));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);


module.exports = app;
