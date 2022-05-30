const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home.controller');

router.get('/',homeController.index)
router.get('/foods',homeController.foods)
router.get('/order',homeController.order)
router.post('/order',homeController.orderPost)
router.get('/carts/',homeController.carts)
router.get('/add-cart/:id',homeController.addCart)
router.get('/edit-cart/:status/:id',homeController.editCart)

module.exports = router;