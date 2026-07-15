import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "../services/authService";
import axiosClient from "../configs/axiosClient";

vi.mock("../configs/axiosClient", () => {
  return {
    default: {
      post: vi.fn(),
    },
  };
});

describe("authService", () => {
  const mockUser = {
    id: "1",
    email: "admin@gmail.com",
    name: "Admin",
    image: "http://example.com/pic.jpg",
  };
  const mockToken = "mock_jwt_token";

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should return a user and save token if login succeeds", async () => {
      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: { user: mockUser, accessToken: mockToken },
      });

      const user = await authService.login("admin@gmail.com", "password123");

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/login", {
        email: "admin@gmail.com",
        password: "password123",
      });
      expect(localStorage.getItem("accessToken")).toBe(mockToken);
      expect(user).toEqual(mockUser);
    });

    it("should throw an error if no token is returned", async () => {
      vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: {} });

      await expect(
        authService.login("admin@gmail.com", "password123"),
      ).rejects.toThrow("Đăng nhập thất bại!");
    });
  });

  describe("loginWithGoogle", () => {
    it("should login Google and return user and save token", async () => {
      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: { user: mockUser, accessToken: mockToken },
      });

      const user = await authService.loginWithGoogle("fake_google_token");

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/google-login", {
        accessToken: "fake_google_token",
      });
      expect(localStorage.getItem("accessToken")).toBe(mockToken);
      expect(user).toEqual(mockUser);
    });
  });

  describe("loginWithFacebook", () => {
    it("should login Facebook and return user and save token", async () => {
      vi.mocked(axiosClient.post).mockResolvedValueOnce({
        data: { user: mockUser, accessToken: mockToken },
      });

      const user = await authService.loginWithFacebook("fake_facebook_token");

      expect(axiosClient.post).toHaveBeenCalledWith("/auth/facebook-login", {
        accessToken: "fake_facebook_token",
      });
      expect(localStorage.getItem("accessToken")).toBe(mockToken);
      expect(user).toEqual(mockUser);
    });
  });
});
