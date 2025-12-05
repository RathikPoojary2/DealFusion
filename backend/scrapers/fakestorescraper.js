const axios = require('axios');
const crypto = require('crypto');

async function fetchFakeStoreOffers(db, io) {
  const apiUrl = 'https://fakestoreapi.com/products';
  const { data } = await axios.get(apiUrl);
  let newOffers = 0;

  // Category mapping from FakeStoreAPI to our categories
  const categoryMapping = {
    "men's clothing": 'Fashion',
    "women's clothing": 'Fashion',
    'jewelery': 'Jewellery',
    'electronics': 'Electronics'
  };

  // Add mock offers for Travel and Food categories since FakeStoreAPI doesn't have them
  const mockOffers = [
    {
      id: 1001,
      title: '20% off on International Flights',
      description: 'Book international flights with up to 20% discount using our travel partners.',
      price: 25999,
      category: 'Travel',
      url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop',
      external_id: 'travel1',
      website_url: 'https://www.makemytrip.com',
      expiry_date: '2024-12-31'
    },
    {
      id: 1002,
      title: 'Free Delivery on Food Orders',
      description: 'Get free delivery on all food orders above ₹300 from top restaurants.',
      price: 99,
      category: 'Food',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
      external_id: 'food1',
      website_url: 'https://www.swiggy.com',
      expiry_date: '2024-11-30'
    },
    {
      id: 1003,
      title: 'Buy 1 Get 1 Free on Pizza',
      description: 'Enjoy buy 1 get 1 free offer on all pizza varieties at Domino\'s.',
      price: 159,
      category: 'Food',
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop',
      external_id: 'food2',
      website_url: 'https://www.dominos.co.in',
      expiry_date: '2024-10-31'
    },
    
    {
      id: 1004,
      title: 'Hotel Booking Discount',
      description: 'Save up to 30% on hotel bookings for domestic and international destinations.',
      price: 4999,
      category: 'Travel',
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop',
      external_id: 'travel2',
      website_url: 'https://www.booking.com',
      expiry_date: '2024-12-15'
    },
    {
      id: 1005,
      title: 'Train Ticket Discount',
      description: 'Get 15% off on train tickets for domestic journeys.',
      price: 1500,
      category: 'Travel',
      url: 'https://images.unsplash.com/photo-1474487548417-781cb71495f5?w=100&h=100&fit=crop',
      external_id: 'travel3',
      website_url: 'https://www.irctc.co.in',
      expiry_date: '2024-11-20'
    },
    {
      id: 1006,
      title: 'Car Rental Deal',
      description: 'Rent a car for weekend trips with 20% discount.',
      price: 2500,
      category: 'Travel',
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=100&fit=crop',
      external_id: 'travel4',
      website_url: 'https://www.zoomcar.com',
      expiry_date: '2024-12-10'
    },
    {
      id: 1007,
      title: 'Bus Booking Offer',
      description: 'Book bus tickets with 10% discount on RedBus.',
      price: 800,
      category: 'Travel',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=100&h=100&fit=crop',
      external_id: 'travel5',
      website_url: 'https://www.redbus.in',
      expiry_date: '2024-12-05'
    },
    {
      id: 1008,
      title: 'Vacation Package Deal',
      description: 'Exclusive vacation packages to Goa with 25% off.',
      price: 15000,
      category: 'Travel',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
      external_id: 'travel6',
      website_url: 'https://www.thomascook.in',
      expiry_date: '2024-12-20'
    },
    {
      id: 1009,
      title: 'Flat ₹100 Off on Swiggy Orders',
      description: 'Get ₹100 off on food orders above ₹499 using code SWIGGY100.',
      price: 299,
      category: 'Food',
      url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=100&h=100&fit=crop',
      external_id: 'food3',
      website_url: 'https://www.swiggy.com',
      expiry_date: '2025-04-15'
    },
    {
      id: 1010,
      title: 'Free Dessert at McDonald’s',
      description: 'Order a meal above ₹299 and get a free McFlurry at McDonald’s.',
      price: 299,
      category: 'Food',
      url: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=100&h=100&fit=crop',
      external_id: 'food4',
      website_url: 'https://www.mcdelivery.co.in',
      expiry_date: '2025-01-31'
    },
    {
      id: 1011,
      title: '20% Off on Zomato Orders',
      description: 'Use code ZOM20 and enjoy 20% off on all restaurant orders.',
      price: 299,
      category: 'Food',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop',
      external_id: 'food5',
      website_url: 'https://www.zomato.com',
      expiry_date: '2025-02-28'
    },
    {
      id: 1012,
      title: 'Grocery Delivery Free',
      description: 'Free delivery on grocery orders above ₹500.',
      price: 0,
      category: 'Food',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop',
      external_id: 'food6',
      website_url: 'https://www.bigbasket.com',
      expiry_date: '2024-11-15'
    },
    {
      id: 1013,
      title: 'Burger Combo Offer',
      description: 'Buy burger combo and get fries free.',
      price: 199,
      category: 'Food',
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop',
      external_id: 'food7',
      website_url: 'https://www.burgerking.in',
      expiry_date: '2024-10-25'
    },
    {
      id: 1014,
      title: 'Ice Cream Parlor Deal',
      description: 'Buy one scoop get one free at local ice cream parlors.',
      price: 100,
      category: 'Food',
      url: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=100&h=100&fit=crop',
      external_id: 'food8',
      website_url: 'https://www.amul.com',
      expiry_date: '2024-11-10'
    },
     {
    id: 1015,
    title: 'Flat 25% Off on Burger King Meals',
    description: 'Enjoy 25% off on any King-sized meal using code BK25.',
    price: 249,
    category: 'Food',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=100&h=100&fit=crop',
    external_id: 'food9',
    website_url: 'https://www.burgerking.in',
    expiry_date: '2025-03-15'
  },
    {
    id: 1016,
    title: '₹150 Cashback on KFC Orders',
    description: 'Get ₹150 cashback via Paytm on KFC online orders above ₹499.',
    price: 499,
    category: 'Food',
    url: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=100&h=100&fit=crop',
    external_id: 'food10',
    website_url: 'https://online.kfc.co.in',
    expiry_date: '2025-04-30'
  },
   {
    id: 10017,
    title: 'Flight Offer – ₹1000 Off on Domestic Flights',
    description: 'Book any domestic flight and get flat ₹1000 off using code FLY1000.',
    price: 4999,
    category: 'Travel',
    url: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=100&h=100&fit=crop',
    external_id: 'travel17',
    website_url: 'https://www.makemytrip.com',
    expiry_date: '2025-02-28'
  },
  {
    id: 10018,
    title: 'Luxury Hotel Stay Offer',
    description: 'Save up to 40% on 5-star hotel stays across India during the festive season.',
    price: 8999,
    category: 'Travel',
    url: 'https://images.unsplash.com/photo-1501117716987-c8e2a1a7a09c?w=100&h=100&fit=crop',
    external_id: 'travel18',
    website_url: 'https://www.booking.com',
    expiry_date: '2025-03-31'
  },
  {
    id: 10019,
    title: 'International Flight Discount',
    description: 'Get ₹3000 off on round-trip international flights to Singapore, Dubai, and more.',
    price: 27999,
    category: 'Travel',
    url: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?w=100&h=100&fit=crop',
    external_id: 'travel19',
    website_url: 'https://www.goibibo.com',
    expiry_date: '2025-04-15'
  },
    {
    id: 10020,
    title: 'Weekend Getaway Packages',
    description: 'Enjoy 2-night, 3-day weekend trips to hill stations with 20% off.',
    price: 7999,
    category: 'Travel',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop',
    external_id: 'travel20',
    website_url: 'https://www.yatra.com',
    expiry_date: '2025-03-20'
  },
   {
    id: 10021,
    title: 'Cruise Vacation Deal',
    description: 'Book a luxury cruise to the Maldives and get ₹5000 cashback instantly.',
    price: 34999,
    category: 'Travel',
    url: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=100&h=100&fit=crop',
    external_id: 'travel21',
    website_url: 'https://www.costacruises.com/welcome.html',
    expiry_date: '2025-05-31'
  }
  ];

  // Process FakeStoreAPI products
  for (const product of data) {
    const external_id = String(product.id);
    const title = product.title || '';
    const description = product.description || '';
    const priceUSD = product.price || 0;
    // Convert USD to INR (approximate rate: 1 USD = 10 INR for reduced prices)
    const priceINR = Math.round(priceUSD * 10);
    const originalCategory = product.category || '';
    const category = categoryMapping[originalCategory] || 'Fashion'; // Default to Fashion if not mapped
    const url = product.image || '';
    const hash = crypto.createHash('sha256').update(external_id).digest('hex');

    const query = `INSERT IGNORE INTO offers
      (source, external_id, title, description, price, category, url, hash, website_url, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = ['fakestoreapi', external_id, title, description, priceINR, category, url, hash, null, null];

    await new Promise((resolve, reject) => {
      db.query(query, params, (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows > 0) {
          newOffers++;
          const offer = { id: result.insertId, external_id, title, price: priceINR, category, description, url };
          io.emit('newOffer', offer);
          console.log('🆕 New offer added:', title, 'Category:', category, 'Price: ₹' + priceINR);
        }
        resolve();
      });
    });
  }

  // Process mock offers for Travel and Food
  for (const mockOffer of mockOffers) {
    const external_id = String(mockOffer.external_id);
    const hash = crypto.createHash('sha256').update(external_id).digest('hex');

    const query = `INSERT IGNORE INTO offers
      (source, external_id, title, description, price, category, url, hash, website_url, expiry_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = ['mock', external_id, mockOffer.title, mockOffer.description, mockOffer.price, mockOffer.category, mockOffer.url, hash, mockOffer.website_url, mockOffer.expiry_date];

    await new Promise((resolve, reject) => {
      db.query(query, params, (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows > 0) {
          newOffers++;
          const offer = { id: result.insertId, external_id, title: mockOffer.title, price: mockOffer.price, category: mockOffer.category, description: mockOffer.description, url: mockOffer.url };
          io.emit('newOffer', offer);
          console.log('🆕 Mock offer added:', mockOffer.title, 'Category:', mockOffer.category, 'Price: ₹' + mockOffer.price);
        }
        resolve();
      });
    });
  }

  return newOffers;
}

module.exports = { fetchFakeStoreOffers };
