import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Save, FolderTree, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Backend URL
const BACKEND_URL = "https://invertisprepbackend.onrender.com";

// Interface for Department
interface Department {
  id: string;
  name: string;
  branches: Branch[];
}

// Interface for Branch
interface Branch {
  id: string;
  name: string;
}

const DepartmentManager: React.FC = () => {
  // State for departments and branches
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // State for form inputs
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentId, setNewDepartmentId] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchId, setNewBranchId] = useState("");
  
  // Dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{type: 'department' | 'branch', id: string, name: string} | null>(null);

  // Initial load of departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);

    // In a real implementation, you would fetch from your backend
    setTimeout(() => {
      const mockDepartments: Department[] = [
        {
          id: 'btech',
          name: 'Bachelor of Technology',
          branches: [
            { id: 'cse', name: 'Computer Science Engineering' },
            { id: 'ai', name: 'Artificial Intelligence' },
            { id: 'me', name: 'Mechanical Engineering' },
            { id: 'ee', name: 'Electrical Engineering' },
            { id: 'ce', name: 'Civil Engineering' }
          ]
        },
        {
          id: 'bca',
          name: 'Bachelor of Computer Applications',
          branches: [
            { id: 'general', name: 'General' }
          ]
        },
        {
          id: 'bcom',
          name: 'Bachelor of Commerce',
          branches: [
            { id: 'general', name: 'General' },
            { id: 'honors', name: 'Honors' }
          ]
        },
        {
          id: 'bsc',
          name: 'Bachelor of Science',
          branches: [
            { id: 'cs', name: 'Computer Science' },
            { id: 'it', name: 'Information Technology' },
            { id: 'mathematics', name: 'Mathematics' },
            { id: 'physics', name: 'Physics' }
          ]
        },
        {
          id: 'mca',
          name: 'Master of Computer Applications',
          branches: [
            { id: 'general', name: 'General' }
          ]
        },
        {
          id: 'mtech',
          name: 'Master of Technology',
          branches: [
            { id: 'cse', name: 'Computer Science Engineering' },
            { id: 'ee', name: 'Electrical Engineering' }
          ]
        },
        {
          id: 'bba',
          name: 'Bachelor of Business Administration',
          branches: [
            { id: 'general', name: 'General' }
          ]
        },
        {
          id: 'mba',
          name: 'Master of Business Administration',
          branches: [
            { id: 'general', name: 'General' }
          ]
        },
        {
          id: 'msc',
          name: 'Master of Science',
          branches: [
            { id: 'cs', name: 'Computer Science' },
            { id: 'physics', name: 'Physics' }
          ]
        },
        {
          id: 'pharmacy',
          name: 'Pharmacy',
          branches: [
            { id: 'bpharm', name: 'Bachelor of Pharmacy' },
            { id: 'dpharm', name: 'Diploma in Pharmacy' }
          ]
        },
        {
          id: 'fashion-design',
          name: 'Fashion Design',
          branches: [
            { id: 'bdes', name: 'Bachelor of Design' }
          ]
        },
        {
          id: 'education',
          name: 'Education',
          branches: [
            { id: 'bed', name: 'Bachelor of Education' },
            { id: 'med', name: 'Master of Education' }
          ]
        },
        {
          id: 'bjmc',
          name: 'Bachelor of Journalism & Mass Communication',
          branches: [
            { id: 'general', name: 'General' }
          ]
        },
        {
          id: 'btech',
          name: 'Bachelor of Technology',
          branches: [
            { id: 'cse', name: 'Computer Science Engineering' },
            { id: 'ai', name: 'Artificial Intelligence' }
          ]
        }
      ];

      setDepartments(mockDepartments);
      setLoading(false);
    }, 1000);
  };

  // Add a new department
  const handleAddDepartment = async () => {
    if (!newDepartmentName || !newDepartmentId) {
      setError("Department name and ID are required");
      return;
    }

    // Check for duplicate ID
    if (departments.some(dept => dept.id === newDepartmentId)) {
      setError("Department ID already exists");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, you would call your API
      // const response = await fetch(`${BACKEND_URL}/api/admin/departments`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     id: newDepartmentId,
      //     name: newDepartmentName,
      //   }),
      // });

      // Simulate API call
      setTimeout(() => {
        const newDepartment: Department = {
          id: newDepartmentId,
          name: newDepartmentName,
          branches: []
        };

        setDepartments(prev => [...prev, newDepartment]);
        setSuccess(`Department "${newDepartmentName}" added successfully!`);
        setNewDepartmentName("");
        setNewDepartmentId("");
        setLoading(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }, 500);
    } catch (err) {
      setError("Failed to add department");
      setLoading(false);
    }
  };

  // Add a new branch to a department
  const handleAddBranch = async () => {
    if (!selectedDepartment || !newBranchName || !newBranchId) {
      setError("Department, branch name and branch ID are required");
      return;
    }

    // Check for duplicate branch ID in the selected department
    const department = departments.find(dept => dept.id === selectedDepartment);
    if (department && department.branches.some(branch => branch.id === newBranchId)) {
      setError("Branch ID already exists in this department");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real implementation, you would call your API
      // const response = await fetch(`${BACKEND_URL}/api/admin/departments/${selectedDepartment}/branches`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     id: newBranchId,
      //     name: newBranchName,
      //   }),
      // });

      // Simulate API call
      setTimeout(() => {
        const newBranch: Branch = {
          id: newBranchId,
          name: newBranchName
        };

        setDepartments(prev => prev.map(dept => 
          dept.id === selectedDepartment
            ? { ...dept, branches: [...dept.branches, newBranch] }
            : dept
        ));

        const deptName = departments.find(d => d.id === selectedDepartment)?.name;
        setSuccess(`Branch "${newBranchName}" added to ${deptName} successfully!`);
        setNewBranchName("");
        setNewBranchId("");
        setLoading(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }, 500);
    } catch (err) {
      setError("Failed to add branch");
      setLoading(false);
    }
  };

  // Delete confirmation dialog
  const confirmDelete = (type: 'department' | 'branch', id: string, name: string, departmentId?: string) => {
    setDeletingItem({ type, id, name });
    setIsDeleteDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingItem) return;

    setLoading(true);
    setError(null);
    setIsDeleteDialogOpen(false);

    try {
      // In a real implementation, you would call your API
      // For departments:
      // const response = await fetch(`${BACKEND_URL}/api/admin/departments/${deletingItem.id}`, {
      //   method: 'DELETE',
      // });
      // For branches:
      // const response = await fetch(`${BACKEND_URL}/api/admin/departments/${departmentId}/branches/${deletingItem.id}`, {
      //   method: 'DELETE',
      // });

      // Simulate API call
      setTimeout(() => {
        if (deletingItem.type === 'department') {
          setDepartments(prev => prev.filter(dept => dept.id !== deletingItem.id));
          setSuccess(`Department "${deletingItem.name}" deleted successfully!`);
        } else {
          // For branches, we would need the department ID too
          setDepartments(prev => prev.map(dept => ({
            ...dept,
            branches: dept.branches.filter(branch => branch.id !== deletingItem.id)
          })));
          setSuccess(`Branch "${deletingItem.name}" deleted successfully!`);
        }

        setDeletingItem(null);
        setLoading(false);

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }, 500);
    } catch (err) {
      setError(`Failed to delete ${deletingItem.type}`);
      setLoading(false);
    }
  };

  // Generate Department ID from name
  const generateDepartmentId = (name: string) => {
    const id = name.toLowerCase()
      .replace(/\s+/g, '-')       // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, '') // Remove all non-alphanumeric characters
      .replace(/--+/g, '-');      // Replace multiple hyphens with single hyphen
    
    setNewDepartmentId(id);
  };

  // Generate Branch ID from name
  const generateBranchId = (name: string) => {
    const id = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-');
    
    setNewBranchId(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Department Management</h1>
      </div>

      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <FolderTree size={16} />
            Departments
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus size={16} />
            Add New
          </TabsTrigger>
        </TabsList>

        {/* Departments Tab */}
        <TabsContent value="departments" className="mt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Departments and Branches</CardTitle>
                  <CardDescription>Manage departments and their branches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Department</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Branches</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departments.map((department) => (
                          <TableRow key={department.id}>
                            <TableCell className="font-medium">{department.name}</TableCell>
                            <TableCell>{department.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {department.branches.map((branch) => (
                                  <Badge 
                                    key={branch.id} 
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                  >
                                    {branch.name}
                                  </Badge>
                                ))}
                                {department.branches.length === 0 && (
                                  <span className="text-gray-400 text-xs">No branches</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => confirmDelete('department', department.id, department.name)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {departments.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                              No departments found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Add Tab */}
        <TabsContent value="add" className="mt-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add Department */}
            <Card>
              <CardHeader>
                <CardTitle>Add Department</CardTitle>
                <CardDescription>Create a new department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="departmentName" className="text-sm font-medium">
                    Department Name
                  </label>
                  <Input
                    id="departmentName"
                    placeholder="e.g. Bachelor of Technology"
                    value={newDepartmentName}
                    onChange={(e) => {
                      setNewDepartmentName(e.target.value);
                      generateDepartmentId(e.target.value);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="departmentId" className="text-sm font-medium">
                    Department ID
                  </label>
                  <Input
                    id="departmentId"
                    placeholder="e.g. btech"
                    value={newDepartmentId}
                    onChange={(e) => setNewDepartmentId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Use a simple identifier like 'btech' (auto-generated based on name)
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleAddDepartment}
                  disabled={loading || !newDepartmentName || !newDepartmentId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Department
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Add Branch */}
            <Card>
              <CardHeader>
                <CardTitle>Add Branch</CardTitle>
                <CardDescription>Add a new branch to an existing department</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="departmentSelect" className="text-sm font-medium">
                    Department
                  </label>
                  <select
                    id="departmentSelect"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedDepartment || ""}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="branchName" className="text-sm font-medium">
                    Branch Name
                  </label>
                  <Input
                    id="branchName"
                    placeholder="e.g. Computer Science Engineering"
                    value={newBranchName}
                    onChange={(e) => {
                      setNewBranchName(e.target.value);
                      generateBranchId(e.target.value);
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="branchId" className="text-sm font-medium">
                    Branch ID
                  </label>
                  <Input
                    id="branchId"
                    placeholder="e.g. cse"
                    value={newBranchId}
                    onChange={(e) => setNewBranchId(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Use a simple identifier like 'cse' (auto-generated based on name)
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleAddBranch}
                  disabled={loading || !selectedDepartment || !newBranchName || !newBranchId}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Branch
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingItem?.type} "{deletingItem?.name}"?
              {deletingItem?.type === 'department' && (
                <p className="text-red-500 mt-2">
                  This will also delete all branches under this department!
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManager; 