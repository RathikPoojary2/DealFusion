import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { OfferDetail } from './components/offers/OfferDetail';
import { SavedOffers } from './components/offers/SavedOffers';
import { AdminPanel } from './components/admin/AdminPanel';
import { Header } from './components/layout/Header';
import { toast, Toaster } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  company: string;
  companyLogo: string;
  validTill: string;
  category: string;
  websiteUrl: string;
  isFeatured: boolean;
  terms?: string;
}

const mockOffers: Offer[] = [
  {
    id: '1',
    title: '10% cashback on HDMI cards',
    description: 'Get 10% cashback on all purchases using HDFC cards',
    discount: '10%',
    company: 'Amazon',
    companyLogo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&h=100&fit=crop',
    validTill: 'Oct 15, 2024',
    category: 'Shopping',
    websiteUrl: 'https://amazon.com',
    isFeatured: true,
    terms: 'Valid on minimum purchase of ₹1000. Cashback will be credited within 30 days.'
  },
  {
    id: '2',
    title: '₹500 off on domestic flights',
    description: 'Save ₹500 on domestic flight bookings',
    discount: '₹500',
    company: 'MakeMyTrip',
    companyLogo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop',
    validTill: 'Sept 28, 2024',
    category: 'Travel',
    websiteUrl: 'https://makemytrip.com',
    isFeatured: true,
    terms: 'Valid on bookings above ₹5000. One time use per user.'
  },
  {
    id: '3',
    title: 'Free delivery on orders above ₹199',
    description: 'Get free delivery on all food orders above ₹199',
    discount: 'Free Delivery',
    company: 'Swiggy',
    companyLogo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop',
    validTill: 'Oct 30, 2024',
    category: 'Food',
    websiteUrl: 'https://swiggy.com',
    isFeatured: false,
    terms: 'Valid in select cities. Cannot be combined with other offers.'
  },
  {
    id: '4',
    title: 'Buy 1 Get 1 Free on shoes',
    description: 'Buy any pair of shoes and get another pair absolutely free',
    discount: 'BOGO',
    company: 'Nike',
    companyLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    validTill: 'Nov 15, 2024',
    category: 'Fashion',
    websiteUrl: 'https://nike.com',
    isFeatured: true,
    terms: 'Valid on select shoe models. Lower priced item will be free.'
  },
  {
    id: '5',
    title: '20% off on electronics',
    description: 'Get 20% off on all electronics items',
    discount: '20%',
    company: 'Best Buy',
    companyLogo: 'https://images.unsplash.com/photo-1510557880182-3eec0a7a7b6a?w=100&h=100&fit=crop',
    validTill: 'Dec 31, 2024',
    category: 'Electronics',
    websiteUrl: 'https://bestbuy.com',
    isFeatured: false,
    terms: 'Valid on select items only.'
  },
  {
    id: '6',
    title: '15% off on groceries',
    description: 'Save 15% on your grocery shopping',
    discount: '15%',
    company: 'Walmart',
    companyLogo: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop',
    validTill: 'Nov 30, 2024',
    category: 'Groceries',
    websiteUrl: 'https://walmart.com',
    isFeatured: false,
    terms: 'Valid on orders above $50.'
  },
  {
    id: '7',
    title: '30% off on furniture',
    description: 'Get 30% discount on all furniture',
    discount: '30%',
    company: 'IKEA',
    companyLogo: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=100&h=100&fit=crop',
    validTill: 'Dec 15, 2024',
    category: 'Furniture',
    websiteUrl: 'https://ikea.com',
    isFeatured: true,
    terms: 'Valid on select collections.'
  },
  {
    id: '8',
    title: 'Free dessert with meal',
    description: 'Get a free dessert with every meal ordered',
    discount: 'Free Dessert',
    company: 'Olive Garden',
    companyLogo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop',
    validTill: 'Oct 20, 2024',
    category: 'Food',
    websiteUrl: 'https://olivegarden.com',
    isFeatured: false,
    terms: 'Valid for dine-in only.'
  },
  {
    id: '9',
    title: 'Buy 2 Get 1 Free on books',
    description: 'Buy two books and get one free',
    discount: 'BOGO',
    company: 'Barnes & Noble',
    companyLogo: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop',
    validTill: 'Nov 10, 2024',
    category: 'Books',
    websiteUrl: 'https://barnesandnoble.com',
    isFeatured: false,
    terms: 'Valid on select titles.'
  },
  {
    id: '10',
    title: '25% off on shoes',
    description: 'Save 25% on all shoe purchases',
    discount: '25%',
    company: 'Foot Locker',
    companyLogo: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=100&h=100&fit=crop',
    validTill: 'Dec 5, 2024',
    category: 'Fashion',
    websiteUrl: 'https://footlocker.com',
    isFeatured: true,
    terms: 'Valid on select brands.'
  },
  {
    id: '11',
    title: '50% off on hotel bookings',
    description: 'Save 50% on hotel bookings worldwide',
    discount: '50%',
    company: 'Booking.com',
    companyLogo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop',
    validTill: 'Dec 20, 2024',
    category: 'Travel',
    websiteUrl: 'https://booking.com',
    isFeatured: false,
    terms: 'Valid on select hotels.'
  },
  {
    id: '12',
    title: 'Free shipping on orders over $25',
    description: 'Get free shipping on all orders over $25',
    discount: 'Free Shipping',
    company: 'Target',
    companyLogo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
    validTill: 'Nov 25, 2024',
    category: 'Shopping',
    websiteUrl: 'https://target.com',
    isFeatured: false,
    terms: 'Valid in the US only.'
  },
  {
    id: '13',
    title: 'Buy 1 Get 1 Half Off on cosmetics',
    description: 'Buy one cosmetic product and get another at half price',
    discount: 'BOGO Half',
    company: 'Sephora',
    companyLogo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop',
    validTill: 'Oct 25, 2024',
    category: 'Beauty',
    websiteUrl: 'https://sephora.com',
    isFeatured: true,
    terms: 'Valid on select products.'
  },
  {
    id: '14',
    title: '20% off on fitness equipment',
    description: 'Get 20% off on all fitness equipment',
    discount: '20%',
    company: 'Dick\'s Sporting Goods',
    companyLogo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop',
    validTill: 'Dec 10, 2024',
    category: 'Sports',
    websiteUrl: 'https://dickssportinggoods.com',
    isFeatured: false,
    terms: 'Valid on select items.'
  },
  {
    id: '15',
    title: 'Free trial on streaming service',
    description: 'Get a free 30-day trial on our streaming service',
    discount: 'Free Trial',
    company: 'Netflix',
    companyLogo: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=100&h=100&fit=crop',
    validTill: 'Ongoing',
    category: 'Entertainment',
    websiteUrl: 'https://netflix.com',
    isFeatured: true,
    terms: 'Cancel anytime.'
  },
  {
    id: '16',
    title: '10% off on coffee',
    description: 'Save 10% on all coffee purchases',
    discount: '10%',
    company: 'Starbucks',
    companyLogo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=100&h=100&fit=crop',
    validTill: 'Nov 5, 2024',
    category: 'Food',
    websiteUrl: 'https://starbucks.com',
    isFeatured: false,
    terms: 'Valid in-store only.'
  },
  {
    id: '17',
    title: '30% off on home appliances',
    description: 'Get 30% off on all home appliances',
    discount: '30%',
    company: 'Home Depot',
    companyLogo: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=100&h=100&fit=crop',
    validTill: 'Dec 1, 2024',
    category: 'Home',
    websiteUrl: 'https://homedepot.com',
    isFeatured: false,
    terms: 'Valid on select appliances.'
  },
  {
    id: '18',
    title: 'Buy 3 Get 1 Free on stationery',
    description: 'Buy three stationery items and get one free',
    discount: 'BOGO',
    company: 'Office Depot',
    companyLogo: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=100&h=100&fit=crop',
    validTill: 'Oct 31, 2024',
    category: 'Office',
    websiteUrl: 'https://officedepot.com',
    isFeatured: false,
    terms: 'Valid on select items.'
  },
  {
    id: '19',
    title: '15% off on pet supplies',
    description: 'Save 15% on all pet supplies',
    discount: '15%',
    company: 'Petco',
    companyLogo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop',
    validTill: 'Nov 15, 2024',
    category: 'Pets',
    websiteUrl: 'https://petco.com',
    isFeatured: false,
    terms: 'Valid on orders over $30.'
  },
  {
    id: '20',
    title: 'Free upgrade on car rentals',
    description: 'Get a free upgrade on car rentals',
    discount: 'Free Upgrade',
    company: 'Hertz',
    companyLogo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
    validTill: 'Dec 25, 2024',
    category: 'Travel',
    websiteUrl: 'https://hertz.com',
    isFeatured: true,
    terms: 'Valid on select locations.'
  }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [savedOffers, setSavedOffers] = useState<string[]>([]);
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Mock authentication functions
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@deals.com' && password === 'admin123') {
      setUser({
        id: '1',
        email: 'admin@deals.com',
        name: 'Admin User',
        isAdmin: true
      });
      toast.success('Welcome back, Admin!');
      return true;
    } else if (email && password) {
      setUser({
        id: '2',
        email,
        name: email.split('@')[0],
        isAdmin: false
      });
      toast.success('Login successful!');
      return true;
    }

    toast.error('Invalid credentials');
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password) {
      setUser({
        id: Math.random().toString(),
        email,
        name,
        isAdmin: false
      });
      toast.success('Account created successfully!');
      return true;
    }
    
    toast.error('Please fill all fields');
    return false;
  };

  const logout = () => {
    setUser(null);
    setSavedOffers([]);
    toast.success('Logged out successfully');
  };

  // Check for saved offer alerts on component mount
  useEffect(() => {
    if (user && savedOffers.length > 0) {
      // Simulate checking for expiring offers
      const today = new Date();
      const alertOffers = offers.filter(offer => {
        const expiryDate = new Date(offer.validTill);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return savedOffers.includes(offer.id) && daysUntilExpiry <= 3 && daysUntilExpiry > 0;
      });

      if (alertOffers.length > 0) {
        toast.info(`${alertOffers.length} saved offer(s) expiring soon!`);
      }
    }
  }, [user, savedOffers, offers]);

  // Remove API fetch useEffect and set offers to mockOffers on mount
  useEffect(() => {
    setOffers(mockOffers);
    setLoading(false);
    setError(null);
  }, []);

  const authContextValue: AuthContextType = {
    user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <div className="min-h-screen bg-white">
          {user && <Header />}
          {loading && <div className="text-center p-4">Loading offers...</div>}
          {error && <div className="text-center p-4 text-red-600">Error: {error}</div>}
          <Routes>
            <Route 
              path="/login" 
              element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <SignUpPage /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard offers={offers} savedOffers={savedOffers} setSavedOffers={setSavedOffers} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/offer/:id" 
              element={user ? <OfferDetail offers={offers} savedOffers={savedOffers} setSavedOffers={setSavedOffers} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/saved-offers" 
              element={user ? <SavedOffers offers={offers} savedOffers={savedOffers} setSavedOffers={setSavedOffers} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user?.isAdmin ? <AdminPanel offers={offers} setOffers={setOffers} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} />} 
            />
            {/* Catch-all route for unmatched paths */}
            <Route 
              path="*" 
              element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
