const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');

router.get('/',adminController.index)

//router user
router.get('/users',adminController.user)
router.post('/add-users',adminController.addUser)
router.post('/edit-users',adminController.editUser)
router.get('/delete-users/:id',adminController.deleteUser)

//router food
router.get('/foods',adminController.food)
router.post('/add-foods',adminController.addFood)
router.post('/edit-foods',adminController.editFood)
router.get('/delete-foods/:id',adminController.deleteFood)

//router order
router.get('/orders',adminController.orders)
router.get('/delete-orders/:id',adminController.deleteOrder)

module.exports = router;