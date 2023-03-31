const { Router } = require('express');
const router = Router();

//controller
const implementController = require('../controllers/installmentController');

//middlewares
const { tokenIsValid, isUser, isAdmin } = require('../middlewares/auth/authMiddlewares');

//routes
router.get('/:id', [tokenIsValid, isUser], implementController.getById);
router.post('/pay', [tokenIsValid, isUser], implementController.createPay);
router.put('/:id', [tokenIsValid, isUser], implementController.unblock);

module.exports = router;
