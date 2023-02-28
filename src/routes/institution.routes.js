const { Router } = require('express');
const router = Router();

//controller
const institutionController = require('../controllers/institutionController');

//middlewares
const { tokenIsValid, isUser, isAdmin } = require('../middlewares/auth/authMiddlewares');
const { institutionExist, institutioAlreadyExist } = require('../middlewares/institution/institutionMiddlewares');
const { validatesCreateForm } = require('../middlewares/institution/validationsFields');

//routes
router.get('/', [tokenIsValid, isUser], institutionController.get);
router.get('/search', [tokenIsValid, isUser], institutionController.getByQuery);
router.get('/codes', [tokenIsValid, isUser], institutionController.getCodes);
router.get('/:id', [tokenIsValid, isUser, institutionExist], institutionController.getById);
router.post('/', [tokenIsValid, isUser, validatesCreateForm, institutioAlreadyExist], institutionController.create);
router.put('/:id', [tokenIsValid, isUser, validatesCreateForm, institutionExist], institutionController.edit);
router.delete('/:id', [tokenIsValid, isAdmin], institutionController.delete);

module.exports = router;
