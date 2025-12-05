const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'optimus',
  database: 'offers_app'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');

  // Update categories
  db.query('UPDATE offers SET category = "Fashion" WHERE category IN ("men\'s clothing", "women\'s clothing")', (err, result) => {
    if (err) throw err;
    console.log('Updated categories for', result.affectedRows, 'offers to Fashion');

    db.query('UPDATE offers SET category = "Jewellery" WHERE category = "jewelery"', (err, result) => {
      if (err) throw err;
      console.log('Updated categories for', result.affectedRows, 'offers to Jewellery');

      db.query('UPDATE offers SET category = "Electronics" WHERE category = "electronics"', (err, result) => {
        if (err) throw err;
        console.log('Updated categories for', result.affectedRows, 'offers to Electronics');

        // Update prices to reduced INR for existing FakeStoreAPI offers
        db.query('UPDATE offers SET price = ROUND(price / 8.3) WHERE source = "fakestoreapi"', (err, result) => {
          if (err) throw err;
          console.log('Updated prices for', result.affectedRows, 'offers to INR');

          // Show sample results
          db.query('SELECT id, title, price, category FROM offers LIMIT 10', (err, rows) => {
            if (err) throw err;
            console.log('Updated Offers:', rows);
            db.end();
          });
        });
      });
    });
  });
});
