export interface Employee {
  id: string;
  name: string;
  email: string;
  password?: string;
  age: number;
  phone: string;
  country: string;
  image: string;
  roles?: string[];
}

export interface EmployeeState {
  employees: Employee[];
}
