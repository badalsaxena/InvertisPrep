import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, Server, Copy, Check, Wifi, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";

interface ServerStatus {
  api: 'connecting' | 'connected' | 'disconnected';
  realtime: 'connecting' | 'connected' | 'disconnected';
  lastChecked: Date | null;
}

export default function ServerInfoDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    api: 'connecting',
    realtime: 'connecting',
    lastChecked: null
  });
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const checkServerStatus = async () => {
    setServerStatus(prev => ({ 
      ...prev, 
      api: 'connecting', 
      realtime: 'connecting' 
    }));
    
    try {
      // Get the API URL from the environment variable or use default
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      
      // Check API server
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      const apiStatus = apiResponse.ok ? 'connected' : 'disconnected';
      
      // Get the WebSocket URL from the environment variable or use default
      const wsUrl = import.meta.env.VITE_QUIZZO_REALTIME_URL || 'https://quizzo-realtime.onrender.com';
      
      // Check WebSocket server
      let wsStatus: 'connecting' | 'connected' | 'disconnected' = 'connecting';
      try {
        const wsResponse = await fetch(wsUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        wsStatus = wsResponse.ok ? 'connected' : 'disconnected';
      } catch (error) {
        wsStatus = 'disconnected';
      }
      
      setServerStatus({
        api: apiStatus,
        realtime: wsStatus,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('Error checking server status:', error);
      setServerStatus({
        api: 'disconnected',
        realtime: 'disconnected',
        lastChecked: new Date()
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkServerStatus();
    }
  }, [isOpen]);
  
  const fetchServerInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the server URL from the socket service
      const serverUrl = getServerBaseUrl();
      
      // Fetch server status
      const response = await axios.get(`${serverUrl}/status`);
      setStatus(response.data);
    } catch (err) {
      console.error("Failed to fetch server info:", err);
      setError("Could not connect to the server. Make sure the Quizzo server is running.");
    } finally {
      setLoading(false);
    }
  };
  
  // Get the base server URL (without socket.io path)
  const getServerBaseUrl = (): string => {
    // First check if explicitly set in environment
    if (import.meta.env.VITE_QUIZZO_SERVER_URL) {
      return import.meta.env.VITE_QUIZZO_SERVER_URL;
    }
    
    // Otherwise, derive from current host dynamically
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const hostname = window.location.hostname; // This will be the actual host IP/domain
    const port = '5000'; // Default Quizzo backend port
    
    return `${protocol}//${hostname}:${port}`;
  };
  
  // Format uptime seconds to human-readable format
  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };
  
  // Copy server URL to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Server className="h-4 w-4" />
          <span>Server Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Quizzo Server Information</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">Connection details for multiplayer games</div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={checkServerStatus}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
            
            {/* API Server Status */}
            <div className={`p-4 rounded-lg border ${
              serverStatus.api === 'connected' 
                ? 'bg-green-50 border-green-200' 
                : serverStatus.api === 'disconnected'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
            }`}>
              <h3 className="font-medium mb-2">API Server</h3>
              {serverStatus.api === 'connected' && (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>Connected to the Quizzo API server.</span>
                </div>
              )}
              
              {serverStatus.api === 'disconnected' && (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <span>Could not connect to the API server.</span>
                </div>
              )}
              
              {serverStatus.api === 'connecting' && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Checking connection to API server...</span>
                </div>
              )}
            </div>
            
            {/* WebSocket Server Status */}
            <div className={`p-4 rounded-lg border ${
              serverStatus.realtime === 'connected' 
                ? 'bg-green-50 border-green-200' 
                : serverStatus.realtime === 'disconnected'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
            }`}>
              <h3 className="font-medium mb-2">Real-time Server</h3>
              {serverStatus.realtime === 'connected' && (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>Connected to the Quizzo real-time server.</span>
                </div>
              )}
              
              {serverStatus.realtime === 'disconnected' && (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <span>Could not connect to the real-time server.</span>
                </div>
              )}
              
              {serverStatus.realtime === 'connecting' && (
                <div className="flex items-center gap-2 text-yellow-700">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Checking connection to real-time server...</span>
                </div>
              )}
            </div>
            
            {serverStatus.lastChecked && (
              <div className="text-xs text-gray-500">
                Last checked: {serverStatus.lastChecked.toLocaleTimeString()}
              </div>
            )}
            
            <div>
              <h3 className="font-medium mb-2">Server Details</h3>
              <div className="text-sm space-y-1">
                <div><strong>API URL:</strong> {import.meta.env.VITE_API_URL || '/api'}</div>
                <div><strong>WebSocket URL:</strong> {import.meta.env.VITE_QUIZZO_REALTIME_URL || 'https://quizzo-realtime.onrender.com'}</div>
                <div><strong>Protocol:</strong> WebSocket (with HTTP fallback)</div>
              </div>
            </div>
            
            <div className="pt-2 text-sm text-gray-500">
              <p>The application requires both servers to be running:</p>
              <ul className="list-disc list-inside mt-1">
                <li>API server (hosted on Vercel): Provides questions and validates answers</li>
                <li>Real-time server: Handles matchmaking and live game updates</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 