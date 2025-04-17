import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWallet, addQCoins, spendQCoins, Wallet } from '@/services/walletService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2, Plus, Minus, CreditCard, History } from 'lucide-react';

const QCoinsPage = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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

  const handleAddCoins = async () => {
    if (!user || !amount || Number(amount) <= 0) return;
    
    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await addQCoins(
        user.uid,
        Number(amount),
        'DEPOSIT',
        description || 'Manual deposit'
      );
      
      if (result) {
        setSuccess(`Successfully added ${amount} QCoins to your wallet!`);
        // Refresh wallet data
        const walletData = await getWallet(user.uid);
        setWallet(walletData);
        setAmount('');
        setDescription('');
      } else {
        setError('Failed to add QCoins. Please try again.');
      }
    } catch (error) {
      console.error('Error adding QCoins:', error);
      setError('An error occurred while adding QCoins.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSpendCoins = async () => {
    if (!user || !amount || Number(amount) <= 0 || !wallet || Number(amount) > wallet.balance) return;
    
    try {
      setActionLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await spendQCoins(
        user.uid,
        Number(amount),
        description || 'Manual spend'
      );
      
      if (result) {
        setSuccess(`Successfully spent ${amount} QCoins!`);
        // Refresh wallet data
        const walletData = await getWallet(user.uid);
        setWallet(walletData);
        setAmount('');
        setDescription('');
      } else {
        setError('Failed to spend QCoins. Please ensure you have sufficient balance.');
      }
    } catch (error) {
      console.error('Error spending QCoins:', error);
      setError('An error occurred while spending QCoins.');
    } finally {
      setActionLoading(false);
    }
  };

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
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-600">{success}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        {/* Add/Spend QCoins Card */}
        <Card>
          <CardHeader>
            <CardTitle>Manage QCoins</CardTitle>
            <CardDescription>
              Add or spend QCoins manually
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">
                  Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter QCoin amount"
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this transaction for?"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button 
              onClick={handleAddCoins}
              disabled={actionLoading || !amount || Number(amount) <= 0}
              className="flex-1"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              Add QCoins
            </Button>
            <Button 
              onClick={handleSpendCoins}
              disabled={actionLoading || !amount || Number(amount) <= 0 || !wallet || Number(amount) > wallet.balance}
              variant="outline"
              className="flex-1"
            >
              {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Minus className="h-4 w-4 mr-2" />}
              Spend QCoins
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default QCoinsPage; 