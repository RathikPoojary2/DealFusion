import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Offer } from '../../App';
import { Heart, Calendar, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// fallback Unsplash image for missing logos
const UNSPLASH_FALLBACK_IMAGE = 'https://source.unsplash.com/random/100x100?offer,sale';

interface SavedOffersProps {
  offers: Offer[];
  savedOffers: string[];
  setSavedOffers: React.Dispatch<React.SetStateAction<string[]>>;
}

export function SavedOffers({ offers, savedOffers, setSavedOffers }: SavedOffersProps) {
  // Convert offer.id to string to match savedOffers array element type
  const savedOfferDetails = offers.filter(offer => savedOffers.includes(offer.id.toString()));

  const removeSavedOffer = (offerId: string) => {
    setSavedOffers(prev => prev.filter(id => id !== offerId.toString()));
    toast.success('Offer removed from saved offers');
  };

  // Sort offers by expiry date
  const sortedOffers = [...savedOfferDetails].sort((a, b) => {
    const dateA = new Date(a.validTill ?? '').getTime();
    const dateB = new Date(b.validTill ?? '').getTime();
    return dateA - dateB;
  });

  // Calculate offer status
  const getOfferStatus = (offer: Offer) => {
    const today = new Date();
    const expiryDate = new Date(offer.validTill ?? '');
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    // Handle NaN daysUntilExpiry case
    if (isNaN(daysUntilExpiry)) {
      return { status: 'unknown', text: 'N/A', color: 'text-gray-500', bgColor: 'bg-gray-50 border-gray-200' };
    }

    if (daysUntilExpiry <= 0) {
      return { status: 'expired', text: 'Expired', color: 'text-red-500', bgColor: 'bg-red-50 border-red-200' };
    } else if (daysUntilExpiry <= 3) {
      return { status: 'expiring', text: `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''} left`, color: 'text-orange-500', bgColor: 'bg-orange-50 border-orange-200' };
    } else {
      return { status: 'active', text: `${daysUntilExpiry} days left`, color: 'text-green-500', bgColor: 'bg-green-50 border-green-200' };
    }
  };

  const expiringOffers = sortedOffers.filter(offer => {
    const today = new Date();
    const expiryDate = new Date(offer.validTill ?? '');
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-4">Saved Offers</h1>
          <p className="text-gray-600 text-lg">
            Keep track of your favorite deals and get notified before they expire.
          </p>
          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Heart className="text-red-400" size={16} />
              <span>{savedOffers.length} saved offers</span>
            </div>
            {expiringOffers.length > 0 && (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="text-orange-400" size={16} />
                <span>{expiringOffers.length} expiring soon</span>
              </div>
            )}
          </div>
        </div>

        {/* Expiring soon alert */}
        {expiringOffers.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="text-orange-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-black text-orange-800 mb-2">Offers Expiring Soon!</h3>
                <p className="text-orange-700 mb-3">
                  {expiringOffers.length} of your saved offers will expire in the next 3 days. 
                  Don't miss out on these deals!
                </p>
                <div className="flex flex-wrap gap-2">
                  {expiringOffers.map(offer => (
                    <Link key={offer.id} to={`/offer/${offer.id}`}>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      >
                        {offer.company} - {getOfferStatus(offer).text}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved offers */}
        {savedOfferDetails.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Heart className="text-gray-500" size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-700 mb-4">No Saved Offers Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start saving your favorite deals to keep track of them and get expiry alerts.
            </p>
            <Link to="/dashboard">
              <Button className="bg-black text-white hover:bg-gray-800">
                Discover Offers
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{sortedOffers.map(offer => {
  const status = getOfferStatus(offer);

  const imageSrc = offer.companyLogo && offer.companyLogo.trim() !== '' ? offer.companyLogo : UNSPLASH_FALLBACK_IMAGE;

  return (
    <Card key={offer.id} className={`group hover:shadow-lg transition-all duration-300 border-2 ${status.bgColor}`}>
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <ImageWithFallback
              src={imageSrc}
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
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeSavedOffer(offer.id.toString())}
            className="text-red-500 hover:text-red-600 p-2"
          >
            <Heart size={18} fill="currentColor" />
          </Button>
        </div>

        {/* Status indicator */}
        <div className={`flex items-center space-x-2 mt-3 text-sm ${status.color}`}>
          <Clock size={14} />
          <span className="font-medium">{status.text}</span>
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
        
        <div className="flex gap-2">
          <Link to={`/offer/${offer.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-black text-black hover:bg-black hover:text-white">
              View Deal
            </Button>
          </Link>
          
          <Button 
            onClick={() => window.open(offer.websiteUrl, '_blank')}
            className="bg-black text-white hover:bg-gray-800 flex-shrink-0"
            disabled={status.status === 'expired'}
          >
            <ExternalLink size={16} className="mr-2" />
            {status.status === 'expired' ? 'Expired' : 'Claim'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
})}
          </div>
        )}

        {/* Stats */}
        {savedOfferDetails.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-black text-black mb-2">{savedOffers.length}</div>
                <div className="text-gray-600">Total Saved</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-black text-orange-500 mb-2">{expiringOffers.length}</div>
                <div className="text-gray-600">Expiring Soon</div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-black text-green-500 mb-2">
                  {savedOfferDetails.filter(offer => getOfferStatus(offer).status === 'active').length}
                </div>
                <div className="text-gray-600">Still Active</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

