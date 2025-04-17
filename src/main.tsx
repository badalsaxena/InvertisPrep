import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import { setupAuthTokenInterceptor } from './services/authService'

// Try to initialize auth token interceptor
try {
  // Initialize the authentication token interceptor
  setupAuthTokenInterceptor();
} catch (error) {
  console.error('Failed to setup auth token interceptor:', error);
}

// Error boundary component to catch rendering errors
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Application rendering error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      // Render fallback UI when there's an error
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          border: '1px solid #f44336',
          borderRadius: '4px',
          backgroundColor: '#ffebee' 
        }}>
          <h2>Something went wrong.</h2>
          <p>Please check the console for more details or try refreshing the page.</p>
          <pre style={{ 
            padding: '10px', 
            backgroundColor: '#f5f5f5', 
            overflow: 'auto' 
          }}>
            {this.state.error?.message || "Unknown error"}
          </pre>
          <button 
            style={{
              padding: '8px 16px',
              margin: '10px 0',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
