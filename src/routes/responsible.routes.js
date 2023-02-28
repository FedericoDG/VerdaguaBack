const { Router } = require('express');
const router = Router();

//controller
const responsibleController = require('../controllers/responsibleController');

//middlewares
const { tokenIsValid, isUser, isAdmin } = require('../middlewares/auth/authMiddlewares');
const { responsibleExist, responsibleAlreadyExist } = require('../middlewares/responsible/responsibleMiddlewares');
const { validatesCreateForm } = require('../middlewares/responsible/validationsFields');

//routes
router.get('/', [tokenIsValid, isUser], responsibleController.get);
router.get('/documents', [tokenIsValid, isUser], responsibleController.getDocuments);
router.get('/search', [tokenIsValid, isUser], responsibleController.getByQuery);
router.get('/:id', [tokenIsValid, isUser, responsibleExist], responsibleController.getById);
router.post('/', [tokenIsValid, isUser, validatesCreateForm, responsibleAlreadyExist], responsibleController.create);
router.put('/:id', [tokenIsValid, isUser, validatesCreateForm, responsibleExist], responsibleController.edit);
router.delete('/:id', [tokenIsValid, isAdmin], responsibleController.delete);

module.exports = router;
