import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Offer } from '../../App';
import { Plus, Edit3, Trash2, Save, X, ExternalLink, BarChart3 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminPanelProps {
  offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
}

export function AdminPanel({ offers, setOffers }: AdminPanelProps) {
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [editingOffer, setEditingOffer] = useState<string | null>(null);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({
    title: '',
    description: '',
    discount: '',
    company: '',
    companyLogo: '',
    validTill: '',
    category: '',
    websiteUrl: '',
    isFeatured: false,
    terms: ''
  });

  const categories = ['Shopping', 'Travel', 'Food', 'Fashion', 'Electronics', 'Services'];

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.company || !newOffer.discount || !newOffer.validTill) {
      toast.error('Please fill in all required fields');
      return;
    }

    const offer: Offer = {
      id: Date.now().toString(),
      title: newOffer.title!,
      description: newOffer.description || '',
      discount: newOffer.discount!,
      company: newOffer.company!,
      companyLogo: newOffer.companyLogo || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
      validTill: newOffer.validTill!,
      category: newOffer.category || 'Shopping',
      websiteUrl: newOffer.websiteUrl || `https://${newOffer.company?.toLowerCase()}.com`,
      isFeatured: newOffer.isFeatured || false,
      terms: newOffer.terms || ''
    };

    setOffers(prev => [...prev, offer]);
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      company: '',
      companyLogo: '',
      validTill: '',
      category: '',
      websiteUrl: '',
      isFeatured: false,
      terms: ''
    });
    setIsAddingOffer(false);
    toast.success('Offer added successfully!');
  };

  const handleDeleteOffer = (offerId: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(prev => prev.filter(offer => offer.id !== offerId));
      toast.success('Offer deleted successfully!');
    }
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer.id);
    setNewOffer(offer);
  };

  const handleSaveEdit = () => {
    if (!newOffer.title || !newOffer.company || !newOffer.discount || !newOffer.validTill) {
      toast.error('Please fill in all required fields');
      return;
    }

    setOffers(prev => prev.map(offer => 
      offer.id === editingOffer 
        ? { ...offer, ...newOffer } as Offer
        : offer
    ));
    
    setEditingOffer(null);
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      company: '',
      companyLogo: '',
      validTill: '',
      category: '',
      websiteUrl: '',
      isFeatured: false,
      terms: ''
    });
    toast.success('Offer updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingOffer(null);
    setIsAddingOffer(false);
    setNewOffer({
      title: '',
      description: '',
      discount: '',
      company: '',
      companyLogo: '',
      validTill: '',
      category: '',
      websiteUrl: '',
      isFeatured: false,
      terms: ''
    });
  };

  const totalOffers = offers.length;
  const featuredOffers = offers.filter(offer => offer.isFeatured).length;
  const categoryCounts = categories.map(category => ({
    category,
    count: offers.filter(offer => offer.category === category).length
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-black mb-4">Admin Panel</h1>
          <p className="text-gray-600 text-lg">
            Manage offers, track analytics, and keep your deals platform up to date.
          </p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Offers</p>
                  <p className="text-3xl font-black text-black">{totalOffers}</p>
                </div>
                <BarChart3 className="text-gray-400" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Featured Offers</p>
                  <p className="text-3xl font-black text-orange-500">{featuredOffers}</p>
                </div>
                <BarChart3 className="text-gray-400" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Categories</p>
                  <p className="text-3xl font-black text-blue-500">{categories.length}</p>
                </div>
                <BarChart3 className="text-gray-400" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category breakdown */}
        <Card className="border-2 border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="font-black text-black">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoryCounts.map(({ category, count }) => (
                <div key={category} className="text-center">
                  <div className="bg-gray-100 rounded-lg p-3 mb-2">
                    <p className="text-2xl font-black text-black">{count}</p>
                  </div>
                  <p className="text-sm text-gray-600">{category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add new offer */}
        <Card className="border-2 border-gray-200 mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-black text-black">Manage Offers</CardTitle>
              <CardDescription>Add, edit, or remove offers from your platform</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingOffer(true)}
              className="bg-black text-white hover:bg-gray-800"
              disabled={isAddingOffer || editingOffer !== null}
            >
              <Plus size={16} className="mr-2" />
              Add Offer
            </Button>
          </CardHeader>

          {(isAddingOffer || editingOffer) && (
            <CardContent className="border-t border-gray-200">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-black text-black mb-4">
                  {editingOffer ? 'Edit Offer' : 'Add New Offer'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      value={newOffer.company || ''}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="e.g., Amazon"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newOffer.category} onValueChange={(value) => setNewOffer(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Offer Title *</Label>
                    <Input
                      id="title"
                      value={newOffer.title || ''}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., 10% cashback on HDFC cards"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discount">Discount *</Label>
                    <Input
                      id="discount"
                      value={newOffer.discount || ''}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, discount: e.target.value }))}
                      placeholder="e.g., 10% or ₹500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="validTill">Valid Till *</Label>
                    <Input
                      id="validTill"
                      value={newOffer.validTill || ''}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, validTill: e.target.value }))}
                      placeholder="e.g., Oct 15, 2024"
                    />
                  </div>

                  <div>
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      value={newOffer.websiteUrl || ''}
                      onChange={(e) => setNewOffer(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOffer.description || ''}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the offer"
                    rows={2}
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={newOffer.terms || ''}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, terms: e.target.value }))}
                    placeholder="Terms and conditions for this offer"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <Switch
                    id="featured"
                    checked={newOffer.isFeatured || false}
                    onCheckedChange={(checked) => setNewOffer(prev => ({ ...prev, isFeatured: checked }))}
                  />
                  <Label htmlFor="featured">Featured Offer</Label>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={editingOffer ? handleSaveEdit : handleAddOffer}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Save size={16} className="mr-2" />
                    {editingOffer ? 'Save Changes' : 'Add Offer'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-gray-300 text-gray-700 hover:border-black"
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Offers list */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="font-black text-black">All Offers ({offers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {offers.map((offer, index) => (
                <div key={offer.id}>
                  <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-4 flex-1">
                      <img 
                        src={offer.companyLogo} 
                        alt={offer.company}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-black text-black">{offer.company}</h3>
                          <Badge variant="outline">{offer.category}</Badge>
                          {offer.isFeatured && (
                            <Badge className="bg-orange-500 text-white">Featured</Badge>
                          )}
                        </div>
                        <p className="font-medium text-gray-800 mb-1">{offer.title}</p>
                        <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Discount: <strong>{offer.discount}</strong></span>
                          <span>Valid till: {offer.validTill}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(offer.websiteUrl, '_blank')}
                        className="text-gray-500 hover:text-black"
                      >
                        <ExternalLink size={16} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOffer(offer)}
                        disabled={editingOffer !== null || isAddingOffer}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Edit3 size={16} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {index < offers.length - 1 && <Separator />}
                </div>
              ))}
              
              {offers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No offers available. Add your first offer to get started.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}