const express = require('express');
const router = express.Router();

const loginController = require('../controllers/login.controller')

router.get('/',loginController.login)
router.post('/',loginController.loginPost)
router.get('/register',loginController.register)
router.post('/register',loginController.registerPost)
router.get('/logout',loginController.logout)

module.exports = router;