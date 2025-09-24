const express = require('express');
const router = express.Router();
const { getShopItems, purchaseItem } = require('../controllers/shopController');
const { protect } = require('../middleware/authMiddleware');

router.get('/items', getShopItems);
router.post('/purchase/:itemId', protect, purchaseItem);

module.exports = router;