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
router.post('/edit', authMiddleware,
		body('nickname').isLength({min: 1, max: 30}),
		body('password').isLength({min: 1, max: 30}),
		body('level').isNumeric({min: 1, max: 3}),
		userController.editUser)

router.get('/dictionary/main/add/one', 
		body('russianWord').isLength({min: 1, max: 30}),
		body('englishWord').isLength({min: 1, max: 30}),
		dictionaryController.addWord)
router.get('/dictionary/main/add/many', 
		body().isArray(),
		body('*.russianWord').isLength({min: 1, max: 30}),
		body('*.englishWord').isLength({min: 1, max: 30}),
		dictionaryController.addManyWords)
router.get('/dictionary/main/delete', dictionaryController.deleteWord)
router.get('/dictionary/main/words', dictionaryController.getWords)

router.get('/dictionary/personal/add/one', authMiddleware, 
		body('nextDays').isNumeric({min: 1}),
		userController.addWordToPersonal)
router.get('/dictionary/personal/delete', authMiddleware, userController.deleteWordFromPersonal)
router.get('/dictionary/personal/words/today', authMiddleware, userController.getTodayWords)
router.get('/dictionary/personal/words/possible', authMiddleware, userController.getPossibleWords)

module.exports = router;
