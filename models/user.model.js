const db = require('mongoose');
const User = db.model('users', {
	fullname: String, 
	email: String, 
	password: String 
});

module.exports = User;