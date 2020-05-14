const { Sequelize } = require('sequelize');

const db = new Sequelize('social-media', 'root', null, {
    host: '127.0.0.1',
    dialect: "mysql"
  });


db.authenticate()
.then(function() { 
console.log("MySQL connected.")
const app = require('../app')
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server connected on ${PORT}.`));
}).catch(error => console.log("Error is: " + error));