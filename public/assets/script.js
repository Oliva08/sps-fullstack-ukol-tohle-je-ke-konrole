document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab');
      document.getElementById(tabId + '-tab').classList.add('active');
    });
  });
  
  const itemForm = document.getElementById('item-form');
  const itemIdInput = document.getElementById('item-id');
  const itemNameInput = document.getElementById('item-name');
  const itemQuantityInput = document.getElementById('item-quantity');
  const itemCategorySelect = document.getElementById('item-category');
  const itemSupplierSelect = document.getElementById('item-supplier');
  const saveItemButton = document.getElementById('save-item');
  const cancelEditButton = document.getElementById('cancel-edit');
  
  loadItems();
  loadCategories();
  loadSuppliers();
  
  // Oprava: Přidání event listeneru pro formulář místo tlačítka
  if (itemForm) {
    itemForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveItem();
    });
  }
  
  if (cancelEditButton) {
    cancelEditButton.addEventListener('click', cancelEdit);
  }
  
  // Funkce pro načtení položek ze serveru
  function loadItems() {
    fetch('/api/items')
      .then(response => response.json())
      .then(data => {
        const itemsList = document.getElementById('items-list');
        if (!itemsList) return; // Kontrola existence prvku
        
        itemsList.innerHTML = '';
        
        data.items.forEach(item => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.category || 'Žádná'}</td>
            <td>${item.supplier || 'Žádný'}</td>
            <td class="actions">
              <button class="edit" data-id="${item.id}">Upravit</button>
              <button class="delete" data-id="${item.id}">Smazat</button>
            </td>
          `;
          
          itemsList.appendChild(row);
        });
        
        // Přidání event listenerů pro tlačítka úpravy a mazání
        document.querySelectorAll('.edit').forEach(button => {
          button.addEventListener('click', editItem);
        });
        
        document.querySelectorAll('.delete').forEach(button => {
          button.addEventListener('click', deleteItem);
        });
      })
      .catch(error => console.error('Chyba při načítání položek:', error));
  }
  
  // Funkce pro načtení kategorií ze serveru
  function loadCategories() {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => {
        const categoriesList = document.getElementById('categories-list');
        if (!categoriesList) return;
        
        categoriesList.innerHTML = '';
        
        data.categories.forEach(category => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
          `;
          
          categoriesList.appendChild(row);
        });
        
        if (itemCategorySelect) {
          itemCategorySelect.innerHTML = '<option value="">Vyberte kategorii</option>';
          
          data.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            itemCategorySelect.appendChild(option);
          });
        }
      })
      .catch(error => console.error('Chyba při načítání kategorií:', error));
  }
  
  // Funkce pro načtení dodavatelů ze serveru
  function loadSuppliers() {
    fetch('/api/suppliers')
      .then(response => response.json())
      .then(data => {
        const suppliersList = document.getElementById('suppliers-list');
        if (!suppliersList) return;
        
        suppliersList.innerHTML = '';
        
        data.suppliers.forEach(supplier => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td>${supplier.id}</td>
            <td>${supplier.name}</td>
            <td>${supplier.contact}</td>
          `;
          
          suppliersList.appendChild(row);
        });
        
        if (itemSupplierSelect) {
          itemSupplierSelect.innerHTML = '<option value="">Vyberte dodavatele</option>';
          
          data.suppliers.forEach(supplier => {
            const option = document.createElement('option');
            option.value = supplier.id;
            option.textContent = supplier.name;
            itemSupplierSelect.appendChild(option);
          });
        }
      })
      .catch(error => console.error('Chyba při načítání dodavatelů:', error));
  }
  
  // Funkce pro uložení nebo aktualizaci položky
  function saveItem() {
    if (!itemNameInput || !itemQuantityInput) {
      console.error('Formulářové prvky nebyly nalezeny');
      return;
    }
    
    const item = {
      name: itemNameInput.value,
      quantity: parseInt(itemQuantityInput.value) || 0,
      category_id: itemCategorySelect ? (itemCategorySelect.value || null) : null,
      supplier_id: itemSupplierSelect ? (itemSupplierSelect.value || null) : null
    };
    
    const itemId = itemIdInput ? itemIdInput.value : '';
    const method = itemId ? 'PUT' : 'POST';
    const url = itemId ? `/api/items/${itemId}` : '/api/items';
    
    console.log('Odesílám data:', item, 'metodou:', method, 'na URL:', url);
    
    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Chyba při ukládání: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Odpověď serveru:', data);
        resetForm();
        loadItems();
      })
      .catch(error => {
        console.error('Chyba při ukládání položky:', error);
        alert('Chyba při ukládání položky: ' + error.message);
      });
  }
  
  // Funkce pro úpravu položky
  function editItem() {
    const itemId = this.getAttribute('data-id');
    
    fetch(`/api/items/${itemId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Chyba při načítání položky: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Načtená položka pro úpravu:', data);
        const item = data.item;
        
        if (!item) {
          throw new Error('Položka nebyla nalezena');
        }
        
        if (itemIdInput) itemIdInput.value = item.id;
        if (itemNameInput) itemNameInput.value = item.name;
        if (itemQuantityInput) itemQuantityInput.value = item.quantity;
        if (itemCategorySelect) itemCategorySelect.value = item.category_id || '';
        if (itemSupplierSelect) itemSupplierSelect.value = item.supplier_id || '';
        
        if (saveItemButton) saveItemButton.textContent = 'Aktualizovat';
        if (cancelEditButton) cancelEditButton.style.display = 'block';
      })
      .catch(error => {
        console.error('Chyba při načítání položky pro úpravu:', error);
        alert('Chyba při načítání položky: ' + error.message);
      });
  }
  
  // Funkce pro smazání položky
  function deleteItem() {
    if (confirm('Opravdu chcete smazat tuto položku?')) {
      const itemId = this.getAttribute('data-id');
      
      fetch(`/api/items/${itemId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Chyba při mazání: ' + response.statusText);
          }
          return response.json();
        })
        .then(() => {
          loadItems();
        })
        .catch(error => {
          console.error('Chyba při mazání položky:', error);
          alert('Chyba při mazání položky: ' + error.message);
        });
    }
  }
  
  // Funkce pro zrušení úpravy
  function cancelEdit() {
    resetForm();
  }
  
  // Funkce pro resetování formuláře
  function resetForm() {
    if (itemForm) itemForm.reset();
    if (itemIdInput) itemIdInput.value = '';
    if (saveItemButton) saveItemButton.textContent = 'Uložit';
    if (cancelEditButton) cancelEditButton.style.display = 'none';
  }
});








