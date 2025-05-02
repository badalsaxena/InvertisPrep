import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import AuthRequiredDialog from '@/components/AuthRequiredDialog';
import SelectionForm from './SelectionForm';
import { BookOpen, Coins, Loader2, AlertCircle, CreditCard, Trophy, CheckCircle } from 'lucide-react';
import { spendQCoins } from '@/services/walletService';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PYQBrowserProps {
  // Add any props you need
}

const PYQBrowser: React.FC<PYQBrowserProps> = () => {
  const [results, setResults] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [solutionAuthDialogOpen, setSolutionAuthDialogOpen] = useState(false);
  const [currentPaperUrl, setCurrentPaperUrl] = useState('');
  const [currentSolutionUrl, setCurrentSolutionUrl] = useState('');
  const [isPurchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<any | null>(null);
  const { user } = useAuth();
  const { wallet, refreshWallet } = useUser();
  const navigate = useNavigate();

  const handleFormSubmit = async (department: string, branch: string, semester: string, session?: string) => {
    setLoading(true);
    setError(null);
    setResults(null);
    
    try {
      // Construct the API endpoint based on the selected filters
      let endpoint = `/api/papers/${department}/${branch}/${semester}`;
      if (session) {
        endpoint += `/${session}`;
      }
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch papers: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched papers:', data);
      setResults(data);
      
      if (data.length === 0) {
        setError('No papers found for the selected criteria.');
      }
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to load papers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (e: React.MouseEvent, downloadUrl: string) => {
    if (!user) {
      e.preventDefault();
      setCurrentPaperUrl(downloadUrl);
      setIsAuthDialogOpen(true);
      return;
    }
    // Allow default behavior if authenticated
  };

  const handleSolutionDownload = (e: React.MouseEvent, paper: any) => {
    e.preventDefault();
    
    if (!user) {
      setCurrentSolutionUrl(generateSolutionUrl(paper.downloadUrl));
      setSolutionAuthDialogOpen(true);
      return;
    }
    
    // Show purchase dialog instead of direct download
    setSelectedPaper(paper);
    setPurchaseDialogOpen(true);
  };

  // Helper function to generate solution URL
  const generateSolutionUrl = (paperUrl: string) => {
    return paperUrl.replace('/resources/pyq/', '/resources/pyqsolution/');
  };
  
  const handlePurchase = async () => {
    if (!user || !selectedPaper) return;
    
    const SOLUTION_COST = 20; // Cost in QCoins
    
    // Check if user has enough coins
    if ((wallet?.balance || 0) < SOLUTION_COST) {
      setPurchaseError("You don't have enough QCoins. Each solution costs 20 QCoins.");
      return;
    }
    
    try {
      setPurchaseStatus('loading');
      setPurchaseError(null);
      
      // Spend QCoins
      const solutionUrl = generateSolutionUrl(selectedPaper.downloadUrl);
      const success = await spendQCoins(
        user.uid, 
        SOLUTION_COST,
        `Premium solution: ${selectedPaper.title || 'Question Paper'}`
      );
      
      if (success) {
        setPurchaseStatus('success');
        // Refresh wallet to update balance
        if (refreshWallet) await refreshWallet();
        
        // Redirect to solution in a new tab after short delay
        setTimeout(() => {
          const pdfWindow = window.open(solutionUrl, '_blank');
          // Ensure the window was opened successfully
          if (pdfWindow) {
            pdfWindow.focus();
          } else {
            console.error("Failed to open PDF in new window - popup might be blocked");
          }
          setPurchaseDialogOpen(false);
          setPurchaseStatus('idle');
        }, 1000);
      } else {
        setPurchaseStatus('error');
        setPurchaseError("Failed to purchase solution. Please try again.");
      }
    } catch (error) {
      console.error("Error purchasing solution:", error);
      setPurchaseStatus('error');
      setPurchaseError("An unexpected error occurred. Please try again.");
    }
  };
  
  const handleTopUpNavigation = () => {
    setPurchaseDialogOpen(false);
    // Navigate to QCoins page
    navigate('/qcoins');
  };

  const handleQuizzoNavigation = () => {
    setPurchaseDialogOpen(false);
    // Navigate to Quizzo page
    navigate('/quizzo');
  };
  
  const hasInsufficientFunds = (wallet?.balance || 0) < 20;

  return (
    <div className="container mx-auto py-8">
      <SelectionForm onSubmit={handleFormSubmit} />
      
      {loading && (
        <div className="flex justify-center items-center mt-8 py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {error && !loading && (
        <div className="mt-8 p-4 border border-red-200 rounded-md bg-red-50">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      )}
      
      {results && results.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Available Papers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((paper, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    {paper.title || `Paper ${index + 1}`}
                  </CardTitle>
                  {paper.description && (
                    <p className="text-sm text-gray-600">{paper.description}</p>
                  )}
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="flex gap-3 justify-end">
                    <Button 
                      size="sm"
                      variant="default"
                      onClick={(e) => handleDownload(e, paper.downloadUrl)}
                      className="flex items-center gap-1.5"
                      asChild
                    >
                      <a 
                        href={paper.downloadUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Auth Required Dialog */}
      <AuthRequiredDialog 
        isOpen={isAuthDialogOpen}
        setIsOpen={setIsAuthDialogOpen}
        returnPath="/pyq"
      />
      
      {/* Auth Required Dialog for Solutions */}
      <AuthRequiredDialog 
        isOpen={solutionAuthDialogOpen}
        setIsOpen={setSolutionAuthDialogOpen}
        returnPath="/pyq"
      />
      
      {/* Purchase confirmation dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Purchase Premium Solution</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Access the step-by-step solution for this question paper.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* Cost and balance card */}
            <Card className={`border ${hasInsufficientFunds ? 'border-red-200' : 'border-amber-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-full ${hasInsufficientFunds ? 'bg-red-100' : 'bg-amber-100'}`}>
                    <Coins className={`h-8 w-8 ${hasInsufficientFunds ? 'text-red-500' : 'text-amber-600'}`} />
                  </div>
                  <div>
                    <p className={`font-medium ${hasInsufficientFunds ? 'text-red-700' : 'text-amber-800'}`}>
                      Cost: 20 QCoins
                    </p>
                    <p className={`text-sm ${hasInsufficientFunds ? 'text-red-600' : 'text-amber-700'}`}>
                      Your balance: {wallet?.balance || 0} QCoins
                      {hasInsufficientFunds && (
                        <span className="font-medium text-red-600 ml-1">(Insufficient)</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Insufficient funds card */}
            {hasInsufficientFunds && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Need more QCoins?
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center gap-1.5 h-10"
                        onClick={handleTopUpNavigation}
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>Top Up Coins</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center gap-1.5 h-10"
                        onClick={handleQuizzoNavigation}
                      >
                        <Trophy className="h-3.5 w-3.5" />
                        <span>Play Quizzo</span>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Win up to 25 QCoins for each Quizzo victory! Complete quizzes to earn more coins.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Error message */}
            {purchaseError && !hasInsufficientFunds && (
              <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm border border-red-100">
                {purchaseError}
              </div>
            )}
            
            {/* Success message */}
            {purchaseStatus === 'success' && (
              <Card className="border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-green-100 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-700">Purchase successful!</p>
                      <p className="text-sm text-green-600">Opening solution in a new tab...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setPurchaseDialogOpen(false)}
              disabled={purchaseStatus === 'loading'}
              className="flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchase}
              disabled={
                purchaseStatus === 'loading' || 
                purchaseStatus === 'success' || 
                hasInsufficientFunds
              }
              className={`flex-1 sm:flex-initial ${hasInsufficientFunds ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {purchaseStatus === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Purchase Solution'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PYQBrowser; 