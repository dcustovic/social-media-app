// constructor function, reusable blueprint
const validator = require('validator');


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



User.prototype.register = function() {
    // Validate user data
    this.validate()

}


module.exports = User;