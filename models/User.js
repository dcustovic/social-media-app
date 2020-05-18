const db = require('../config/database');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');


// constructor function, reusable blueprint
let User = function(data) {
    this.data = data;
    this.errors = []
}


User.prototype.validate = function() {

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

    if (this.data.password.length > 32) {
        this.errors.push("Password cannot exceed 32 characters.")
		}

		if (this.data.password !== this.data.passwordConfirm) {
			this.errors.push("Passwords do not match.")
		}

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

User.prototype.login = function(callback) {
    this.cleanUp();
		
		try {
			const { email, password } = this.data;

			db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
				console.log(results);

				if (!results || !(await bcrypt.compare(password, results[0].password))) {

					callback("email or password incorrect")

				} else {

					callback("login correct")

					/*
					const id = results[0].id
					const token = jwt.sign({ id }, process.env.JWT_SECRET, {
						expiresIn: process.env.JWT_EXPIRES_IN
					});

					console.log("Token is: " + token)

					const cookieOptions = {
						expires: new Date(
							Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
						),
						httpOnly: true
					}
					res.cookie('jwt', token, cookieOptions);
					res.status(200).redirect('/');
					*/
				}
			});

		} catch (error) {
			console.log(error)
		}
}


User.prototype.register = function() {
    // Validate user data
    this.cleanUp();
    this.validate();

    // If there are no validation errors then save to database
    if (!this.errors.length) {

			const { username, email, password } = this.data;
			console.log(this.data)

			db.query('SELECT email FROM users WHERE email = ?', [email], async () => {
		
					let hashedPassword = await bcrypt.hash(password, 8);
						console.log("Hashed Password: " + hashedPassword);
						
					db.query('INSERT INTO users SET ?', {username: username, email: email, password: hashedPassword}, () => {
						console.log(`${username} inserted into database.`)
					});
			});
    };
}


module.exports = User;