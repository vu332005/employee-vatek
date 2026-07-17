import axiosClient from "../configs/axiosClient";
import type { Employee } from "../types/employee";

export const employeeService = {
  getAll: async (): Promise<Employee[]> => {
    const response = await axiosClient.get<Employee[]>("/employees");
    return response.data;
  },
  create: async (
    employee: Omit<Employee, "id">,
    file?: File | null,
  ): Promise<Employee> => {
    if (file) {
      // target of this code -> merge binary file + text data -> to send to backend in one req
      const formData = new FormData();
      // object.entries -> convert obj to key-value array
      Object.entries(employee).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, String(val));
          }
        }
      });
      formData.append("image", file);
      const response = await axiosClient.post<Employee>(
        "/employees",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    }
    const response = await axiosClient.post<Employee>("/employees", employee);
    return response.data;
  },
  update: async (
    id: string,
    employee: Omit<Employee, "id">,
    file?: File | null,
  ): Promise<Employee> => {
    if (file) {
      const formData = new FormData();
      Object.entries(employee).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          if (Array.isArray(val)) {
            formData.append(key, JSON.stringify(val));
          } else {
            formData.append(key, String(val));
          }
        }
      });
      formData.append("image", file);
      const response = await axiosClient.put<Employee>(
        `/employees/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    }
    const response = await axiosClient.put<Employee>(
      `/employees/${id}`,
      employee,
    );
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await axiosClient.delete(`/employees/${id}`);
  },
};
