import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { updateProfile } from "@/services/userService";
import { Check, Edit, Loader2, Mail, Save, Shield, User as UserIcon, X } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const { profile, refreshProfile } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [course, setCourse] = useState("");
  const [saving, setSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setCourse(profile.course || "");
    }
  }, [profile]);

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

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // Update profile with new name and course
      const result = await updateProfile(user.uid, {
        displayName,
        course
      });
      
      if (result) {
        // Refresh the profile data
        await refreshProfile();
        setUpdateSuccess(true);
        
        // Reset edit mode
        setEditMode(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset to original values
    if (profile) {
      setDisplayName(profile.displayName || "");
      setCourse(profile.course || "");
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
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Profile</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Success message */}
      {updateSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-green-700 font-medium">Profile Updated</h3>
          </div>
          <p className="text-green-600 mt-1">Your profile has been successfully updated.</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
        <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </div>
                {!editMode && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setEditMode(true)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
          </CardHeader>
              
          <CardContent className="space-y-6">
                {/* Profile Picture and Basic Info */}
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex flex-col items-center space-y-2">
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
                    {!editMode && (
                      <Badge variant="outline" className="mt-2">
                        {profile?.course ? profile.course.toUpperCase() : "No Course Set"}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    {editMode ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="displayName">Display Name</Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="course">Course</Label>
                          <Select value={course} onValueChange={setCourse}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select your course" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="btech">B.Tech</SelectItem>
                              <SelectItem value="bba">BBA</SelectItem>
                              <SelectItem value="bca">BCA</SelectItem>
                              <SelectItem value="mca">MCA</SelectItem>
                              <SelectItem value="ba">BA</SelectItem>
                              <SelectItem value="ma">MA</SelectItem>
                              <SelectItem value="mba">MBA</SelectItem>
                              <SelectItem value="mtech">M.Tech</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-lg font-medium">{profile?.displayName || user.displayName || "User"}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm">
                                Member since: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="text-sm">{user.email}</span>
                            </div>
              </div>
            </div>

                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Account Status</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="bg-blue-50">
                              {user.emailVerified ? "Verified Email" : "Unverified Email"}
                            </Badge>
                            <Badge variant="outline" className="bg-green-50">
                              {profile?.wallet?.balance || 0} QCoins
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50">
                              {user.providerData[0]?.providerId === 'google.com' ? 'Google Account' : 'Email Account'}
                            </Badge>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              
              {editMode && (
                <CardFooter className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4 mr-1" /> Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-1" />
                    )}
                    Save
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Account Security</h4>
                  <div className="flex items-start space-x-2">
                    <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email Verification</p>
                      <p className="text-xs text-gray-500">
                        {user.emailVerified 
                          ? "Your email is verified." 
                          : "Please verify your email address for added security."}
                      </p>
                      
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-sm font-medium">Connected Accounts</h4>
                  <div className="flex items-start space-x-2">
                    <div className="h-5 w-5 bg-blue-100 flex items-center justify-center rounded-full text-blue-700 font-bold text-xs">
                      G
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Google Account</p>
                        <Badge variant="outline" className={user.providerData[0]?.providerId === 'google.com' ? 'bg-green-50 text-green-700' : 'bg-gray-100'}>
                          {user.providerData[0]?.providerId === 'google.com' ? 'Connected' : 'Not Connected'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {user.providerData[0]?.providerId === 'google.com' 
                          ? "Your account is connected to Google." 
                          : "Connect your account with Google for easier login."}
                      </p>
                    </div>
                  </div>
              </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleLogout}
                  variant="secondary"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : "Log out"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>Manage your personal preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="language">Interface Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose the language for the user interface
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <Select defaultValue="important">
                      <SelectTrigger id="notifications">
                        <SelectValue placeholder="Select notification level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All notifications</SelectItem>
                        <SelectItem value="important">Important only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Control what email notifications you receive
                    </p>
              </div>
            </div>
          </CardContent>
              <CardFooter>
                <Button>Save Preferences</Button>
              </CardFooter>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 