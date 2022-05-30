const db = require('mongoose');
const Food = db.model('foods', {
	name: String, 
	image: String, 
	price: String 
});

module.exports = Food;