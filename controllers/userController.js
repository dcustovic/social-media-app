const User = require('../models/User');


exports.login = function(req, res) {
    let user = new User(req.body)
    user.login()
    .then(function(resolve) {
        req.session.user = {favColor: "blue", username: user.data.username}
        res.session.save(function() {
					res.redirect('/')
				})
    })
    .catch(function(reject) {
        res.send(reject);
    })
    
};

exports.logout = function(req, res) {
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
			res.render('home-dashboard', {username: req.session.user.username})
    } else {
			res.render('homepage')
    }
};