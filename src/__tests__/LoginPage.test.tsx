import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import { renderWithProviders } from "../utils/test-utils";
import { authService } from "../services/authService";
import { message } from "antd";

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
    login: vi.fn(),
    loginWithFacebook: vi.fn(),
    loginWithGoogle: vi.fn(),
  },
}));

const mockLoginWithGoogle = vi.fn();
vi.mock("../hooks/useGoogleOAuth", () => ({
  default: () => ({
    loginWithGoogle: mockLoginWithGoogle,
    loading: false,
  }),
}));

vi.mock("@greatsumini/react-facebook-login", () => ({
  default: (props: any) => {
    return (
      <div>
        {props.render ? props.render({ onClick: () => {} }) : null}
        <button
          data-testid="fb-mock-success"
          onClick={() =>
            props.onSuccess({
              accessToken: "fake_facebook_token",
            })
          }
        >
          Mock FB Success
        </button>
        <button
          data-testid="fb-mock-success-empty"
          onClick={() =>
            props.onSuccess({
              accessToken: "fake_facebook_token_empty",
            })
          }
        >
          Mock FB Success Empty
        </button>
        <button
          data-testid="fb-mock-fail"
          onClick={() => props.onFail({ message: "FB login failed" })}
        >
          Mock FB Fail
        </button>
      </div>
    );
  },
}));

vi.mock("antd", async () => {
  const original = await vi.importActual("antd");
  return {
    ...original,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render form fields, login button, and social options", () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByText("login.title")).toBeInTheDocument();
    expect(screen.getByLabelText("login.email")).toBeInTheDocument();
    expect(screen.getByLabelText("login.password")).toBeInTheDocument();
    expect(screen.getByText("login.login_btn")).toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Facebook")).toBeInTheDocument();
  });

  it("should successfully submit form, dispatch setUser state and navigate to /employees", async () => {
    const mockUser = { id: "1", email: "admin@gmail.com", name: "Admin" };
    vi.mocked(authService.login).mockResolvedValueOnce(mockUser);

    const { store } = renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText("login.email"), {
      target: { value: "admin@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText("login.password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("login.login_btn").closest("button")!);

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith(
        "admin@gmail.com",
        "password123",
      );
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(message.success).toHaveBeenCalledWith("login.success");
      expect(mockNavigate).toHaveBeenCalledWith("/employees");
    });
  });

  it("should display error message on submit failure", async () => {
    vi.mocked(authService.login).mockRejectedValueOnce(
      new Error("Invalid credentials"),
    );

    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText("login.email"), {
      target: { value: "wrong@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText("login.password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("login.login_btn").closest("button")!);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("should trigger loginWithGoogle when clicking Google button", () => {
    renderWithProviders(<LoginPage />);

    fireEvent.click(screen.getByText("Google").closest("button")!);
    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });

  it("should handle facebook login success flow", async () => {
    const mockUser = { id: "2", email: "fb@example.com", name: "FB User" };
    vi.mocked(authService.loginWithFacebook).mockResolvedValueOnce(mockUser);

    const { store } = renderWithProviders(<LoginPage />);

    fireEvent.click(screen.getByTestId("fb-mock-success"));

    await waitFor(() => {
      expect(authService.loginWithFacebook).toHaveBeenCalledWith(
        "fake_facebook_token",
      );
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith("/employees");
    });
  });

  it("should handle facebook login fail flow", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    renderWithProviders(<LoginPage />);

    fireEvent.click(screen.getByTestId("fb-mock-fail"));

    expect(consoleSpy).toHaveBeenCalledWith("Facebook Login Failed:", {
      message: "FB login failed",
    });
    consoleSpy.mockRestore();
  });

  it("should handle facebook login service failure", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(authService.loginWithFacebook).mockRejectedValueOnce(
      new Error("Facebook service down"),
    );

    renderWithProviders(<LoginPage />);

    fireEvent.click(screen.getByTestId("fb-mock-success"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Lỗi xác thực Facebook:",
        expect.any(Error),
      );
    });
    consoleSpy.mockRestore();
  });

  it("should display default error message when err.message is empty", async () => {
    vi.mocked(authService.login).mockRejectedValueOnce({ message: "" });

    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText("login.email"), {
      target: { value: "wrong@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText("login.password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("login.login_btn").closest("button")!);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("login.failed");
    });
  });

  it("should handle facebook login success flow with missing profile name and picture", async () => {
    const mockUser = { id: "2", email: "fb@example.com", name: "" };
    vi.mocked(authService.loginWithFacebook).mockResolvedValueOnce(mockUser);

    const { store } = renderWithProviders(<LoginPage />);

    fireEvent.click(screen.getByTestId("fb-mock-success-empty"));

    await waitFor(() => {
      expect(authService.loginWithFacebook).toHaveBeenCalledWith(
        "fake_facebook_token_empty",
      );
      expect(store.getState().auth.user).toEqual(mockUser);
      expect(store.getState().auth.isAuthenticated).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith("/employees");
    });
  });
});
