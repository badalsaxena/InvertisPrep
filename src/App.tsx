import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { Hero } from "@/components/layout/Hero";
import { Features } from "@/components/layout/Features";
import { Footer } from "@/components/layout/Footer";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Resources from "@/pages/Resources";
import Quizzo from "@/pages/Quizzo";
import MultiplayerQuizzo from "@/pages/MultiplayerQuizzo";
import SoloQuizzo from "@/pages/SoloQuizzo";
import PYQ from "@/pages/PYQ"; 
import ProgramDetails from "@/pages/PYQ/ProgramDetails";
import Settings from "@/pages/Settings";
import TransactionHistory from "@/pages/QCoins/History";
import BugReport from "@/pages/BugReport";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import { handleQuizReward } from "./api/quiz-rewards";
import { Toaster } from "@/components/ui/toaster";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Show loading state while auth is being checked
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
    </div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Debug component for troubleshooting
const DebugInfo = () => {
  const [visible, setVisible] = useState(false);
  const { user, loading } = useAuth();
  const [info, setInfo] = useState({
    url: window.location.href,
    userAgent: navigator.userAgent,
    screen: `${window.innerWidth}x${window.innerHeight}`,
    time: new Date().toISOString()
  });
  
  return (
    <div className="fixed bottom-0 right-0 m-2 z-50">
      <button 
        onClick={() => setVisible(!visible)}
        className="bg-gray-800 text-white px-3 py-1 rounded text-xs"
      >
        Debug
      </button>
      
      {visible && (
        <div className="bg-white border border-gray-300 p-3 rounded shadow-lg mt-2 text-xs w-80">
          <h3 className="font-bold">Debug Info</h3>
          <div className="mt-2 space-y-1">
            <p><strong>Auth:</strong> {loading ? 'Loading...' : (user ? 'Authenticated' : 'Not authenticated')}</p>
            <p><strong>URL:</strong> {info.url}</p>
            <p><strong>UA:</strong> {info.userAgent}</p>
            <p><strong>Screen:</strong> {info.screen}</p>
            <p><strong>Time:</strong> {info.time}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs mt-2"
          >
            Reload Page
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Quiz Rewards API handler component
 * This component handles API requests to /api/quiz-rewards and returns the response
 */
const QuizRewardsApi = () => {
  const [result, setResult] = useState<string>("");
  
  // Process the request when the component mounts
  useEffect(() => {
    const processRequest = async () => {
      try {
        // Get the payload from URL parameters
        const searchParams = new URLSearchParams(window.location.search);
        const payloadStr = searchParams.get('payload');
        
        if (!payloadStr) {
          setResult(JSON.stringify({ error: 'Missing payload parameter' }, null, 2));
          return;
        }
        
        // Decode and parse the payload
        const payload = JSON.parse(decodeURIComponent(payloadStr));
        
        // Create a Request object with the payload
        const request = new Request(window.location.href, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_QUIZZO_API_SECRET || 'development-secret-key'
          },
          body: JSON.stringify(payload)
        });
        
        // Process the request with our handler
        const response = await handleQuizReward(request);
        const data = await response.json();
        
        // Display the result
        setResult(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error('Error handling quiz rewards API:', error);
        setResult(JSON.stringify({ 
          error: 'Failed to process request',
          message: error instanceof Error ? error.message : String(error)
        }, null, 2));
      }
    };
    
    processRequest();
  }, []);
  
  // This component renders a JSON response for the API
  return (
    <div className="p-4">
      <pre>{result}</pre>
    </div>
  );
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Mark the app as loaded after a short delay
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 200);

    // Catch any unhandled errors
    const handleError = (e: ErrorEvent) => {
      console.error('Unhandled error:', e.error);
      setError(e.error);
    };

    window.addEventListener('error', handleError);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Show a simple loading screen while initial setup happens
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-primary rounded-full"></div>
      </div>
    );
  }

  // Show error screen if an error occurred
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-gray-700">
            The application encountered an error. Please try refreshing the page.
          </p>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qcoins/history"
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <Features />
              
              </main>
            }
          />
          <Route path="/about" element={<About /> } />
          <Route path="/services" element={<Services />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/pyq" element={<PYQ />} />
          <Route path="/pyq/:programId" element={<ProgramDetails />} />
          <Route path="/quizzo" element={<Quizzo />} />
          <Route 
            path="/quizzo/multiplayer" 
            element={<MultiplayerQuizzo />} 
          />
          <Route 
            path="/quizzo/solo" 
            element={<SoloQuizzo />} 
          />
          
          {/* Legal and Support Routes */}
          <Route path="/bug-report" element={<BugReport />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          
          {/* API endpoint for quiz rewards */}
          <Route path="/api/quiz-rewards" element={<QuizRewardsApi />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
          
        </Routes>
        <Toaster />
        <Footer />
      </div>
    </Router>
  );
}

export default App;

