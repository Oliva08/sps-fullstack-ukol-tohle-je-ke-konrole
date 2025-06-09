const { db } = require('../../database/db');

// Získání všech položek
const getAllItems = (req, res) => {
  const sql = `
    SELECT i.id, i.name, i.quantity, c.name as category, s.name as supplier,
           i.category_id, i.supplier_id
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN suppliers s ON i.supplier_id = s.id
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Chyba při získávání položek:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ items: rows });
  });
};

// Získání položky podle ID
const getItemById = (req, res) => {
  const sql = `
    SELECT i.id, i.name, i.quantity, i.category_id, i.supplier_id, 
           c.name as category, s.name as supplier
    FROM items i
    LEFT JOIN categories c ON i.category_id = c.id
    LEFT JOIN suppliers s ON i.supplier_id = s.id
    WHERE i.id = ?
  `;
  
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      console.error('Chyba při získávání položky:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Položka nebyla nalezena' });
    }
    res.json({ item: row });
  });
};

// Vytvoření nové položky
const createItem = (req, res) => {
  const { name, quantity, category_id, supplier_id } = req.body;
  
  console.log('Přijatá data pro vytvoření:', req.body);
  
  if (!name || quantity === undefined) {
    return res.status(400).json({ error: 'Název a množství jsou povinné' });
  }
  
  const sql = `
    INSERT INTO items (name, quantity, category_id, supplier_id)
    VALUES (?, ?, ?, ?)
  `;
  
  db.run(sql, [name, quantity, category_id, supplier_id], function(err) {
    if (err) {
      console.error('Chyba při vytváření položky:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    res.status(201).json({
      id: this.lastID,
      name,
      quantity,
      category_id,
      supplier_id,
      message: 'Položka úspěšně vytvořena'
    });
  });
};

// Aktualizace položky
const updateItem = (req, res) => {
  const { name, quantity, category_id, supplier_id } = req.body;
  const itemId = req.params.id;
  
  console.log('Přijatá data pro aktualizaci:', req.body, 'ID:', itemId);
  
  if (!name && quantity === undefined && category_id === undefined && supplier_id === undefined) {
    return res.status(400).json({ error: 'Je vyžadován alespoň jeden parametr k aktualizaci' });
  }
  
  // Nejprve zkontrolujeme, zda položka existuje
  db.get('SELECT * FROM items WHERE id = ?', [itemId], (err, row) => {
    if (err) {
      console.error('Chyba při kontrole existence položky:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Položka nebyla nalezena' });
    }
    
    // Sestavení aktualizačního dotazu na základě poskytnutých polí
    const updates = [];
    const values = [];
    
    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    
    if (quantity !== undefined) {
      updates.push('quantity = ?');
      values.push(quantity);
    }
    
    if (category_id !== undefined) {
      updates.push('category_id = ?');
      values.push(category_id);
    }
    
    if (supplier_id !== undefined) {
      updates.push('supplier_id = ?');
      values.push(supplier_id);
    }
    
    values.push(itemId);
    
    const sql = `UPDATE items SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(sql, values, function(err) {
      if (err) {
        console.error('Chyba při aktualizaci položky:', err.message);
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ 
        message: 'Položka úspěšně aktualizována',
        changes: this.changes
      });
    });
  });
};

// Smazání položky
const deleteItem = (req, res) => {
  const sql = 'DELETE FROM items WHERE id = ?';
  
  db.run(sql, [req.params.id], function(err) {
    if (err) {
      console.error('Chyba při mazání položky:', err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Položka nebyla nalezena' });
    }
    
    res.json({ message: 'Položka úspěšně smazána' });
  });
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};

