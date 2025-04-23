import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getWallet, Wallet } from '@/services/walletService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Loader2, 
  History, 
  CreditCard, 
  Coins, 
  PlusCircle, 
  Trophy, 
  BadgeCheck, 
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

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

  // Calculate next milestone (example: pretend next milestone is at 50 QCoins)
  const currentBalance = wallet?.balance || 0;
  const nextMilestone = Math.ceil(currentBalance / 50) * 50;
  const progressPercent = (currentBalance / nextMilestone) * 100;

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
            <BreadcrumbPage>QCoin Management</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col mb-6">
        <h1 className="text-3xl font-bold mb-4">QCoin Management</h1>
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
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Left Column - Wallet Details */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Coins className="h-6 w-6 text-primary" />
                    Your QCoin Wallet
                  </CardTitle>
                  <CardDescription className="text-base mt-1">
                    QCoins can be earned through quizzes and used for premium content
                  </CardDescription>
                </div>
                <Badge variant="outline" className="px-3 py-1">
                  <CalendarDays className="h-3.5 w-3.5 mr-1" />
                  Updated just now
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-lg text-center shadow-md">
                <p className="text-xl text-white/90 mb-1">Current Balance</p>
                <p className="text-6xl font-bold text-white mb-4">
                  {wallet?.balance || 0} <span className="text-lg font-normal">QCoins</span>
                </p>
                
                {/* Progress to next milestone */}
                <div className="mt-4">
                  <div className="flex justify-between text-white/80 text-sm mb-1">
                    <span>{currentBalance} QCoins</span>
                    <span>Next Milestone: {nextMilestone} QCoins</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 bg-white/20" indicatorClassName="bg-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600"
                  size="lg" 
                  onClick={() => navigate('/qcoins/topup')}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  <span>Top Up QCoins</span>
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full h-12 border-blue-200 hover:bg-blue-50" 
                  onClick={() => navigate('/qcoins/history')}
                >
                  <History className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Transaction History</span>
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                  Recent Activity
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/qcoins/history')}
                >
                  View All
                </Button>
              </div>
              
              {wallet && wallet.transactions && wallet.transactions.length > 0 ? (
                <div className="space-y-2">
                  {wallet.transactions.slice(0, 3).map((transaction, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'DEPOSIT' || transaction.type === 'REWARD' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'DEPOSIT' && <PlusCircle className="h-4 w-4" />}
                          {transaction.type === 'REWARD' && <Trophy className="h-4 w-4" />}
                          {transaction.type === 'SPENT' && <CreditCard className="h-4 w-4" />}
                        </div>
                        <div className="text-sm">
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${
                        transaction.type === 'DEPOSIT' || transaction.type === 'REWARD' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'DEPOSIT' || transaction.type === 'REWARD' ? '+' : '-'}
                        {transaction.amount} QCoins
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 border rounded-md border-dashed border-gray-200">
                  <p className="text-gray-500">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Info & Buttons */}
        <div className="space-y-6">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BadgeCheck className="h-5 w-5 text-primary" />
                About QCoins
              </CardTitle>
              <CardDescription>
                Your virtual currency for premium features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 pb-2 border-b">
                  <div className="h-7 w-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Earn QCoins by participating in quizzes</p>
                    <p className="text-sm text-gray-500">Complete quizzes to earn rewards</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-2 border-b">
                  <div className="h-7 w-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Use QCoins to access premium content</p>
                    <p className="text-sm text-gray-500">Unlock solutions and study materials</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 pb-2 border-b">
                  <div className="h-7 w-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">QCoins never expire</p>
                    <p className="text-sm text-gray-500">Use them anytime you want</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-7 w-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <History className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">All transactions are recorded</p>
                    <p className="text-sm text-gray-500">Full transparency of your QCoin history</p>
                  </div>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/quizzo')}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Earn with Quizzo
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Premium Benefits
              </CardTitle>
              <CardDescription className="text-white/80">
                Unlock with your QCoins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-yellow-300" />
                  <span>Access to premium study materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-yellow-300" />
                  <span>Full solutions to previous year questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-yellow-300" />
                  <span>Exclusive course content and resources</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-white hover:bg-white/90 text-indigo-600"
                onClick={() => navigate('/resources')}
              >
                Explore Premium Content
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QCoinsPage; 