import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Input, 
  Label, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Select
} from '@/components/ui';
import { doc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  branch?: string;
  semester?: string;
  enrollmentNumber?: string;
  createdAt: string;
};

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<User, 'id'>),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || 'Unknown'
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.enrollmentNumber && user.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const userRef = doc(db, 'users', editingUser.id);
      await updateDoc(userRef, {
        name: editingUser.name,
        role: editingUser.role,
        branch: editingUser.branch,
        semester: editingUser.semester
      });
      
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      toast.success('User updated successfully');
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(users.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <div className="mb-6">
        <Input
          placeholder="Search users by name, email or enrollment number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {editingUser && (
        <Card className="p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit User</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editingUser.name}
                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email">Email (read-only)</Label>
              <Input id="email" value={editingUser.email} disabled />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                id="role"
                value={editingUser.role}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="faculty">Faculty</option>
              </Select>
            </div>
            {editingUser.role === 'student' && (
              <>
                <div>
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={editingUser.branch || ''}
                    onChange={(e) => setEditingUser({...editingUser, branch: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    value={editingUser.semester || ''}
                    onChange={(e) => setEditingUser({...editingUser, semester: e.target.value})}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpdateUser}>Save Changes</Button>
            <Button variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
          </div>
        </Card>
      )}

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch/Semester</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className="capitalize">{user.role}</span>
                    </TableCell>
                    <TableCell>
                      {user.role === 'student' ? (
                        <>
                          {user.branch || 'N/A'} / {user.semester || 'N/A'}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserManager; 