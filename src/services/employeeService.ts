import axiosClient from '../configs/axiosClient';
import type { Employee } from '../types/employee';

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await axiosClient.get<Employee[]>('/employees');
    return response.data;
  },
  create: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    const response = await axiosClient.post<Employee>('/employees', employee);
    return response.data;
  },
  update: async (id: string, employee: Omit<Employee, 'id'>): Promise<Employee> => {
    const response = await axiosClient.put<Employee>(`/employees/${id}`, employee);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/employees/${id}`);
  },
};
