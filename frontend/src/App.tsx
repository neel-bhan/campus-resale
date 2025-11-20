import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "./App.css";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { Dashboard } from "./pages/Dashboard";
import { PostsListingPage } from "./pages/PostsListingPage";
import { mockUser } from "./utils/mockData";

function App() {
  // Use mock user for frontend-only mode
  const [user] = useState(mockUser);

  const handleLogout = () => {
    // In frontend-only mode, logout just refreshes
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <Dashboard user={user} />
            </Layout>
          }
        />
        <Route
          path="/posts"
          element={
            <Layout user={user} onLogout={handleLogout}>
              <PostsListingPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
