const router = require('express').Router();
const ctrl = require('../controllers/movieController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', authenticate, authorizeAdmin, ctrl.create);
router.put('/:id', authenticate, authorizeAdmin, ctrl.update);
router.delete('/:id', authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;