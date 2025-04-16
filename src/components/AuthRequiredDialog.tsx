import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface AuthRequiredDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onComplete?: () => void;
  returnPath?: string;
}

const AuthRequiredDialog: React.FC<AuthRequiredDialogProps> = ({
  isOpen,
  setIsOpen,
  onComplete,
  returnPath,
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsOpen(false);
    // Store the return path in session storage to redirect back after login
    if (returnPath) {
      sessionStorage.setItem('authRedirectPath', returnPath);
    }
    navigate('/login');
  };

  const handleSignup = () => {
    setIsOpen(false);
    if (returnPath) {
      sessionStorage.setItem('authRedirectPath', returnPath);
    }
    navigate('/signup');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Authentication Required</DialogTitle>
          <DialogDescription>
            You need to be logged in to download this file. Please log in or create an account to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 mt-4">
          <Button 
            onClick={handleLogin}
            className="w-full flex items-center justify-center space-x-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Log In</span>
          </Button>
          
          <Button 
            onClick={handleSignup}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </Button>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthRequiredDialog; 