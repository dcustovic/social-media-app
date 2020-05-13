const express = require('express');
const app = express();

const router = require('./router')


// tells express to add user submited data to request object 
// so that it can be accessed through from req.body
// accepts: traditional HTML form submit
app.use(express.urlencoded({extended: false}));
// and also just sending over json data
app.use(express.json());

app.use(express.static('public'));

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use('/', router);

app.listen(8080);