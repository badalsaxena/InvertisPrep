import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWallet, Wallet } from '@/services/walletService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, History } from 'lucide-react';

const QCoinsPage = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadWallet = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const walletData = await getWallet(user.uid);
        setWallet(walletData);
      } catch (error) {
        console.error('Error loading wallet:', error);
        setError('Failed to load wallet data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadWallet();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">QCoin Management</h1>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="max-w-md mx-auto">
        {/* Wallet Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your QCoin Wallet</CardTitle>
            <CardDescription>
              QCoins can be earned through quizzes and used for premium content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-xl text-blue-700 mb-1">Current Balance</p>
              <p className="text-5xl font-bold text-blue-700">
                {wallet?.balance || 0} <span className="text-lg font-normal">QCoins</span>
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">About QCoins</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Earn QCoins by participating in quizzes</li>
                <li>• Use QCoins to access premium content</li>
                <li>• QCoins never expire</li>
                <li>• All transactions are recorded for transparency</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/qcoins/history')}
            >
              <History className="h-4 w-4 mr-2" />
              View Transaction History
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default QCoinsPage; 