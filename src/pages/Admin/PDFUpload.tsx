import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Check, X, Upload, Loader2, FileText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Backend URL
const BACKEND_URL = "https://invertisprepbackend.onrender.com";

interface UploadFormState {
  title: string;
  department: string;
  branch: string;
  semester: string;
  session: string;
  subject: string;
  description?: string;
}

const PDFUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState<UploadFormState>({
    title: '',
    department: '',
    branch: '',
    semester: '',
    session: '',
    subject: '',
    description: '',
  });
  
  // Data for dropdowns
  const [departments, setDepartments] = useState<{id: string, name: string}[]>([]);
  const [branches, setBranches] = useState<{id: string, name: string}[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [sessions, setSessions] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([
    'Mathematics',
    'Computer Programming',
    'Data Structures',
    'Algorithms',
    'Computer Networks',
    'Operating Systems',
    'Database Management Systems',
    'Software Engineering',
    'Web Development',
    'Mobile App Development',
    'Artificial Intelligence',
    'Machine Learning',
    'Physics',
    'Chemistry',
    'English',
    'Economics',
    'Management',
    'Digital Electronics',
    'Microprocessors',
    'Computer Architecture'
  ]);

  // Loading states
  const [fetchingOptions, setFetchingOptions] = useState(false);
  const [recentUploads, setRecentUploads] = useState<any[]>([]);
  
  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setFetchingOptions(true);
      
      // Mock data for example
      setTimeout(() => {
        setDepartments([
          { id: 'btech', name: 'Bachelor of Technology' },
          { id: 'bca', name: 'Bachelor of Computer Applications' },
          { id: 'bcom', name: 'Bachelor of Commerce' },
          { id: 'bsc', name: 'Bachelor of Science' },
          { id: 'mca', name: 'Master of Computer Applications' },
          { id: 'mtech', name: 'Master of Technology' },
          { id: 'bba', name: 'Bachelor of Business Administration' },
          { id: 'mba', name: 'Master of Business Administration' },
          { id: 'msc', name: 'Master of Science' },
          { id: 'pharmacy', name: 'Pharmacy' },
          { id: 'fashion-design', name: 'Fashion Design' },
          { id: 'education', name: 'Education' },
          { id: 'bjmc', name: 'Bachelor of Journalism & Mass Communication' }
        ]);
        setFetchingOptions(false);
      }, 800);
    };
    
    fetchDepartments();
    fetchRecentUploads();
  }, []);

  // Fetch branches when department changes
  useEffect(() => {
    if (!formData.department) {
      setBranches([]);
      return;
    }
    
    const fetchBranches = async () => {
      setFetchingOptions(true);
      
      // Mock data based on selected department
      setTimeout(() => {
        if (formData.department === 'btech') {
          setBranches([
            { id: 'cse', name: 'Computer Science Engineering' },
            { id: 'ai', name: 'Artificial Intelligence' },
            { id: 'me', name: 'Mechanical Engineering' },
            { id: 'ee', name: 'Electrical Engineering' },
            { id: 'ce', name: 'Civil Engineering' }
          ]);
        } else if (formData.department === 'bca') {
          setBranches([
            { id: 'general', name: 'General' }
          ]);
        } else {
          setBranches([
            { id: 'general', name: 'General' },
            { id: 'honors', name: 'Honors' }
          ]);
        }
        setFetchingOptions(false);
      }, 800);
    };
    
    fetchBranches();
  }, [formData.department]);

  // Fetch semesters when department and branch change
  useEffect(() => {
    if (!formData.department || !formData.branch) {
      setSemesters([]);
      return;
    }
    
    const fetchSemesters = async () => {
      setFetchingOptions(true);
      
      // Mock data
      setTimeout(() => {
        if (formData.department === 'btech') {
          setSemesters(['1', '2', '3', '4', '5', '6', '7', '8']);
        } else if (formData.department === 'bca' || formData.department === 'bba') {
          setSemesters(['1', '2', '3', '4', '5', '6']);
        } else {
          setSemesters(['1', '2', '3', '4']);
        }
        setFetchingOptions(false);
      }, 800);
    };
    
    fetchSemesters();
  }, [formData.department, formData.branch]);

  // Fetch sessions when department and branch change
  useEffect(() => {
    if (!formData.department || !formData.branch) {
      setSessions([]);
      return;
    }
    
    const fetchSessions = async () => {
      setFetchingOptions(true);
      
      // Mock data
      setTimeout(() => {
        setSessions([
          '2023-24',
          '2022-23',
          '2021-22',
          '2020-21',
          '2019-20'
        ]);
        setFetchingOptions(false);
      }, 800);
    };
    
    fetchSessions();
  }, [formData.department, formData.branch]);

  // Fetch recent uploads
  const fetchRecentUploads = async () => {
    // Mock data
    setTimeout(() => {
      setRecentUploads([
        {
          id: '1',
          title: 'Data Structures and Algorithms',
          filename: 'DSA_Midterm_2023.pdf',
          department: 'btech',
          departmentName: 'Bachelor of Technology',
          branch: 'cse',
          branchName: 'Computer Science Engineering',
          semester: '3',
          session: '2023-24',
          uploadedAt: '2023-11-20T14:30:00',
          fileSize: '2.4MB'
        },
        {
          id: '2',
          title: 'Computer Networks',
          filename: 'CN_Final_2023.pdf',
          department: 'btech',
          departmentName: 'Bachelor of Technology',
          branch: 'cse',
          branchName: 'Computer Science Engineering',
          semester: '5',
          session: '2023-24',
          uploadedAt: '2023-11-18T10:15:00',
          fileSize: '3.1MB'
        },
        {
          id: '3',
          title: 'Operating Systems',
          filename: 'OS_Midterm_2023.pdf',
          department: 'btech',
          departmentName: 'Bachelor of Technology',
          branch: 'cse',
          branchName: 'Computer Science Engineering',
          semester: '4',
          session: '2022-23',
          uploadedAt: '2023-11-15T09:45:00',
          fileSize: '1.8MB'
        }
      ]);
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is a PDF
      if (selectedFile.type !== 'application/pdf') {
        setStatusMessage('Only PDF files are allowed');
        setUploadStatus('error');
        return;
      }
      
      // Check file size (limit to 15MB)
      if (selectedFile.size > 15 * 1024 * 1024) {
        setStatusMessage('File size exceeds 15MB limit');
        setUploadStatus('error');
        return;
      }
      
      setFile(selectedFile);
      setUploadStatus('idle');
      setStatusMessage('');
      
      // Extract title from filename (remove extension)
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, title: fileName }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setStatusMessage('Please select a file to upload');
      setUploadStatus('error');
      return;
    }
    
    // Check required fields
    const requiredFields: (keyof UploadFormState)[] = ['department', 'branch', 'semester', 'session', 'subject'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setStatusMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadStatus('success');
        setStatusMessage('File uploaded successfully!');
        
        // Reset form after successful upload
        setFile(null);
        setFormData({
          title: '',
          department: '',
          branch: '',
          semester: '',
          session: '',
          subject: '',
          description: '',
        });
        
        // Reset file input
        const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        // Refresh recent uploads
        fetchRecentUploads();
      }, 500);
    }, 3000);
  };
  
  const getDepartmentName = (id: string) => {
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : id;
  };
  
  const getBranchName = (id: string) => {
    const branch = branches.find(b => b.id === id);
    return branch ? branch.name : id;
  };
  
  // Format date to readable string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Upload Resources</h1>
          <p className="text-muted-foreground">Upload PDF documents for students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload PDF Document</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-6">
                {/* File Upload Area */}
                <div className="space-y-2">
                  <Label htmlFor="pdf-upload">PDF File</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      uploadStatus === 'error' 
                        ? 'border-red-400 bg-red-50' 
                        : file 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 hover:border-primary hover:bg-gray-50'
                    }`}
                    onClick={() => document.getElementById('pdf-upload')?.click()}
                  >
                    <input
                      type="file"
                      id="pdf-upload"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {!file ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PDF (max. 15MB)</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <FileText className="h-6 w-6 text-green-500" />
                        <div className="text-left">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)}MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            const fileInput = document.getElementById('pdf-upload') as HTMLInputElement;
                            if (fileInput) fileInput.value = '';
                          }}
                          className="ml-auto p-1 rounded-full hover:bg-gray-200"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {uploadStatus === 'error' && (
                    <p className="text-sm text-red-500 flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {statusMessage}
                    </p>
                  )}
                  
                  {uploadStatus === 'success' && (
                    <p className="text-sm text-green-500 flex items-center mt-1">
                      <Check className="h-4 w-4 mr-1" />
                      {statusMessage}
                    </p>
                  )}
                </div>
                
                {/* Upload Progress */}
                {uploadStatus === 'uploading' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                {/* Document Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Document Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Document title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formData.subject}
                        onValueChange={(value) => handleSelectChange('subject', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Department */}
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) => handleSelectChange('department', value)}
                        disabled={fetchingOptions && !departments.length}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fetchingOptions && !departments.length && (
                        <p className="text-xs text-blue-500 flex items-center mt-1">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Loading departments...
                        </p>
                      )}
                    </div>
                    
                    {/* Branch */}
                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Select
                        value={formData.branch}
                        onValueChange={(value) => handleSelectChange('branch', value)}
                        disabled={!formData.department || (fetchingOptions && !branches.length)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches.map(branch => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.department && fetchingOptions && !branches.length && (
                        <p className="text-xs text-blue-500 flex items-center mt-1">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Loading branches...
                        </p>
                      )}
                    </div>
                    
                    {/* Semester */}
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select
                        value={formData.semester}
                        onValueChange={(value) => handleSelectChange('semester', value)}
                        disabled={!formData.branch || (fetchingOptions && !semesters.length)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map(semester => (
                            <SelectItem key={semester} value={semester}>
                              Semester {semester}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.branch && fetchingOptions && !semesters.length && (
                        <p className="text-xs text-blue-500 flex items-center mt-1">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Loading semesters...
                        </p>
                      )}
                    </div>
                    
                    {/* Session */}
                    <div className="space-y-2">
                      <Label htmlFor="session">Session</Label>
                      <Select
                        value={formData.session}
                        onValueChange={(value) => handleSelectChange('session', value)}
                        disabled={!formData.branch || (fetchingOptions && !sessions.length)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent>
                          {sessions.map(session => (
                            <SelectItem key={session} value={session}>
                              {session}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.branch && fetchingOptions && !sessions.length && (
                        <p className="text-xs text-blue-500 flex items-center mt-1">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Loading sessions...
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Provide a brief description of the document"
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>
                
                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={
                    !file || 
                    uploadStatus === 'uploading' || 
                    !formData.department || 
                    !formData.branch || 
                    !formData.semester || 
                    !formData.session || 
                    !formData.subject
                  }
                  className="w-full mt-4"
                >
                  {uploadStatus === 'uploading' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Uploads */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUploads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent uploads</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {recentUploads.map(upload => (
                    <li key={upload.id} className="border p-3 rounded-md">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 mt-0.5 text-primary" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{upload.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{upload.filename}</p>
                          <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                            <span>{upload.departmentName} • </span>
                            <span>Sem {upload.semester} • </span>
                            <span>{upload.session}</span>
                          </div>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {formatDate(upload.uploadedAt)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PDFUpload; 