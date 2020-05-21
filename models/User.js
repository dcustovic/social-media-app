const usersCollection = require('../config/database').db().collection('users');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const md5 = require('md5');


// constructor function, reusable blueprint
let User = function(data) {
	this.data = data;
	this.errors = []
}

User.prototype.validate = function() {
	return new Promise(async (resolve, reject) => {

		// Username validation
		if (this.data.username == "") {
				this.errors.push("You must provide a username.")
		}
	
		if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
				this.errors.push("Username can only contain letters and numbers.")
		}
	
		if (this.data.username.length > 0 && this.data.username.length < 2) {
				this.errors.push("Username must be at least 2 characters long.")
		}
	
		if (this.data.username.length > 30) {
				this.errors.push("Username cannot exceed 30 characters.")
		}
	
		// Email validation
		if (!validator.isEmail(this.data.email)) {
				this.errors.push("You must provide a valid email address.")
		}
	
		// Password validation
		if (this.data.password == "") {
				this.errors.push("You must provide a password.")
		}
	
		if (this.data.password.length > 0 && this.data.password.length < 6) {
				this.errors.push("Password must be at least 6 characters long.")
		}
	
		if (this.data.password.length > 50) {
				this.errors.push("Password cannot exceed 50 characters.")
		}
	
		if (this.data.password !== this.data.passwordConfirm) {
			this.errors.push("Passwords do not match.")
		}

		// check to see if email or username already exists
		if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
			let usernameExists = await usersCollection.findOne({username: this.data.username})
			if (usernameExists) {this.errors.push("The username is already taken.")}
		}

		if (validator.isEmail(this.data.email)) {
			let emailExists = await usersCollection.findOne({email: this.data.email})
			if (emailExists) {this.errors.push("The email is already taken.")}
		}
		resolve();
	});
}

User.prototype.cleanUp = function() {
	if (typeof(this.data.username) != "string") {
			this.data.username = ""
	}

	if (typeof(this.data.email) != "string") {
			this.data.email = ""
	}

	if (typeof(this.data.password) != "string") {
			this.data.password = ""
	}
	
	if (typeof(this.data.passwordConfirm) != "string") {
		this.data.passwordConfirm = ""
}

	// purifying data property
	// no other properties except these
	// trim() deletes white space
	this.data = {
		username: this.data.username.trim(),
		email: this.data.email.trim().toLowerCase(),
		password: this.data.password,
		passwordConfirm: this.data.passwordConfirm
	}
}

User.prototype.login = function() {
	return new Promise((resolve, reject) => {
		this.cleanUp();

		usersCollection.findOne({username: this.data.username}).then((usernameFound) => {
			if (usernameFound && bcrypt.compareSync(this.data.password, usernameFound.password)) {
				this.data = usernameFound
				this.getAvatar();
				resolve("You are logged in.")
			} else {
				reject("The username and password you entered did not match. Please double-check and try again.")
			}
		}).catch(function() {
			reject("Please try again later.")
		});

	});
}

User.prototype.register = function() {
	return new Promise(async (resolve, reject) => {
		// Validate user data
		this.cleanUp();
		await this.validate();
	
		// If there are no validation errors then save to database
		if (!this.errors.length) {
				// hash user password
				let salt = bcrypt.genSaltSync(10);
				this.data.password = bcrypt.hashSync(this.data.password, salt);
				await usersCollection.insertOne(this.data);
				this.getAvatar();
				resolve();
		} else {
			reject(this.errors);
		}
	})
}

User.prototype.getAvatar = function() {
	this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
}


module.exports = User;