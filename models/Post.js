const postsCollection = require('../config/database').db().collection("posts");

let Post = function(data) {
    this.data = data;
    this.errors = []
}


Post.prototype.cleanUp = function() {
    if (typeof(this.data.title) != "string") {this.data.title = ""}
    if (typeof(this.data.body) != "string") {this.data.body = ""}

    // getting rid of any extra properties
    // only these properties are allowed in db
    this.data = {
        title: this.data.title.trim(),
        body: this.data.body.trim(),
        createdDate: new Date()
    }
}

Post.prototype.validate = function() {
    if (this.data.title == "") {
        this.errors.push("You must provide a title.")

    } 
    if (this.data.title == "") {
        this.errors.push("You must provide a title.")
    }
}

Post.prototype.create = function() {
    return new Promise((resolve, reject) => {
			this.cleanUp();
			this.validate();

			if (!this.errors.length) {
				// save post to db if no validation errors
				postsCollection.insertOne(this.data).then(() => {
					resolve();
				}).catch(() => {
					this.errors.push("Please try again later.")
					reject(this.errors);
				})
			} else {
				reject(this.errors);
			}
		})
}

module.exports = Post;