const { Router } = require('express');
const router = Router();

//controller
const generalContractController = require('../controllers/contracts/generalController');
const individualContractController = require('../controllers/contracts/individualController');

//middlewares
const { tokenIsValid, isUser, isAdmin, isUserOrPassenger } = require('../middlewares/auth/authMiddlewares');
const { generalContractExist, generalContractAlreadyExist } = require('../middlewares/contracts/general/generalContractMiddlewares');
const { individualContractExist } = require('../middlewares/contracts/individual/individualContractMiddlewares');
const { validatesCreateForm } = require('../middlewares/contracts/general/validationsFields');
const { validatesCreateForm: validatesCreateFormIndividual } = require('../middlewares/contracts/individual/validationsFields');

//routes -- GENERAL CONTRACTS
router.get('/general', [tokenIsValid, isUser], generalContractController.get);
router.get('/general/codes', [tokenIsValid, isUser], generalContractController.getCodes);
router.get('/general/search', [tokenIsValid, isUser], generalContractController.getByQuery);
router.get('/general/institution/:id', [tokenIsValid, isUser], generalContractController.getByInstitutionId);
router.get('/general/expired/', [tokenIsValid, isUser], generalContractController.getExpired);
router.get('/general/:id', [tokenIsValid, isUser, generalContractExist], generalContractController.getById);
router.post('/general', [tokenIsValid, isUser, validatesCreateForm, generalContractAlreadyExist], generalContractController.create);
router.put('/general/expired/:id', [tokenIsValid, isUser, generalContractExist], generalContractController.editExpired);
router.put('/general/:id', [tokenIsValid, isUser, validatesCreateForm, generalContractExist], generalContractController.edit);
router.delete('/general/:id', [tokenIsValid, isAdmin], generalContractController.delete);

//routes -- INDIVIDUAL CONTRACTS
router.get('/individual', [tokenIsValid, isUser], individualContractController.get);
router.get('/individual/codes', [tokenIsValid, isUser], individualContractController.getCodes);
router.get('/individual/search', [tokenIsValid, isUserOrPassenger], individualContractController.getByQuery);
router.post('/individual/recalculate/:id', [tokenIsValid, isUser], individualContractController.recalculate);
router.get('/individual/installments/:id', [tokenIsValid, isUserOrPassenger], individualContractController.installments);
router.get('/individual/:id', [tokenIsValid, isUser, individualContractExist], individualContractController.getById);
router.post('/individual', [tokenIsValid, isUser, validatesCreateFormIndividual], individualContractController.create);
router.put('/individual/new-implements/:id', [tokenIsValid, isUser], individualContractController.newShares);
router.put(
  '/individual/:id',
  [tokenIsValid, isUser, validatesCreateFormIndividual, individualContractExist],
  individualContractController.edit
);
router.delete('/individual/:id', [tokenIsValid, isAdmin, individualContractExist], individualContractController.delete);

module.exports = router;
