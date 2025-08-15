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
import { setAuthToken, clearAuthToken } from "./utils/api";

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

  // Check for existing auth token on app start
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      // In a real app, you would validate the token with your backend
      // For now, we'll just set a placeholder user
      setUser({ name: "Student User", email: "student@university.edu" });
    }
    setIsLoading(false);
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
