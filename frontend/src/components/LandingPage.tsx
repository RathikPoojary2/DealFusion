import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Offer } from '../App';
import { Search, Heart, Calendar, ExternalLink, Flame, Star, Shield, Zap, Sparkles, TrendingUp, Users, Award } from 'lucide-react';

interface LandingPageProps {
  featuredOffers: Offer[];
}

export function LandingPage({ featuredOffers }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Logo */}
      <div className="bg-black text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-black text-orange-400">DealFusion</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,165,0,0.3),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,165,0,0.2),transparent_50%)]"></div>
        </div>

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-6">
              <Sparkles className="inline-block text-orange-400 mb-4" size={48} />
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 text-black">
              Discover Amazing <span className="text-black">Deals</span>
            </h1>
            <p className="text-xl md:text-2xl text-black mb-10 max-w-4xl mx-auto leading-relaxed">
              Transform your shopping experience with AI-powered deal discovery.
              Save thousands while staying ahead of the curve.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold px-10 py-5 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="mr-2" size={20} />
                  Start Saving Now
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-2 border-white text-black hover:bg-white hover:text-black px-10 py-5 text-lg backdrop-blur-sm bg-white/10 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Users className="mr-2" size={20} />
                  Join Community
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
              <div className="bg-white text-black p-6 rounded-lg border-2 border-gray-200 shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-400">{featuredOffers.length}+</div>
                  <div className="text-black font-medium">Hot Deals</div>
                </div>
              </div>
              <div className="bg-white text-black p-6 rounded-lg border-2 border-gray-200 shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-400">20+</div>
                  <div className="text-black font-medium">Top Brands</div>
                </div>
              </div>
              <div className="bg-white text-black p-6 rounded-lg border-2 border-gray-200 shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-400">1000+</div>
                  <div className="text-black font-medium">Smart Users</div>
                </div>
              </div>
              <div className="bg-white text-black p-6 rounded-lg border-2 border-gray-200 shadow-lg">
                <div className="text-center">
                  <div className="text-4xl font-black text-orange-400">$50K+</div>
                  <div className="text-black font-medium">Saved Daily</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make it easy to find, save, and claim the best deals from your favorite brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Find deals by category, brand, or discount type with our powerful search engine.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Save Favorites</h3>
              <p className="text-gray-600">
                Save your favorite deals and get notified when they're about to expire.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Alerts</h3>
              <p className="text-gray-600">
                Never miss a deal with our smart notification system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Deals Preview */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 flex items-center justify-center">
              <Flame className="text-orange-500 mr-3" size={40} />
              Featured Deals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Check out some of our hottest deals right now. Sign up to access all deals!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredOffers.slice(0, 6).map(offer => (
              <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-orange-200">
                <CardHeader className="relative">
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white">
                    <Flame size={12} className="mr-1" />
                    Featured
                  </Badge>

                  <div className="flex items-center space-x-3">
                    <img
                      src={offer.companyLogo}
                      alt={offer.company}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-black text-black">{offer.company}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {offer.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <h3 className="font-semibold text-black mb-2">{offer.title}</h3>
                  <CardDescription className="mb-4">{offer.description}</CardDescription>

                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-black text-white px-3 py-1 rounded-lg font-bold">
                      {offer.discount}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={14} className="mr-1" />
                      Valid till {offer.validTill}
                    </div>
                  </div>

                  <div className="text-center">
                    <Link to="/signup">
                      <Button className="w-full bg-black text-white hover:bg-gray-800">
                        Sign Up to Claim
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-4">
                View All Deals
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-4">Ready to Save Big?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of smart shoppers who are already saving money with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-4 text-lg">
                Start Saving Today
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-black px-8 py-4 text-lg">
                Already Have Account?
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Offer Discovery Platform</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Your trusted partner for finding the best deals and offers from top brands.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span>© 2024 All rights reserved</span>
              <span>•</span>
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
