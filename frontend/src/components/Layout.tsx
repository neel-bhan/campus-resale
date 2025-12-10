import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  user?: any;
  onLogout?: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-bold hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-white">Campus</span>
            <span className="text-teal-400">Resale</span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/posts")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Marketplace
            </button>
          </nav>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <button
              onClick={() => navigate("/")}
              className="text-xl font-bold mb-4 md:mb-0 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-white">Campus</span>
              <span className="text-teal-400">Resale</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
