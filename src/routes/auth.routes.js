const { Router } = require('express');
const router = Router();

//controller
const authController = require('../controllers/authController');

//middlewares
const { tokenIsValid } = require('../middlewares/auth/authMiddlewares');
const { userExist } = require('../middlewares/user/userMiddlewares');
const { validatesLoginForm } = require('../middlewares/user/validationsFields');
const { PassengerExist } = require('../middlewares/passenger/logginPassenger');

//routes
router.post('/login', [validatesLoginForm, userExist], authController.login);
router.post('/loginpassenger', [PassengerExist], authController.loginPassenger);

module.exports = router;
