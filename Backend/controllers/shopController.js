const { pool } = require('../config/db');

// @desc    Get all shop items
// @route   GET /api/shop/items
// @access  Public
const getShopItems = async (req, res) => {
  try {
    const [items] = await pool.query('SELECT * FROM shop_items');
    res.json(items);
  } catch (error) {
    console.error('Error fetching shop items:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Purchase an item (simplified)
// @route   POST /api/shop/purchase/:itemId
// @access  Private
const purchaseItem = async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user; // From auth middleware
  const { quantity = 1 } = req.body; // Default quantity to 1

  if (quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    // Get item details
    const [items] = await pool.query('SELECT * FROM shop_items WHERE id = ?', [itemId]);
    if (items.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const item = items[0];

    // Check stock
    if (item.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for ${item.name}. Available: ${item.stock}` });
    }

    // Deduct stock (in a real app, this would involve a transaction)
    await pool.query('UPDATE shop_items SET stock = stock - ? WHERE id = ?', [quantity, itemId]);

    // In a real application, you would also:
    // 1. Deduct points/currency from the user
    // 2. Record the purchase in an 'orders' table
    // 3. Handle shipping/delivery logic

    res.status(200).json({ message: `Successfully purchased ${quantity} x ${item.name}.` });
  } catch (error) {
    console.error('Error purchasing item:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getShopItems, purchaseItem };