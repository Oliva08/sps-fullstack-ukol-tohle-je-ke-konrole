const { db } = require('../../database/db');

// Get all suppliers
const getAllSuppliers = (req, res) => {
  const sql = 'SELECT * FROM suppliers';
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ suppliers: rows });
  });
};

// Get supplier by ID
const getSupplierById = (req, res) => {
  const sql = 'SELECT * FROM suppliers WHERE id = ?';
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ supplier: row });
  });
};

module.exports = {
  getAllSuppliers,
  getSupplierById
};


