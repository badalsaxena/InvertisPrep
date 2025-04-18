import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTransactionHistory, Transaction } from '@/services/walletService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// Custom pagination component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: { 
  currentPage: number; 
  totalPages: number; 
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous Page</span>
      </Button>
      
      <span className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next Page</span>
      </Button>
    </div>
  );
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const loadTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      // Get transactions - they are already stored newest first in Firestore
      const history = await getTransactionHistory(user.uid);
      setTransactions(history || []);
      // Reset to first page when new data is loaded
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading transaction history:', error);
      setError('Failed to load transaction history. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return '💰';
      case 'REWARD':
        return '🏆';
      case 'SPENT':
        return '🛒';
      default:
        return '💸';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'REWARD':
        return 'text-green-600';
      case 'SPENT':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    try {
      // Handle different timestamp formats from Firestore
      let date;
      
      // Check if it's a Firestore Timestamp object with seconds property
      if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } 
      // Check if it's an ISO string
      else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      }
      // Check if it's already a Date object
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // If we can't determine the type, try direct conversion
      else {
        date = new Date(timestamp);
      }
      
      // Verify the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      // Format the date nicely
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, timestamp);
      return 'Invalid Date';
    }
  };

  // Calculate pagination values
  const totalPages = Math.max(1, Math.ceil(transactions.length / transactionsPerPage));
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
            <BreadcrumbPage>Transaction History</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold mb-4">Transaction History</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 md:mb-0 w-fit"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCcw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Overview of your QCoin activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-800 mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-green-800">
                {transactions
                  .filter(t => t.type !== 'SPENT' && t.status === 'COMPLETED')
                  .reduce((sum, t) => sum + t.amount, 0)} QCoins
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-red-800 mb-1">Total Spent</p>
              <p className="text-2xl font-bold text-red-800">
                {transactions
                  .filter(t => t.type === 'SPENT' && t.status === 'COMPLETED')
                  .reduce((sum, t) => sum + t.amount, 0)} QCoins
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-800 mb-1">Transaction Count</p>
              <p className="text-2xl font-bold text-blue-800">
                {transactions.length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-500 mb-4">No transactions found</p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/qcoins')}
              >
                Manage QCoins
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="space-y-4">
            {/* Show only current page transactions - already sorted newest first */}
            {currentTransactions.map((transaction) => (
              <Card key={transaction.id} className="overflow-hidden">
                <div className="flex items-stretch">
                  <div className={`flex items-center justify-center w-16 text-2xl ${
                    transaction.type === 'SPENT' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{transaction.description}</h3>
                        <p className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</p>
                      </div>
                      <div className={`font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type !== 'SPENT' ? '+' : ''}{transaction.amount} QCoins
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        ID: {transaction.id.substring(0, 8)}...
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Pagination controls */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/qcoins')}
            >
              Manage QCoins
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory; 