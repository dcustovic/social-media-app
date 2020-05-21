const User = require('../models/User');


exports.login = function(req, res) {
	let user = new User(req.body);
	user.login().then(function(resolve){
		req.session.user = {username: user.data.username}
		req.session.save(function() {
			res.redirect('/')
		}) 
	}).catch(function(reject) {
		req.flash('logErrors', reject)
		// req.session.flash.errors = [reject]
		req.session.save(function() {
			res.redirect('/')
		})
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
	
	user.register().then(() => {
		req.session.user = {username: user.data.username}
		req.session.save(function() {
			res.redirect('/')
		})
	}).catch((regErrors) => {
		regErrors.forEach(function(error) {
			req.flash('regErrors', error)
		})
		req.session.save(function() {
			res.redirect('/')
		})
	})
};

exports.home = function(req, res) {
	if (req.session.user) {
		res.render('home-dashboard', {username: req.session.user.username})
	} else {
		res.render('homepage', {logErrors: req.flash('logErrors'), regErrors: req.flash('regErrors')})
	}
};