const db = require('mongoose');
const Order= db.model('orders', {
	fullName: String, 
	email: String, 
	phoneNumber: String,
	cardNumber: String,
    address: String,
    total: String,
    details: Array
});

module.exports = Order;
