import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { addQCoins } from '@/services/walletService';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Loader2,
  CreditCard,
  Wallet,
  IndianRupee,
  Coins,
  BadgeCheck,
  AlertTriangle,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// List of available coin packages
const coinPackages = [
  { id: 'basic', coins: 50, price: 49, originalPrice: 60, popular: false },
  { id: 'standard', coins: 100, price: 89, originalPrice: 120, popular: true },
  { id: 'premium', coins: 250, price: 199, originalPrice: 300, popular: false },
  { id: 'mega', coins: 500, price: 349, originalPrice: 600, popular: false },
];

// Payment methods
const paymentMethods = [
  { id: 'upi', name: 'UPI', description: 'Pay using Google Pay, PhonePe, Paytm', icon: 'upi' },
  { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay', icon: 'card' },
  { id: 'netbanking', name: 'Net Banking', description: 'All major banks supported', icon: 'bank' }
];

const TopUpPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wallet, refreshWallet } = useUser();
  
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('upi');
  const [processing, setProcessing] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle top-up purchase
  const handlePurchase = async () => {
    if (!user) return;
    
    setProcessing(true);
    setError(null);
    
    try {
      // Get selected package details
      const packageDetails = coinPackages.find(pkg => pkg.id === selectedPackage);
      if (!packageDetails) {
        throw new Error('Invalid package selected');
      }
      
      // Add QCoins to wallet - in a real app, this would integrate with a payment gateway
      // For now, we'll simulate a successful purchase
      // Wait for 2 seconds to simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add QCoins to wallet
      const success = await addQCoins(
        user.uid,
        packageDetails.coins,
        'DEPOSIT',
        `Purchase of ${packageDetails.coins} QCoins for ₹${packageDetails.price}`
      );
      
      if (success) {
        // Refresh wallet balance
        if (refreshWallet) await refreshWallet();
        setSuccess(true);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError('Failed to add QCoins to your wallet. Please try again.');
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      setError('An error occurred during the purchase. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  
  // Get selected package details
  const getSelectedPackage = () => {
    return coinPackages.find(pkg => pkg.id === selectedPackage) || coinPackages[1];
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/qcoins">QCoins</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Top Up QCoins</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold mb-4">Top Up QCoins</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/qcoins')}
            className="mb-4 md:mb-0 w-fit"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to QCoins
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Left Column - Wallet Info & Benefits */}
        <div className="md:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Your Wallet
              </CardTitle>
              <CardDescription>Current QCoin balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-blue-700">
                  {wallet?.balance || 0} <span className="text-lg font-normal">QCoins</span>
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Benefits
              </CardTitle>
              <CardDescription>Why buy QCoins?</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Access premium study materials and solutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Unlock exclusive course content</span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Get all premium previous year solutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">Can be earned through Quizzo as well</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Purchase Options */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Choose a QCoin Package</CardTitle>
              <CardDescription>
                Select a package that suits your needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coinPackages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === pkg.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-amber-500 hover:bg-amber-600">
                        Best Value
                      </Badge>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Coins className={`h-5 w-5 ${selectedPackage === pkg.id ? 'text-primary' : 'text-gray-400'}`} />
                        <span className="font-medium">{pkg.coins} QCoins</span>
                      </div>
                      <div className="relative h-5 w-5">
                        <input 
                          type="radio"
                          name="package"
                          value={pkg.id}
                          checked={selectedPackage === pkg.id}
                          onChange={() => setSelectedPackage(pkg.id)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className={`h-5 w-5 rounded-full border ${
                          selectedPackage === pkg.id 
                            ? 'border-primary' 
                            : 'border-gray-300'
                        }`}>
                          {selectedPackage === pkg.id && (
                            <div className="h-3 w-3 rounded-full bg-primary absolute top-1 left-1" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-end gap-2 mt-2">
                      <p className="text-xl font-bold">₹{pkg.price}</p>
                      {pkg.originalPrice > pkg.price && (
                        <p className="text-sm text-gray-400 line-through">₹{pkg.originalPrice}</p>
                      )}
                    </div>
                    {pkg.originalPrice > pkg.price && (
                      <p className="text-xs text-green-600 mt-1">
                        Save ₹{pkg.originalPrice - pkg.price} ({Math.round((pkg.originalPrice - pkg.price) / pkg.originalPrice * 100)}% off)
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <Separator className="my-6" />
              
              <div className="space-y-4">
                <h3 className="font-medium">Select Payment Method</h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center space-x-3 border rounded-md p-4 cursor-pointer ${
                        selectedPaymentMethod === method.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="relative h-5 w-5">
                        <input 
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className={`h-5 w-5 rounded-full border ${
                          selectedPaymentMethod === method.id 
                            ? 'border-primary' 
                            : 'border-gray-300'
                        }`}>
                          {selectedPaymentMethod === method.id && (
                            <div className="h-3 w-3 rounded-full bg-primary absolute top-1 left-1" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-1">
                        {method.icon === 'upi' && (
                          <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <IndianRupee className="h-4 w-4" />
                          </div>
                        )}
                        {method.icon === 'card' && (
                          <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                            <CreditCard className="h-4 w-4" />
                          </div>
                        )}
                        {method.icon === 'bank' && (
                          <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <DollarSign className="h-4 w-4" />
                          </div>
                        )}
                        <div>
                          <Label htmlFor={method.id} className="font-medium">
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 p-4 mt-6 rounded-md border border-red-200 flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-600 font-medium">Payment Failed</p>
                    <p className="text-sm text-red-500">{error}</p>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 p-4 mt-6 rounded-md border border-green-200 flex items-start gap-3">
                  <BadgeCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-600 font-medium">Purchase Successful!</p>
                    <p className="text-sm text-green-500">
                      {getSelectedPackage().coins} QCoins have been added to your wallet.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Package</span>
                  <span className="font-medium">{getSelectedPackage().coins} QCoins</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500">Price</span>
                  <span className="font-medium">₹{getSelectedPackage().price}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-lg font-bold">₹{getSelectedPackage().price}</span>
                </div>
              </div>
              
              <Button 
                className="w-full h-12 text-base" 
                size="lg"
                onClick={handlePurchase}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${getSelectedPackage().price}`
                )}
              </Button>
              <p className="text-xs text-center text-gray-500">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TopUpPage; 