# Jan Patrik Oliveira
## Zvolené rozšíření
- Správa inventáře zmrzlinárny
- Sledování zásob, kategorií a dodavatelů

## Popis projektu
Tento projekt implementuje webovou aplikaci pro správu inventáře malé zmrzlinárny. Aplikace umožňuje sledovat stav zásob, přiřazovat jim kategorie a dodavatele.

### Funkce
- Správa položek inventáře (přidání, úprava, mazání)
- Zobrazení kategorií a dodavatelů
- Sledování množství jednotlivých položek

### Technologie
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Databáze: SQLite

## Struktura databáze
- **Tabulka items**
  - id (primární klíč)
  - name (název položky)
  - quantity (množství)
  - category_id (cizí klíč na kategorii)
  - supplier_id (cizí klíč na dodavatele)

- **Tabulka categories**
  - id (primární klíč)
  - name (název kategorie)

- **Tabulka suppliers**
  - id (primární klíč)
  - name (název dodavatele)
  - contact (kontaktní údaje)

## Spuštění aplikace
- Instalace závislostí: `npm install`
- Spuštění serveru: `npm start`
- Naplnění databáze: `npm run seed`
- Otevřete prohlížeč na adrese: `http://localhost:3000`

## API Endpointy
- **GET /api/items** - získání všech položek
- **GET /api/items/:id** - získání konkrétní položky
- **POST /api/items** - vytvoření nové položky
- **PUT /api/items/:id** - aktualizace položky
- **DELETE /api/items/:id** - smazání položky
- **GET /api/categories** - získání všech kategorií
- **GET /api/suppliers** - získání všech dodavatelů
