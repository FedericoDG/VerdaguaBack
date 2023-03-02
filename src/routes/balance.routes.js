const { Router } = require('express');
const router = Router();

//controller
const balanceController = require('../controllers/balanceController');

//middlewares
const { tokenIsValid, isUser, isAdmin } = require('../middlewares/auth/authMiddlewares');

//routes
router.get('/', [tokenIsValid, isUser], balanceController.get);
router.post('/', [tokenIsValid, isUser], balanceController.create);

module.exports = router;
