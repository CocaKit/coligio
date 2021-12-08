const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller')
const dictionaryController = require('../controllers/dictionary-controller')
const levelController = require('../controllers/level-controller')
const {body} = require('express-validator')
const authMiddleware = require('../middlewares/auth-middleware')

router.post('/reg', 
		body('email').isEmail(),
		body('password').isLength({min: 1, max: 30}),
		body('nickname').isLength({min: 1, max: 30}),
		userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)
router.get('/users', authMiddleware, userController.getUsers)
router.post('/edit', authMiddleware,
		body('nickname').isLength({min: 1, max: 30}),
		body('level').isNumeric({min: 1, max: 3}),
		userController.editUser)
router.post('/password', authMiddleware,
		body('oldPassword').isLength({min: 1, max: 30}),
		body('newPassword').isLength({min: 1, max: 30}),
		userController.editPassword)

router.post('/dictionary/main/add/one', 
		body('russianWord').isLength({min: 1, max: 30}),
		body('englishWord').isLength({min: 1, max: 30}),
		dictionaryController.addWord)
router.post('/dictionary/main/add/many', 
		body().isArray(),
		body('*.russianWord').isLength({min: 1, max: 30}),
		body('*.englishWord').isLength({min: 1, max: 30}),
		dictionaryController.addManyWords)
router.post('/dictionary/main/delete', dictionaryController.deleteWord)
router.get('/dictionary/main/words', dictionaryController.getWords)
router.post('/dictionary/main/reset', 
		body().isArray(),
		body('*.russianWord').isLength({min: 1, max: 30}),
		body('*.englishWord').isLength({min: 1, max: 30}),
dictionaryController.reset)

router.post('/dictionary/personal/add/one', authMiddleware, 
		body('nextDays').isNumeric({min: 1}),
		userController.addWordToPersonal)
router.post('/dictionary/personal/delete', authMiddleware, userController.deleteWordFromPersonal)
router.post('/dictionary/personal/words/today', authMiddleware, userController.getTodayWords)
router.post('/dictionary/personal/words/possible', authMiddleware, userController.getPossibleWords)

router.post('/level/correct/exercises', authMiddleware, levelController.getLevelCorrectExercisesWords)
router.post('/level/correct/tests', authMiddleware, levelController.getLevelCorrectTestsWords)
router.post('/level/reset', 
		body().isArray(),
		body('*.num').isNumeric({min: 1}),
		body('*.correctExercisesWords').isLength({min: 1, max: 30}),
		body('*.correctTestsWords').isLength({min: 1, max: 30}),
		levelController.reset)
router.post('/level/comments/add', 
		authMiddleware,
		body('message').isLength({min: 1}),
		levelController.addComment)
router.post('/level/comments/show', authMiddleware, levelController.showComment)

module.exports = router;
