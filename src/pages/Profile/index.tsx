import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={user.photoURL || undefined} 
                  alt={user.displayName || "User"} 
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>
                  {user.displayName ? getInitials(user.displayName) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-medium">{user.displayName || "User"}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Account Information</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{user.email}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                    <dd className="text-sm text-gray-900">
                      {user.providerData[0]?.providerId === 'google.com' ? 'Google Account' : 'Email Account'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Email Verified</dt>
                    <dd className="text-sm text-gray-900">
                      {user.emailVerified ? 'Yes' : 'No'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Account Actions</h4>
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="secondary"
                  onClick={handleLogout}
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Log out"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 