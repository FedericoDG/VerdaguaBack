const { Router } = require('express');
const router = Router();

//controller
const roleController = require('../controllers/roleController');

//middlewares
const { roleExist } = require('../middlewares/role/roleMiddlewares');
const { tokenIsValid, isAdmin } = require('../middlewares/auth/authMiddlewares');

//outes
router.get('/', [tokenIsValid, isAdmin], roleController.get);
router.post('/add', [tokenIsValid, isAdmin], roleController.create);
router.delete('/delete/:id', [tokenIsValid, isAdmin], roleExist, roleController.delete);

module.exports = router;
