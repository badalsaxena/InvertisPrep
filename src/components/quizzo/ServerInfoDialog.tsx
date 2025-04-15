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
import { Info, Server, Copy, Check, Wifi } from "lucide-react";
import axios from "axios";

interface ServerStatus {
  status: string;
  uptime: number;
  connections: number;
  rooms: number;
  matchmaking: {
    c: number;
    dsa: number;
    python: number;
    java: number;
    web: number;
  };
  server: {
    port: number;
    localIPs: string[];
    host: string;
  };
}

export default function ServerInfoDialog() {
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
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
  
  // Fetch data when dialog opens
  const handleDialogOpen = (open: boolean) => {
    if (open) {
      fetchServerInfo();
    }
  };
  
  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Server className="h-4 w-4" />
          <span>Server Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <span>Quizzo Server Information</span>
          </DialogTitle>
          <DialogDescription>
            Connection details for multiplayer games
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-600 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700 text-sm">
            <p>{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={fetchServerInfo}
            >
              Retry Connection
            </Button>
          </div>
        ) : status ? (
          <div className="space-y-4">
            <div className="bg-green-50 p-3 rounded-lg flex items-center gap-2">
              <div className="bg-green-100 p-1.5 rounded-full">
                <Wifi className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-green-700 font-medium">Server is online</p>
                <p className="text-xs text-green-600">Uptime: {formatUptime(status.uptime)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1 text-gray-700">Active Users</h3>
              <div className="bg-gray-50 p-3 rounded-lg grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Connected:</p>
                  <p className="font-medium">{status.connections} users</p>
                </div>
                <div>
                  <p className="text-gray-500">Active Rooms:</p>
                  <p className="font-medium">{status.rooms} games</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1 text-gray-700">Matchmaking Queues</h3>
              <div className="grid grid-cols-5 gap-1 text-xs bg-gray-50 p-2 rounded-lg">
                <div className="text-center p-1">
                  <p className="text-gray-600">C</p>
                  <p className="font-medium">{status.matchmaking.c}</p>
                </div>
                <div className="text-center p-1">
                  <p className="text-gray-600">DSA</p>
                  <p className="font-medium">{status.matchmaking.dsa}</p>
                </div>
                <div className="text-center p-1">
                  <p className="text-gray-600">Python</p>
                  <p className="font-medium">{status.matchmaking.python}</p>
                </div>
                <div className="text-center p-1">
                  <p className="text-gray-600">Java</p>
                  <p className="font-medium">{status.matchmaking.java}</p>
                </div>
                <div className="text-center p-1">
                  <p className="text-gray-600">Web</p>
                  <p className="font-medium">{status.matchmaking.web}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1 text-gray-700">Connection URLs</h3>
              <p className="text-xs text-gray-500 mb-2">Share these URLs for others to connect over the network</p>
              
              <div className="space-y-2">
                {status.server.localIPs.map((url, index) => (
                  <div key={index} className="flex items-center justify-between bg-indigo-50 p-2 rounded-md">
                    <code className="text-xs font-mono text-indigo-700">{url}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => copyToClipboard(url)}
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-700">
              <p className="flex items-center gap-1">
                <Info className="h-4 w-4 flex-shrink-0" />
                <span>
                  To play multiplayer games, both players must connect to the same server.
                  Share one of the URLs above with friends on the same network.
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Click "Retry" to fetch server information
            <Button
              variant="outline" 
              size="sm"
              className="mt-2 mx-auto block"
              onClick={fetchServerInfo}
            >
              Retry
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 