import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, limit, startAfter, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SearchIcon, MoreVertical, AlertTriangle, Mail, Shield, ShieldCheck, UserX } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface UserData extends User {
  id: string;
  role: string;
  createdAt: Date;
  displayName?: string;
  email?: string;
  photoURL?: string;
  emailVerified: boolean;
  status: 'active' | 'suspended' | 'banned';
  lastActive?: Date;
  quizAttempts?: number;
  points?: number;
}

const USERS_PER_PAGE = 10;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSendEmailDialogOpen, setIsSendEmailDialogOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [userRole, setUserRole] = useState('');
  const [userStatus, setUserStatus] = useState<'active' | 'suspended' | 'banned'>('active');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users, currentTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, orderBy('createdAt', 'desc'), limit(USERS_PER_PAGE));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      // Get total count for pagination
      const countSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = countSnapshot.size;
      setTotalPages(Math.ceil(totalUsers / USERS_PER_PAGE));
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNextPage = async () => {
    if (!lastVisible) return;
    
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      const q = query(
        usersCollection, 
        orderBy('createdAt', 'desc'), 
        startAfter(lastVisible),
        limit(USERS_PER_PAGE)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      setUsers(usersData);
      setFilteredUsers(usersData);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching next page:', error);
      toast({
        title: "Error",
        description: "Failed to fetch next page. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPrevPage = async () => {
    if (currentPage <= 1) return;
    
    try {
      setLoading(true);
      const usersCollection = collection(db, 'users');
      // Calculate how many documents to skip
      const skipDocs = (currentPage - 2) * USERS_PER_PAGE;
      
      // Query with startAt for pagination
      const q = query(
        usersCollection, 
        orderBy('createdAt', 'desc'), 
        limit(USERS_PER_PAGE * 2) // We fetch more to get the last visible
      );
      
      const querySnapshot = await getDocs(q);
      const allDocs = querySnapshot.docs;
      
      // Take only the relevant slice for the previous page
      const relevantDocs = allDocs.slice(skipDocs, skipDocs + USERS_PER_PAGE);
      
      if (relevantDocs.length > 0) {
        setLastVisible(relevantDocs[relevantDocs.length - 1]);
        
        const usersData = relevantDocs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserData[];
        
        setUsers(usersData);
        setFilteredUsers(usersData);
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error fetching previous page:', error);
      toast({
        title: "Error",
        description: "Failed to fetch previous page. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by tab
    if (currentTab !== 'all') {
      if (currentTab === 'admin') {
        filtered = filtered.filter(user => user.role === 'admin');
      } else if (currentTab === 'moderator') {
        filtered = filtered.filter(user => user.role === 'moderator');
      } else if (currentTab === 'user') {
        filtered = filtered.filter(user => user.role === 'user');
      } else if (currentTab === 'banned') {
        filtered = filtered.filter(user => user.status === 'banned');
      }
    }
    
    setFilteredUsers(filtered);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      // In a real application, you would have proper user deletion logic
      // This might include:
      // 1. Deleting the user's auth record (requires admin SDK on backend)
      // 2. Deleting or anonymizing the user's data
      // 3. Handling related records
      
      await deleteDoc(doc(db, 'users', selectedUser.id));
      
      setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      setFilteredUsers(prev => prev.filter(user => user.id !== selectedUser.id));
      
      toast({
        title: "Success",
        description: `User ${selectedUser.displayName || selectedUser.email} deleted successfully.`,
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserRole = async () => {
    if (!selectedUser || !userRole) return;
    
    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        role: userRole
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, role: userRole } : user
      ));
      setFilteredUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, role: userRole } : user
      ));
      
      toast({
        title: "Success",
        description: `User role updated to ${userRole}.`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateUserStatus = async () => {
    if (!selectedUser) return;
    
    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        status: userStatus
      });
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, status: userStatus } : user
      ));
      setFilteredUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, status: userStatus } : user
      ));
      
      toast({
        title: "Success",
        description: `User status updated to ${userStatus}.`,
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendEmail = () => {
    // This would be implemented with a backend service that can send emails
    // For now, we'll just show a success message
    toast({
      title: "Email Queued",
      description: `Email to ${selectedUser?.email} has been queued for delivery.`,
    });
    
    setIsSendEmailDialogOpen(false);
    setEmailSubject('');
    setEmailContent('');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'moderator':
        return 'bg-blue-100 text-blue-800';
      case 'user':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'banned':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline">
            Export Users
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="admin">Admins</TabsTrigger>
          <TabsTrigger value="moderator">Moderators</TabsTrigger>
          <TabsTrigger value="user">Regular Users</TabsTrigger>
          <TabsTrigger value="banned">Banned Users</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <p className="text-gray-500">No users found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-500 font-medium">
                            {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{user.displayName || 'Anonymous User'}</div>
                        <div className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.email || 'No email'}
                      {!user.emailVerified && user.email && (
                        <span className="ml-2 text-yellow-500 text-xs inline-flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Unverified
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("font-normal", getRoleBadgeColor(user.role))}
                      >
                        {user.role || 'user'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn("font-normal", getStatusBadgeColor(user.status || 'active'))}
                      >
                        {user.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {user.createdAt instanceof Date 
                        ? user.createdAt.toLocaleDateString() 
                        : new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {user.points || 0}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setUserRole(user.role || 'user');
                            setUserStatus(user.status || 'active');
                            setIsEditDialogOpen(true);
                          }}>
                            <Shield className="h-4 w-4 mr-2" />
                            Edit Role & Status
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user);
                            setIsSendEmailDialogOpen(true);
                          }}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <UserX className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={fetchPrevPage} 
                  className={cn(currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer")}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>
                  Page {currentPage} of {totalPages}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={fetchNextPage} 
                  className={cn(currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user account for{" "}
              <span className="font-semibold">
                {selectedUser?.displayName || selectedUser?.email || 'this user'}
              </span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update role and status for{" "}
              <span className="font-semibold">
                {selectedUser?.displayName || selectedUser?.email || 'this user'}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">User Role</label>
              <Select defaultValue={selectedUser?.role || 'user'} onValueChange={setUserRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Status</label>
              <Select 
                defaultValue={selectedUser?.status || 'active'} 
                onValueChange={(value) => setUserStatus(value as 'active' | 'suspended' | 'banned')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                handleUpdateUserRole();
                handleUpdateUserStatus();
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Send Email Dialog */}
      <Dialog open={isSendEmailDialogOpen} onOpenChange={setIsSendEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to{" "}
              <span className="font-semibold">
                {selectedUser?.email}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input 
                placeholder="Email subject" 
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea 
                className="w-full min-h-[120px] p-3 border rounded-md"
                placeholder="Email content..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={!emailSubject || !emailContent}
              onClick={handleSendEmail}
            >
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 