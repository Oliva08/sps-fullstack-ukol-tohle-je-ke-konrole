const { db } = require('../../database/db');

// Get all categories
const getAllCategories = (req, res) => {
  const sql = 'SELECT * FROM categories';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ categories: rows });
  });
};

// Get category by ID
const getCategoryById = (req, res) => {
  const sql = 'SELECT * FROM categories WHERE id = ?';
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ category: row });
  });
};

module.exports = {
  getAllCategories,
  getCategoryById
};
