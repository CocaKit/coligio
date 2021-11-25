var express = require('express');
var router = express.Router();
const userController = require('../controllers/user-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/reg', 
		body('email').isEmail(),
		body('password').isLength({min: 6, max: 18}),
		body('nickname').isLength({min: 1, max: 14}),
		userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
// activate on email
router.get('/activate/:link', userController.activate)
// refresh token
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

module.exports = router;
