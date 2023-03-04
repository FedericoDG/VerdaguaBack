const { Router } = require('express');
const router = Router();

//controller
const settingsController = require('../controllers/settingesController');

//middlewares
const { tokenIsValid, isUser, isAdmin } = require('../middlewares/auth/authMiddlewares');

//routes
router.get('/', [tokenIsValid, isUser], settingsController.get);
router.put('/', [tokenIsValid, isUser], settingsController.edit);

module.exports = router;
