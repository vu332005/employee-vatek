import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "../services/authService";
import axiosClient from "../configs/axiosClient";

vi.mock("../configs/axiosClient", () => {
  return {
    default: {
      get: vi.fn(),
      post: vi.fn(),
    },
  };
});

describe("authService", () => {
  const mockUser = {
    id: "1",
    email: "admin@gmail.com",
    name: "Admin",
    picture: "http://example.com/pic.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should return a user if login succeeds", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: [mockUser] });

      const user = await authService.login("admin@gmail.com", "password123");

      expect(axiosClient.get).toHaveBeenCalledWith("/users", {
        params: { email: "admin@gmail.com", password: "password123" },
      });
      expect(user).toEqual(mockUser);
    });

    it("should throw an error if no user is returned", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: [] });

      await expect(
        authService.login("admin@gmail.com", "password123"),
      ).rejects.toThrow("Email hoặc mật khẩu không chính xác!");
    });
  });

  describe("loginWithGoogle", () => {
    it("should login directly if user already exists", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: [mockUser] });

      const googleUser = {
        email: "admin@gmail.com",
        name: "Admin",
        picture: "http://example.com/pic.jpg",
      };
      const user = await authService.loginWithGoogle(googleUser);

      expect(axiosClient.get).toHaveBeenCalledWith("/users", {
        params: { email: "admin@gmail.com" },
      });
      expect(axiosClient.post).not.toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it("should register and return new user if user does not exist", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: [] });
      vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockUser });

      const googleUser = {
        email: "new@gmail.com",
        name: "New User",
        picture: "http://example.com/pic.jpg",
      };
      const user = await authService.loginWithGoogle(googleUser);

      expect(axiosClient.get).toHaveBeenCalledWith("/users", {
        params: { email: "new@gmail.com" },
      });
      expect(axiosClient.post).toHaveBeenCalledWith("/users", {
        email: "new@gmail.com",
        name: "New User",
        picture: "http://example.com/pic.jpg",
      });
      expect(user).toEqual(mockUser);
    });
  });

  describe("loginWithFacebook", () => {
    it("should login directly if user already exists", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: [mockUser] });

      const fbUser = {
        email: "admin@gmail.com",
        name: "Admin",
        picture: "http://example.com/pic.jpg",
      };
      const user = await authService.loginWithFacebook(fbUser);

      expect(axiosClient.get).toHaveBeenCalledWith("/users", {
        params: { email: "admin@gmail.com" },
      });
      expect(axiosClient.post).not.toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it("should register and return new user if user does not exist", async () => {
      vi.mocked(axiosClient.get).mockResolvedValueOnce({ data: [] });
      vi.mocked(axiosClient.post).mockResolvedValueOnce({ data: mockUser });

      const fbUser = {
        email: "new@gmail.com",
        name: "New User",
        picture: "http://example.com/pic.jpg",
      };
      const user = await authService.loginWithFacebook(fbUser);

      expect(axiosClient.get).toHaveBeenCalledWith("/users", {
        params: { email: "new@gmail.com" },
      });
      expect(axiosClient.post).toHaveBeenCalledWith("/users", {
        email: "new@gmail.com",
        name: "New User",
        picture: "http://example.com/pic.jpg",
      });
      expect(user).toEqual(mockUser);
    });
  });
});
