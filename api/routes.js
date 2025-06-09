const express = require('express');
const router = express.Router();
const itemsController = require('./controllers/itemsController');
const categoriesController = require('./controllers/categoriesController');
const suppliersController = require('./controllers/suppliersController');

// Items routes
router.get('/items', itemsController.getAllItems);
router.get('/items/:id', itemsController.getItemById);
router.post('/items', itemsController.createItem);
router.put('/items/:id', itemsController.updateItem);
router.delete('/items/:id', itemsController.deleteItem);

// Categories routes (read-only as per requirements)
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:id', categoriesController.getCategoryById);

// Suppliers routes (read-only as per requirements)
router.get('/suppliers', suppliersController.getAllSuppliers);
router.get('/suppliers/:id', suppliersController.getSupplierById);

module.exports = router;
