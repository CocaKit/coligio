var express = require('express');
var router = express.Router();
const userController = require('../controllers/user-controller')

router.post('/reg', userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
// activate on email
router.get('/activate/:link', userController.activate)
// refresh token
router.get('/refresh', userController.refresh)
router.get('/users', userController.getUsers)

module.exports = router;
