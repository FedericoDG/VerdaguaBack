const { Router } = require('express');
const router = Router();

//controller
const mercadopagoController = require('../controllers/mercadopagoController');

//middlewares
const { isUserOrPassenger, tokenIsValid } = require('../middlewares/auth/authMiddlewares');

//routes
router.get('/:id', mercadopagoController.getOrder);
router.post('/webhook/', mercadopagoController.webHook);
router.post('/', [tokenIsValid, isUserOrPassenger], mercadopagoController.post);

module.exports = router;
