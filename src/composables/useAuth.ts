import Cookies from "js-cookie";

export function useAuth() {
  // Check if user is logged in
  const isAuthenticated = () => {
    return !!Cookies.get("accessToken"); // Returns true if token exists
  };

  // Logout function
  const logout = () => {
    Cookies.remove("accessToken"); // Remove token
    window.location.href = "/login"; // Redirect to login page
  };

  return { isAuthenticated, logout };
}
