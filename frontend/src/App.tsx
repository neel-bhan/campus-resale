import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { Dashboard } from "./pages/Dashboard";
import {
  setAuthToken,
  clearAuthToken,
  getCurrentUserProfile,
  getAuthToken,
} from "./utils/api";

function App() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoginSuccess = (token: string, userData: any) => {
    setAuthToken(token);
    setUser(userData);
    console.log("Login successful!", { token, user: userData });
  };

  const handleLogout = () => {
    setUser(null);
    clearAuthToken();
  };

  // Check for existing auth token on app start and fetch user data
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          // Fetch actual user profile from backend
          const response = await getCurrentUserProfile();
          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            // Token is invalid, clear it
            clearAuthToken();
            setUser(null);
          }
        } catch (error) {
          // Error fetching user data, clear token
          console.error("Error fetching user profile:", error);
          clearAuthToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuthToken();
  }, []);

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="text-mono-white">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <LoginPage onLoginSuccess={handleLoginSuccess} user={user} />
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout user={user} onLogout={handleLogout}>
                <Dashboard user={user} />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
