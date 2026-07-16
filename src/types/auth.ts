import type { Employee } from "./employee";

// vẫn phải declare id,email,.. -> vì dùng partial ở ngoài -> các type thành hết optional -> các type declare ở đây là required
export interface User extends Partial<Omit<Employee, "password">> {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
