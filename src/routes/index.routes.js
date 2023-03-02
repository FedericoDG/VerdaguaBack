const { Router } = require('express');
const router = Router();

//routes files
const authRoutes = require('./auth.routes');
const roleRoutes = require('./role.routes');
const userRoutes = require('./user.routes');
const responsibleRoutes = require('./responsible.routes');
const passengerRoutes = require('./passenger.routes');
const contractRoutes = require('./contract.routes');
const institutionRoutes = require('./institution.routes');
const installmentRoutes = require('./installment.routes');
const settingsRoutes = require('./settings.routes');
const balanceRoutes = require('./balance.routes');

router.use('/auth', authRoutes);
router.use('/roles', roleRoutes);
router.use('/users', userRoutes);
router.use('/responsibles', responsibleRoutes);
router.use('/passengers', passengerRoutes);
router.use('/contracts', contractRoutes);
router.use('/institutions', institutionRoutes);
router.use('/installments', installmentRoutes);
router.use('/settings', settingsRoutes);
router.use('/balance', balanceRoutes);

module.exports = router;
