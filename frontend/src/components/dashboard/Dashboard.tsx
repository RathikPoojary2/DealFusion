import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Offer } from '../../App';
import { Search, Heart, Calendar, ExternalLink, Flame } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardProps {
  offers: Offer[];
  savedOffers: string[];
  setSavedOffers: React.Dispatch<React.SetStateAction<string[]>>;
}

export function Dashboard({ offers, savedOffers, setSavedOffers }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(offers.map(offer => offer.category)))];

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredOffers = offers.slice(0, 3); // Show first 3 offers as featured for now

  const toggleSaveOffer = (offerId: string) => {
    if (savedOffers.includes(offerId)) {
      setSavedOffers(prev => prev.filter(id => id !== offerId));
      toast.success('Offer removed from saved offers');
    } else {
      setSavedOffers(prev => [...prev, offerId]);
      toast.success('Offer saved! You\'ll get alerts before it expires.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-black text-white rounded-2xl p-8 mb-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Discover Amazing <span className="text-gray-400">Deals</span>
            </h1>
            <p className="text-gray-300 text-lg mb-6 max-w-2xl">
              Find the best offers, save your favorites, and never miss a deal again. 
              Get instant alerts when your saved offers are about to expire.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Flame className="text-orange-400" size={16} />
                <span>{featuredOffers.length} featured deals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="text-red-400" size={16} />
                <span>{savedOffers.length} saved offers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1 min-w-[400px] max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={20} />
            <Input
              placeholder="Search offers, titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black focus:outline-none transition-all duration-200 w-full text-base"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? "bg-black text-white" 
                  : "border-gray-300 text-gray-700 hover:border-black hover:text-black"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Offers */}
        {featuredOffers.length > 0 && selectedCategory === 'All' && !searchTerm && (
          <div className="mb-8">
            <h2 className="text-2xl font-black mb-4 flex items-center">
              <Flame className="text-orange-500 mr-2" />
              Featured Deals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredOffers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  isSaved={savedOffers.includes(offer.id.toString())}
                  onToggleSave={toggleSaveOffer}
                  isFeatured
                />
              ))}
            </div>
          </div>
        )}

        {/* All Offers */}
        <div>
          <h2 className="text-2xl font-black mb-4">
            All Offers ({filteredOffers.length})
          </h2>
          
          {filteredOffers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-500" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No offers found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map(offer => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  isSaved={savedOffers.includes(offer.id.toString())}
                  onToggleSave={toggleSaveOffer}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface OfferCardProps {
  offer: Offer;
  isSaved: boolean;
  onToggleSave: (offerId: string) => void;
  isFeatured?: boolean;
}

function OfferCard({ offer, isSaved, onToggleSave, isFeatured }: OfferCardProps) {
  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 border-2 h-full flex flex-col ${
      isFeatured ? 'border-orange-200 bg-orange-50' : 'border-gray-200 hover:border-black'
    }`}>
      <CardHeader className="relative flex-shrink-0">
        {isFeatured && (
          <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white z-10">
            <Flame size={12} className="mr-1" />
            Featured
          </Badge>
        )}

        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <img
              src={offer.url}
              alt={offer.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-black text-black truncate">{offer.title}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {offer.category}
              </Badge>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleSave(offer.id.toString())}
            className={`p-2 flex-shrink-0 ${
              isSaved
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="mb-4 flex-1 line-clamp-3">{offer.description}</CardDescription>

        <div className="flex items-center justify-between mb-4">
          <div className="bg-black text-white px-3 py-1 rounded-lg font-bold flex-shrink-0">
            ₹{offer.price}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={14} className="mr-1" />
            Ongoing
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <Link to={`/offer/${offer.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
              View Deal
            </Button>
          </Link>

          <Button
            onClick={() => window.open(`https://fakestoreapi.com/products/${offer.external_id}`, '_blank')}
            className="bg-black text-white hover:bg-gray-800 flex-shrink-0"
            disabled={!offer.external_id}
          >
            <ExternalLink size={16} className="mr-2" />
            Claim
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
