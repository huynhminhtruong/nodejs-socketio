const jwt = require('jsonwebtoken'), config = require('./development')

function verify(req, res, next) {
	const token = req.session.authorization || req.query.access_token

	if (token) {
		jwt.verify(token, config.secret, function(error, decode){
			req.user = decode.user
			res.locals.isLogin = true
			next()
		})
	} else {
		return res.redirect('/login')
	}
}

function generateToken(req, user) {
	var token = jwt.sign({
			user: user, 
			agent: req.headers['user-agent'], 
			exp: Math.floor(new Date().getTime()/1000) + 7*24*60*60
		}, config.secret)

	return token
}

function getToken(req, res, next) {
	next()
}

function isAdmin(req, res, next) {
	res.locals.isAdmin = req.user.isAdmin

	next()
}

function deleteToken(req, res, next) {
	delete req.session.authorization

	next()
}

module.exports = {
	verify: verify, 
	generateToken: generateToken, 
	getToken: getToken, 
	deleteToken: deleteToken, 
	isAdmin: isAdmin
}