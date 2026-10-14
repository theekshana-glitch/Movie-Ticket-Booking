const router = require('express').Router();
const ctrl = require('../controllers/seatController');

router.get('/', ctrl.list);
router.get('/:showId', ctrl.get);

module.exports = router;