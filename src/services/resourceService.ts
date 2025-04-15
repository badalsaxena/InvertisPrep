import { Department, Branch, PDFResource } from '../data/resources';
import { extractSubjectName } from '../lib/utils';

// Set API URL - change in production to your deployed backend URL
const API_URL = 'https://invertisprepbackend.vercel.app/api/resources';

// Get all departments
export const getDepartments = async (): Promise<Department[]> => {
  try {
    const response = await fetch(`${API_URL}/departments`);
    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }
    const data = await response.json();
    return data.departments || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};

// Get branches by department
export const getBranches = async (departmentId: string): Promise<Branch[]> => {
  try {
    const response = await fetch(`${API_URL}/departments/${departmentId}/branches`);
    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }
    const data = await response.json();
    return data.branches || [];
  } catch (error) {
    console.error('Error fetching branches:', error);
    return [];
  }
};

// Get semesters by department and branch
export const getSemesters = async (departmentId: string, branchId: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/departments/${departmentId}/branches/${branchId}/semesters`);
    if (!response.ok) {
      throw new Error('Failed to fetch semesters');
    }
    const data = await response.json();
    return data.semesters || [];
  } catch (error) {
    console.error('Error fetching semesters:', error);
    return [];
  }
};

// Get sessions
export const getSessions = async (departmentId: string, branchId: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `${API_URL}/departments/${departmentId}/branches/${branchId}/sessions`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }
    const data = await response.json();
    return data.sessions || [];
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};

// Get files based on filters
export const getFiles = async (
  departmentId: string,
  branchId: string,
  semester: string,
  session: string
): Promise<PDFResource[]> => {
  try {
    const response = await fetch(
      `${API_URL}/files?department=${departmentId}&branch=${branchId}&semester=${semester}&session=${session}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    const data = await response.json();
    const files = data.files || [];
    
    // Process the files to add readable subject names
    return files.map((file: PDFResource) => ({
      ...file,
      subjectName: file.fileName || file.filename ? extractSubjectName(file.fileName || file.filename || '') : file.title
    }));
  } catch (error) {
    console.error('Error fetching files:', error);
    return [];
  }
}; 