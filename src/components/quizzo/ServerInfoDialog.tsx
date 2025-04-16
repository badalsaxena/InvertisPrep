import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Server, RefreshCw, CheckCircle, XCircle } from "lucide-react";

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
  
  const checkServerStatus = async () => {
    setServerStatus(prev => ({ 
      ...prev, 
      api: 'connecting', 
      realtime: 'connecting' 
    }));
    
    try {
      // Get the API URL from the environment variable or use default
      const apiUrl = import.meta.env.VITE_API_URL || 'https://quizzo-realtime.vercel.app';
      
      // Check API server
      const apiResponse = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      const apiStatus = apiResponse.ok ? 'connected' : 'disconnected';
      
      // Get the WebSocket URL from the environment variable or use default
      const wsUrl = import.meta.env.VITE_QUIZZO_REALTIME_URL || 'https://quizzo-realtime.vercel.app';
      
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
                <div><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'https://quizzo-realtime.vercel.app'}</div>
                <div><strong>WebSocket URL:</strong> {import.meta.env.VITE_QUIZZO_REALTIME_URL || 'https://quizzo-realtime.vercel.app'}</div>
                <div><strong>Protocol:</strong> WebSocket (with HTTP fallback)</div>
              </div>
            </div>
            
            <div className="pt-2 text-sm text-gray-500">
              <p>The application requires a unified server to run:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Unified server: Handles both API requests and WebSocket connections</li>
                <li>WebSocket: Real-time matchmaking and live game updates</li>
                <li>API: Provides questions and validates answers</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 