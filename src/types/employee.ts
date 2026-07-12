export interface Employee {
  id: string;
  name: string;
  email: string;
  age: number;
  phone: string;
  country: string;
  image: string;
}

export interface EmployeeState {
  employees: Employee[];
}
