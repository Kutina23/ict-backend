// Mock API service for development and testing
// This file provides mock responses for the admin CRUD operations

interface MockResponse {
  success: boolean;
  data?: any;
  message?: string;
}

// Mock data storage (in a real app, this would be a database)
let mockStudents: any[] = [
  {
    id: 1,
    name: "John Doe",
    index_number: "ICT2021001",
    level: "ICT 300",
    email: "john.doe@student.edu",
    phone: "0241234567",
    status: "active"
  },
  {
    id: 2,
    name: "Jane Smith",
    index_number: "ICT2021002",
    level: "B-Tech 200",
    email: "jane.smith@student.edu",
    phone: "0241234568",
    status: "active"
  },
  {
    id: 3,
    name: "Bob Johnson",
    index_number: "ICT2021003",
    level: "ICT 300",
    email: "bob.johnson@student.edu",
    phone: "0241234569",
    status: "active"
  }
];

let mockDues: any[] = [
  {
    id: 1,
    title: "Semester Fees",
    amount: 500,
    level: "ICT 300",
    academic_year: "2024/2025",
    description: "General semester fees for all ICT 300 students"
  },
  {
    id: 2,
    title: "Exam Fees",
    amount: 200,
    level: "B-Tech 200",
    academic_year: "2024/2025",
    description: "End of semester examination fees"
  }
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API responses
export const mockApi = {
  // Student endpoints
  getStudents: async (): Promise<MockResponse> => {
    await delay(500);
    return { success: true, data: mockStudents };
  },

  createStudent: async (studentData: any): Promise<MockResponse> => {
    await delay(500);
    const newStudent = {
      id: Math.max(...mockStudents.map(s => s.id)) + 1,
      ...studentData,
      status: "active"
    };
    mockStudents.push(newStudent);
    return { success: true, data: newStudent };
  },

  updateStudent: async (id: number, studentData: any): Promise<MockResponse> => {
    await delay(500);
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    // Don't update password if it's empty
    const updateData = { ...studentData };
    if (!updateData.password) {
      delete updateData.password;
    }
    
    mockStudents[index] = { ...mockStudents[index], ...updateData };
    return { success: true, data: mockStudents[index] };
  },

  deleteStudent: async (id: number): Promise<MockResponse> => {
    await delay(500);
    const index = mockStudents.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error("Student not found");
    }
    
    mockStudents.splice(index, 1);
    return { success: true, data: { id } };
  },

  // Due endpoints
  getDues: async (): Promise<MockResponse> => {
    await delay(500);
    return { success: true, data: mockDues };
  },

  createDue: async (dueData: any): Promise<MockResponse> => {
    await delay(500);
    const newDue = {
      id: Math.max(...mockDues.map(d => d.id)) + 1,
      ...dueData,
      amount: parseFloat(dueData.amount)
    };
    mockDues.push(newDue);
    return { success: true, data: newDue };
  },

  updateDue: async (id: number, dueData: any): Promise<MockResponse> => {
    await delay(500);
    const index = mockDues.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error("Due not found");
    }
    
    mockDues[index] = { 
      ...mockDues[index], 
      ...dueData,
      amount: parseFloat(dueData.amount)
    };
    return { success: true, data: mockDues[index] };
  },

  deleteDue: async (id: number): Promise<MockResponse> => {
    await delay(500);
    const index = mockDues.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error("Due not found");
    }
    
    mockDues.splice(index, 1);
    return { success: true, data: { id } };
  }
};

// Function to enable mock API (call this in development)
export const enableMockApi = () => {
  // Override axios methods for development
  if (import.meta.env.DEV) {
    console.log("Mock API enabled for development");
  }
};

// Function to reset mock data (useful for testing)
export const resetMockData = () => {
  mockStudents = [
    {
      id: 1,
      name: "John Doe",
      index_number: "ICT2021001",
      level: "ICT 300",
      email: "john.doe@student.edu",
      phone: "0241234567",
      status: "active"
    },
    {
      id: 2,
      name: "Jane Smith",
      index_number: "ICT2021002",
      level: "B-Tech 200",
      email: "jane.smith@student.edu",
      phone: "0241234568",
      status: "active"
    },
    {
      id: 3,
      name: "Bob Johnson",
      index_number: "ICT2021003",
      level: "ICT 300",
      email: "bob.johnson@student.edu",
      phone: "0241234569",
      status: "active"
    }
  ];

  mockDues = [
    {
      id: 1,
      title: "Semester Fees",
      amount: 500,
      level: "ICT 300",
      academic_year: "2024/2025",
      description: "General semester fees for all ICT 300 students"
    },
    {
      id: 2,
      title: "Exam Fees",
      amount: 200,
      level: "B-Tech 200",
      academic_year: "2024/2025",
      description: "End of semester examination fees"
    }
  ];
};