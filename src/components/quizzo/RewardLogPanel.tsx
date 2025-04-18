import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTransactionHistory } from '@/services/walletService';
import { getWallet } from '@/services/walletService';
import { Transaction } from '@/services/walletService';
import { useAuth } from '@/contexts/AuthContext';

export const RewardLogPanel = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [loading, setLoading] = useState(false);
  
  const loadData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get recent transactions
      const history = await getTransactionHistory(user.uid);
      setTransactions(history);
      
      // Get wallet balance
      const walletData = await getWallet(user.uid);
      setWallet(walletData);
    } catch (error) {
      console.error('Error loading transaction data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);
  
  // Format date to a readable string
  const formatDate = (date: Date) => {
    if (!date) return 'Unknown';
    if (typeof date === 'string') {
      return new Date(date).toLocaleString();
    }
    return date.toLocaleString();
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Reward Transactions</CardTitle>
        <CardDescription>Recent QCoin transactions from quizzes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 p-3 rounded-md mb-4">
          <p className="text-sm font-medium text-blue-800">Current Balance: {wallet.balance} QCoins</p>
        </div>
        
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions found</p>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="p-3 border border-gray-200 rounded-md bg-white">
                <div className="flex justify-between">
                  <span className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount} QCoins
                  </span>
                  <span className="text-xs text-gray-500">{formatDate(tx.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{tx.description}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tx.status === 'COMPLETED' 
                      ? 'bg-green-100 text-green-800' 
                      : tx.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {tx.status}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{tx.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm"
          onClick={loadData}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Loading...' : 'Refresh Transactions'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 