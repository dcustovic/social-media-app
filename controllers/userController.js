const User = require('../models/User');


exports.login = function(req, res) {
	let user = new User(req.body);
	user.login()
	.then(function(){
		req.session.user = {email: user.data.email}
		req.session.save(function() {
			res.redirect('/')
		}) 
	})
	.catch(function(reject) {
		res.send(reject)
	})
};

exports.logout = function(req, res) {
	// callback function because it needs to wait for the user to logout
	req.session.destroy(function() {
		res.redirect('/')
	})
};

exports.register = function(req, res) {
	let user = new User(req.body);
	user.register();

	if (user.errors.length) {
			res.send(user.errors)
	} else {
			res.render('register')
	}
};

exports.home = function(req, res) {
	if (req.session.user) {
		res.render('home-dashboard', {name: req.session.user.email})
	} else {
		res.render('homepage')
	}
};