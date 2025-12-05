import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Offer, useAuth } from '../../App';
import { Heart, Calendar, ExternalLink, ArrowLeft, Share2, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface OfferDetailProps {
  offers: Offer[];
  savedOffers: string[];
  setSavedOffers: React.Dispatch<React.SetStateAction<string[]>>;
}

export function OfferDetail({ offers, savedOffers, setSavedOffers }: OfferDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const offer = offers.find(o => o.id === Number(id));
  
  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-700 mb-4">Offer Not Found</h2>
          <Link to="/dashboard">
            <Button className="bg-black text-white hover:bg-gray-800">
              <ArrowLeft size={16} className="mr-2" />
              Back to Offers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = savedOffers.includes(offer.id.toString());

  const toggleSaveOffer = () => {
    if (isSaved) {
      setSavedOffers(prev => prev.filter(offerId => offerId !== offer.id.toString()));
      toast.success('Offer removed from saved offers');
    } else {
      setSavedOffers(prev => [...prev, offer.id.toString()]);
      toast.success('Offer saved! You\'ll get alerts before it expires.');
    }
  };

  const handleClaimOffer = () => {
    const url = offer.website_url || `https://fakestoreapi.com/products/${offer.external_id}`;
    toast.success('Redirecting to offer page...');
    setTimeout(() => {
      window.open(url, '_blank');
    }, 1000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: offer.title,
        text: `Check out this amazing deal from ${offer.company}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  // No expiry logic since we don't have expiry dates in the current data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back navigation */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-black"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <img
                      src={offer.url}
                      alt={offer.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <CardTitle className="text-2xl font-black text-black">{offer.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{offer.category}</Badge>
                        {offer.isFeatured && (
                          <Badge className="bg-orange-500 text-white">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="text-gray-500 hover:text-black"
                    >
                      <Share2 size={18} />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleSaveOffer}
                      className={`${
                        isSaved 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6">
                  <h1 className="text-3xl font-black text-black mb-4">{offer.title}</h1>
                  <CardDescription className="text-lg">{offer.description}</CardDescription>
                </div>

                <div className="bg-black text-white p-6 rounded-xl mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 mb-1">Price</p>
                      <p className="text-3xl font-black">₹{offer.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 mb-1">Valid Until</p>
                      <p className="text-xl font-semibold">{offer.expiry_date ? new Date(offer.expiry_date).toLocaleDateString() : 'No expiry'}</p>
                    </div>
                  </div>
                </div>


              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action buttons */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black text-black">Take Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleClaimOffer}
                  className="w-full bg-black text-white hover:bg-gray-800 font-medium py-3"
                  disabled={!offer.external_id}
                >
                  <ExternalLink size={16} className="mr-2" />
                  Claim Offer
                </Button>
                
                <Button
                  variant="outline"
                  onClick={toggleSaveOffer}
                  className="w-full border-black text-black hover:bg-black hover:text-white"
                >
                  <Heart size={16} className="mr-2" fill={isSaved ? 'currentColor' : 'none'} />
                  {isSaved ? 'Remove from Saved' : 'Save for Later'}
                </Button>

                {isSaved && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center text-green-700">
                      <CheckCircle size={16} className="mr-2" />
                      <span className="text-sm font-medium">Saved successfully!</span>
                    </div>
                    <p className="text-green-600 text-xs mt-1">
                      You'll get an alert before this offer expires.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Offer status */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black text-black">Offer Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Category</span>
                  <Badge variant="outline">{offer.category}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Source</span>
                  <span className="font-medium">{offer.source}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium">₹{offer.price}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Valid Until</span>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-sm">{offer.expiry_date ? new Date(offer.expiry_date).toLocaleDateString() : 'No expiry'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related offers */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="font-black text-black">More from {offer.source}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Visit {offer.source} to discover more products and deals.
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-3 border-gray-300 text-gray-700 hover:border-black hover:text-black"
                  onClick={() => window.open('https://fakestoreapi.com', '_blank')}
                >
                  Visit {offer.source}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
