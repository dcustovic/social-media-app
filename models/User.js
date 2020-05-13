const validator = require('validator');

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

    if (this.data.username > 0 && this.data.username < 2) {
        this.errors.push("Username must be at least 2 characters long.")
    }

    if (this.data.username > 30) {
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

    if (this.data.password > 0 && this.data.password < 6) {
        this.errors.push("Password must be at least 6 characters long.")
    }

    if (this.data.password > 32) {
        this.errors.push("Password cannot exceed 32 characters.")
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

    // purifying data property
    // no other properties except these
    // trim() deletes white space
    this.data = {
        username: this.data.username.trim(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password
    }
}

User.prototype.register = function() {

    // Validate user data
    this.cleanUp();
    this.validate();
}


module.exports = User;