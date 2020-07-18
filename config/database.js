const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config(); // call dotenv

mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(error, client) {
	// client.db() returns the actual database object
	module.exports = client;
	console.log("MongoDB connected.")

	const app = require('../app');
	app.listen(process.env.PORT);
	console.log("Server connected on 8080.")
});