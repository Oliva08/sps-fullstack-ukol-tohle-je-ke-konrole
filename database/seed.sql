-- Delete existing data
DELETE FROM items;
DELETE FROM categories;
DELETE FROM suppliers;

-- Reset auto-increment counters
DELETE FROM sqlite_sequence WHERE name='items';
DELETE FROM sqlite_sequence WHERE name='categories';
DELETE FROM sqlite_sequence WHERE name='suppliers';

-- Insert categories
INSERT INTO categories (name) VALUES ('Dairy');
INSERT INTO categories (name) VALUES ('Fruits');
INSERT INTO categories (name) VALUES ('Nuts');
INSERT INTO categories (name) VALUES ('Toppings');
INSERT INTO categories (name) VALUES ('Cones');
INSERT INTO categories (name) VALUES ('Packaging');

-- Insert suppliers
INSERT INTO suppliers (name, contact) VALUES ('Dairy Delights', 'John Smith, 555-1234');
INSERT INTO suppliers (name, contact) VALUES ('Fresh Fruits Co.', 'Mary Johnson, 555-5678');
INSERT INTO suppliers (name, contact) VALUES ('Nutty Supplies', 'Robert Brown, 555-9012');
INSERT INTO suppliers (name, contact) VALUES ('Sweet Toppings Inc.', 'Sarah Davis, 555-3456');
INSERT INTO suppliers (name, contact) VALUES ('Cone Crafters', 'Michael Wilson, 555-7890');

-- Insert sample items
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Vanilla Ice Cream Base', 20, 1, 1);
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Chocolate Ice Cream Base', 15, 1, 1);
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Strawberries', 8, 2, 2);
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Bananas', 12, 2, 2);
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Almonds', 5, 3, 3);
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Chocolate Sprinkles', 10, 4, 4);
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Waffle Cones', 50, 5, 5);
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Sugar Cones', 75, 5, 5);
INSERT INTO items (name, quantity, category_id, supplier_id) VALUES ('Paper Cups', 100, 6, 5);











