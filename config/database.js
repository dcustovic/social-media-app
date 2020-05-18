const mysql = require('mysql2');

let options = 
	{
		host: "localhost",
		user: "root",
		password: "",
		database: "social-media"
	}

let db = mysql.createConnection(options);

db.connect( error => {
    if (error) {
      console.log(error)
    } else {
			console.log("MySQL connected.")
			const app = require('../app')
			const PORT = process.env.PORT || 8080;
			app.listen(PORT, console.log(`Server connected on ${PORT}.`));
		}
});


module.exports = db;