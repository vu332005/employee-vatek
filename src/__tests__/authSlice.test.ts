import { describe, it, expect, beforeEach, vi } from "vitest";
import authReducer, { setUser, logout } from "../store/slices/authSlice";
import type { AuthState } from "../types/auth";

describe("authSlice reducer", () => {
  const mockUser = {
    id: "1",
    email: "admin@gmail.com",
    name: "Admin",
    picture: "https://example.com/avatar.jpg",
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return the initial state when passed an empty action", () => {
    const initialState = authReducer(undefined, { type: "" });
    expect(initialState).toEqual({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it("should handle setUser action", () => {
    const previousState: AuthState = {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: "some error",
    };

    const nextState = authReducer(previousState, setUser(mockUser));

    expect(nextState.user).toEqual(mockUser);
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.error).toBeNull();

    expect(localStorage.getItem("user")).toEqual(JSON.stringify(mockUser));
  });

  it("should handle logout action", () => {
    const previousState: AuthState = {
      user: mockUser,
      isAuthenticated: true,
      loading: false,
      error: null,
    };
    localStorage.setItem("user", JSON.stringify(mockUser));

    const nextState = authReducer(previousState, logout());

    expect(nextState.user).toBeNull();
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.error).toBeNull();

    expect(localStorage.getItem("user")).toBeNull();
  });

  it("should initialize state with user from localStorage if present", async () => {
    const testUser = { id: "2", email: "stored@gmail.com", name: "Stored" };
    localStorage.setItem("user", JSON.stringify(testUser));

    vi.resetModules();
    const { default: dynamicAuthReducer } =
      await import("../store/slices/authSlice");

    const initialState = dynamicAuthReducer(undefined, { type: "" });
    expect(initialState.user).toEqual(testUser);
    expect(initialState.isAuthenticated).toBe(true);
  });
});
