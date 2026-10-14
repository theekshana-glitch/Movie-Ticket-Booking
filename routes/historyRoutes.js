const router = require('express').Router();
const ctrl = require('../controllers/historyController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, ctrl.list);
router.post('/', authenticate, ctrl.create);
router.delete('/:id', authenticate, ctrl.remove);

module.exports = router;