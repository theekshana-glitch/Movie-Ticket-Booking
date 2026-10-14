const router = require('express').Router();
const ctrl = require('../controllers/bookingController');
const { authenticate } = require('../middleware/authMiddleware');


router.get('/report', authenticate, ctrl.report);
router.get('/report/csv', authenticate, ctrl.reportCSV);

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.get);
router.post('/', authenticate, ctrl.create);
router.put('/:id/status', authenticate, ctrl.updateStatus);
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;