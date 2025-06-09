const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'inventory.db');

// Kontrola, zda soubor databáze existuje a smazání
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Existující databáze smazána.');
}

// Vytvoření nové databáze
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Chyba při vytváření databáze:', err.message);
    return;
  }
  console.log('Nová databáze vytvořena.');
  
  // Vytvoření tabulek
  db.serialize(() => {
    // Vytvoření tabulky kategorií
    db.run(`
      CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `, (err) => {
      if (err) {
        console.error('Chyba při vytváření tabulky kategorií:', err.message);
      } else {
        console.log('Tabulka kategorií vytvořena.');
        
        // Vložení ukázkových kategorií
        const categories = [
          'Bez mléka',
          'Gelato',
          'Sorbet',
          'Premium',
          'Sezónní'
        ];
        
        const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
        categories.forEach(category => {
          stmt.run(category);
        });
        stmt.finalize();
        console.log('Ukázkové kategorie vloženy.');
      }
    });
    
    // Vytvoření tabulky dodavatelů
    db.run(`
      CREATE TABLE suppliers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT
      )
    `, (err) => {
      if (err) {
        console.error('Chyba při vytváření tabulky dodavatelů:', err.message);
      } else {
        console.log('Tabulka dodavatelů vytvořena.');
        
        // Vložení ukázkových dodavatelů
        const suppliers = [
          { name: 'Mléčné pochoutky', contact: 'kontakt@mlecnepochoutky.cz' },
          { name: 'Ovocná fúze', contact: 'objednavky@ovocnafuze.cz' },
          { name: 'Sladké pocity', contact: 'info@sladkepocity.cz' },
          { name: 'Bio dobroty', contact: 'prodej@biodobroty.cz' }
        ];
        
        const stmt = db.prepare('INSERT INTO suppliers (name, contact) VALUES (?, ?)');
        suppliers.forEach(supplier => {
          stmt.run(supplier.name, supplier.contact);
        });
        stmt.finalize();
        console.log('Ukázkoví dodavatelé vloženi.');
      }
    });
    
    // Vytvoření tabulky položek
    db.run(`
      CREATE TABLE items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 0,
        category_id INTEGER,
        supplier_id INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
      )
    `, (err) => {
      if (err) {
        console.error('Chyba při vytváření tabulky položek:', err.message);
      } else {
        console.log('Tabulka položek vytvořena.');
        
        // Počkání chvíli, aby se zajistilo, že kategorie a dodavatelé jsou vloženi
        setTimeout(() => {
          // Získání ID kategorií
          db.all('SELECT id FROM categories', [], (err, categories) => {
            if (err) {
              console.error('Chyba při získávání kategorií:', err.message);
              return;
            }
            
            // Získání ID dodavatelů
            db.all('SELECT id FROM suppliers', [], (err, suppliers) => {
              if (err) {
                console.error('Chyba při získávání dodavatelů:', err.message);
                return;
              }
              
              // Vložení ukázkových položek
              const items = [
                { name: 'Vanilkový lusk', quantity: 50, category: 1, supplier: 1 },
                { name: 'Čokoládový fudge', quantity: 45, category: 4, supplier: 3 },
                { name: 'Jahodový vír', quantity: 30, category: 2, supplier: 2 },
                { name: 'Mango tango', quantity: 25, category: 3, supplier: 2 },
                { name: 'Mátová čokoládová čipka', quantity: 40, category: 4, supplier: 3 },
                { name: 'Kokosový sen', quantity: 20, category: 1, supplier: 4 },
                { name: 'Dýňové koření', quantity: 15, category: 5, supplier: 4 },
                { name: 'Malinové vlnky', quantity: 35, category: 3, supplier: 2 }
              ];
              
              const stmt = db.prepare(`
                INSERT INTO items (name, quantity, category_id, supplier_id)
                VALUES (?, ?, ?, ?)
              `);
              
              items.forEach(item => {
                const categoryId = item.category <= categories.length ? item.category : null;
                const supplierId = item.supplier <= suppliers.length ? item.supplier : null;
                
                stmt.run(item.name, item.quantity, categoryId, supplierId);
              });
              
              stmt.finalize();
              console.log('Ukázkové položky vloženy.');
              console.log('Naplnění databáze úspěšně dokončeno!');
            });
          });
        }, 1000);
      }
    });
  });
});

function seedDatabase() {
  // Funkce je prázdná, protože celý kód je spouštěn přímo
  console.log('Naplňování databáze...');
}

module.exports = { seedDatabase };
