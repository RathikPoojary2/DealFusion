const mysql = require('mysql2/promise');

(async () => {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'optimus',
    database: 'offers_app'
  });

  const [rows] = await db.execute('SELECT id, title, price, category, website_url, expiry_date FROM offers WHERE category IN ("Travel", "Food")');
  console.table(rows);

  // Update website_url and expiry_date for mock offers
  await db.execute('UPDATE offers SET website_url = "https://www.makemytrip.com", expiry_date = "2024-12-31" WHERE title = "20% off on International Flights"');
  await db.execute('UPDATE offers SET website_url = "https://www.swiggy.com", expiry_date = "2024-11-30" WHERE title = "Free Delivery on Food Orders"');
  await db.execute('UPDATE offers SET website_url = "https://www.dominos.co.in", expiry_date = "2024-10-31" WHERE title = "Buy 1 Get 1 Free on Pizza"');
  await db.execute('UPDATE offers SET website_url = "https://www.booking.com", expiry_date = "2024-12-15" WHERE title = "Hotel Booking Discount"');

  // Update prices for mock offers to realistic values
  await db.execute('UPDATE offers SET price = 100 WHERE title = "20% off on International Flights"');
  await db.execute('UPDATE offers SET price = 0 WHERE title = "Free Delivery on Food Orders"');
  await db.execute('UPDATE offers SET price = 150 WHERE title = "Buy 1 Get 1 Free on Pizza"');
  await db.execute('UPDATE offers SET price = 50 WHERE title = "Hotel Booking Discount"');

  console.log('Updated mock offers with website_url and expiry_date');

  const [updatedRows] = await db.execute('SELECT id, title, price, category, website_url, expiry_date FROM offers WHERE category IN ("Travel", "Food")');
  console.table(updatedRows);

  await db.end();
})();
