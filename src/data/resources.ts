export interface Department {
  id: string;
  name: string;
  icon: string;
  description: string;
  branches?: Branch[];
  semesters?: number[];
}

export interface Branch {
  id: string;
  name: string;
  semesters: number[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'notes' | 'pyq' | 'syllabus';
  path: string;
  semester: number;
  session: string;
}

export const departments: Department[] = [
  {
    id: "btech",
    name: "B.Tech",
    icon: "/icons/btech.svg",
    description: "Bachelor of Technology - Engineering courses covering Computer Science and Electronics",
    branches: [
      {
        id: "cse",
        name: "Computer Science",
        semesters: [1, 2, 3, 4, 5, 6, 7, 8]
      },
      {
        id: "ece",
        name: "Electronics",
        semesters: [1, 2, 3, 4, 5, 6, 7, 8]
      }
    ]
  },
  {
    id: "bca",
    name: "BCA",
    icon: "/icons/bca.svg",
    description: "Bachelor of Computer Applications - Comprehensive computer science program",
    semesters: [1, 2, 3, 4, 5, 6]
  }
]; 