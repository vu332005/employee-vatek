import { describe, it, expect, vi, beforeEach } from "vitest";
import { employeeService } from "../services/employeeService";
import axiosClient from "../configs/axiosClient";

vi.mock("../configs/axiosClient", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

describe("employeeService", () => {
  const mockEmployee = {
    id: "1",
    name: "Nguyen Van A",
    email: "a@gmail.com",
    age: 20,
    phone: "0123456789",
    country: "Vietnam",
    image: "https://example.com/a.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getAll and return data", async () => {
    vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: [mockEmployee] });

    const employees = await employeeService.getAll();

    expect(axiosClient.get).toHaveBeenCalledWith("/employees");
    expect(employees).toEqual([mockEmployee]);
  });

  it("should call create and return new employee", async () => {
    const input = {
      name: "Nguyen Van A",
      email: "a@gmail.com",
      age: 20,
      phone: "0123456789",
      country: "Vietnam",
      image: "https://example.com/a.jpg",
    };
    vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockEmployee });

    const created = await employeeService.create(input);

    expect(axiosClient.post).toHaveBeenCalledWith("/employees", input);
    expect(created).toEqual(mockEmployee);
  });

  it("should call update and return updated employee", async () => {
    const input = {
      name: "Nguyen Van A Updated",
      email: "a@gmail.com",
      age: 21,
      phone: "0123456789",
      country: "Vietnam",
      image: "https://example.com/a.jpg",
    };
    const updatedEmployee = { ...mockEmployee, ...input };
    vi.mocked(axiosClient.put).mockResolvedValueOnce({ data: updatedEmployee });

    const updated = await employeeService.update("1", input);

    expect(axiosClient.put).toHaveBeenCalledWith("/employees/1", input);
    expect(updated).toEqual(updatedEmployee);
  });

  it("should call delete with id", async () => {
    vi.mocked(axiosClient.delete).mockResolvedValueOnce({});

    await employeeService.delete("1");

    expect(axiosClient.delete).toHaveBeenCalledWith("/employees/1");
  });
});
