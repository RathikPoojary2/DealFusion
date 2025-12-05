import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { useAuth } from '../../App';
import { LogOut, Heart, Settings, Home } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-white px-3 py-1">
              <span className="text-black font-black text-xl tracking-tight">DEALSFUSION</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-white text-black font-medium' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Home size={18} />
              <span>Discover</span>
            </Link>
            
            <Link 
              to="/saved-offers" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/saved-offers') 
                  ? 'bg-white text-black font-medium' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Heart size={18} />
              <span>Saved Offers</span>
            </Link>

            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin') 
                    ? 'bg-white text-black font-medium' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Settings size={18} />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-black transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden py-3 border-t border-gray-800">
          <nav className="flex items-center justify-around">
            <Link 
              to="/dashboard" 
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-white text-black' 
                  : 'text-gray-300'
              }`}
            >
              <Home size={18} />
              <span className="text-xs">Discover</span>
            </Link>
            
            <Link 
              to="/saved-offers" 
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                isActive('/saved-offers') 
                  ? 'bg-white text-black' 
                  : 'text-gray-300'
              }`}
            >
              <Heart size={18} />
              <span className="text-xs">Saved</span>
            </Link>

            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin') 
                    ? 'bg-white text-black' 
                    : 'text-gray-300'
                }`}
              >
                <Settings size={18} />
                <span className="text-xs">Admin</span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}