
import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { OfferDetail } from './components/offers/OfferDetail';
import { SavedOffers } from './components/offers/SavedOffers';
import Offers from './components/offers/Offers';
import { AdminPanel } from './components/admin/AdminPanel';
import { Header } from './components/layout/Header';
import { LandingPage } from './components/LandingPage';
import { toast, Toaster } from 'sonner';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import { ErrorBoundary } from './components/ErrorBoundary';

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
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  url: string;
  source: string;
  external_id: string;
  hash: string;
  created_at: string;
  website_url?: string;
  expiry_date?: string;
  company?: string;
  companyLogo?: string;
  discount?: string;
  validTill?: string;
  websiteUrl?: string;
  isFeatured?: boolean;
  terms?: string;
}

const mockOffers: Offer[] = [];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [savedOffers, setSavedOffers] = useState<string[]>([]);
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on app start
  useEffect(() => {
    console.log('Loading user from localStorage...');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        console.log('User loaded:', JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === 'admin@deals.com' && password === 'admin123') {
      const userData: User = {
        id: '1',
        email: 'admin@deals.com',
        name: 'Admin User',
        isAdmin: true
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Welcome back, Admin!');
      return true;
    }
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      if (response.status === 200) {
        const userData: User = {
          id: Math.random().toString(),
          email,
          name: email.split('@')[0],
          isAdmin: false
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login successful!');
        return true;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:5000/register', { email, password });
      if (response.status === 200) {
        toast.success('Account created successfully!');
        return true;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return false;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setSavedOffers([]);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    if (user && savedOffers.length > 0) {
    }
  }, [user, savedOffers, offers]);

  useEffect(() => {
    console.log('Fetching offers...');
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/offers');
        setOffers(response.data);
        setLoading(false);
        console.log('Offers fetched:', response.data.length);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setError('Failed to load offers');
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const authContextValue: AuthContextType = {
    user,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <ErrorBoundary>
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
                element={
                  user ? (
                    <Dashboard
                      offers={offers}
                      savedOffers={savedOffers}
                      setSavedOffers={setSavedOffers}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/offer/:id"
                element={
                  user ? (
                    <OfferDetail
                      offers={offers}
                      savedOffers={savedOffers}
                      setSavedOffers={setSavedOffers}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/saved-offers"
                element={
                  user ? (
                    <SavedOffers
                      offers={offers}
                      savedOffers={savedOffers}
                      setSavedOffers={setSavedOffers}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
<Route
  path="/offers"
  element={
    user ? (
      <Offers offers={offers} savedOffers={savedOffers} setSavedOffers={setSavedOffers} />
    ) : (
      <Navigate to="/login" />
    )
  }
/>
              <Route
                path="/admin"
                element={
                  user?.isAdmin ? (
                    <AdminPanel offers={offers} setOffers={setOffers} />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                }
              />
              <Route
                path="/"
                element={
                  <LandingPage
                    featuredOffers={offers.length > 0 ? offers.slice(0, 3) : mockOffers}
                  />
                }
              />
              <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </ErrorBoundary>
    </AuthContext.Provider>
  );
}


