import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import EmployeeHeader from "../components/share/EmployeeHeader";
import { renderWithProviders } from "../utils/test-utils";
import { message } from "antd";
import { authService } from "../services/authService";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const original = await vi.importActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../services/authService", () => ({
  authService: {
    logout: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("antd", async () => {
  const original = await vi.importActual("antd");
  return {
    ...original,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
    },
  };
});

describe("EmployeeHeader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render header title and default admin label when user name is not present", () => {
    renderWithProviders(<EmployeeHeader />, {
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText("header.title")).toBeInTheDocument();
    expect(screen.getByText("header.admin")).toBeInTheDocument();
  });

  it("should render username when authenticated and name is available", () => {
    renderWithProviders(<EmployeeHeader />, {
      preloadedState: {
        auth: {
          user: { id: "1", email: "admin@gmail.com", name: "John Doe" },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should dispatch logout action, show success message, and navigate to login page upon click", async () => {
    const { store } = renderWithProviders(<EmployeeHeader />, {
      preloadedState: {
        auth: {
          user: { id: "1", email: "admin@gmail.com", name: "John Doe" },
          isAuthenticated: true,
          loading: false,
          error: null,
        },
      },
    });

    const logoutBtn = screen.getByText("header.logout").closest("button")!;
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalled();
      expect(store.getState().auth.isAuthenticated).toBe(false);
      expect(store.getState().auth.user).toBeNull();
      expect(message.success).toHaveBeenCalledWith("header.logout_success");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
