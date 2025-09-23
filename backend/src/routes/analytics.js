const express = require('express');
const { getOverview, getCategoryBreakdown, getTrends } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const { analyticsLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(auth);
router.use(analyticsLimiter);

router.get('/overview', getOverview);
router.get('/categories', getCategoryBreakdown);
router.get('/trends', getTrends);

module.exports = router;
