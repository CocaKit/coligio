const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller')
const dictionaryController = require('../controllers/dictionary-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/reg', 
		body('email').isEmail(),
		body('password').isLength({min: 1, max: 30}),
		body('nickname').isLength({min: 1, max: 30}),
		userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
// activate on email
router.get('/activate/:link', userController.activate)
// refresh token
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)

router.get('/dictionary/add/one', 
		body('russianWord').isLength({min: 1, max: 30}),
		body('englishWord').isLength({min: 1, max: 30}),
		dictionaryController.addWord)
router.get('/dictionary/add/many', 
		body().isArray(),
		body('*.russianWord').isLength({min: 1, max: 30}),
		body('*.englishWord').isLength({min: 1, max: 30}),
		dictionaryController.addManyWords)
router.get('/dictionary/delete', dictionaryController.deleteWord)
router.get('/dictionary/words', dictionaryController.getWords)

module.exports = router;
