import api from './api';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  cardUID?: string;
  grade: string;
  class: string;
  photo?: string;
  photoUpdatedAt?: string;
  schoolId: string;
  accountId?: string;
  accountBalance?: number;
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address?: string;
  receiveSMS: boolean;
}

export interface StudentRegistrationData {
  firstName: string;
  lastName: string;
  studentId?: string;
  cardUID: string;
  grade: string;
  class: string;
  schoolId: string;
  initialBalance?: number;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  parentEmail?: string;
  parentAddress?: string;
  parentReceiveSMS: boolean;
}

export const studentsService = {
  getAll: async (params?: any) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  register: async (data: StudentRegistrationData) => {
    const response = await api.post('/students/register', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Student>) => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  uploadPhoto: async (id: string, photoFile: File) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const response = await api.post(`/students/${id}/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deletePhoto: async (id: string) => {
    const response = await api.delete(`/students/${id}/photo`);
    return response.data;
  },
};


