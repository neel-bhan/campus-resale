import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  user?: any;
  onLogout?: () => void;
}

export function Layout({ children, user, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">
            <span className="text-white">Campus</span>
            <span className="text-teal-400">Resale</span>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Welcome, {user?.name}!</span>
              <button
                onClick={onLogout}
                className="bg-teal-400 text-black px-4 py-2 rounded-lg hover:bg-teal-300 transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 md:mb-0">
              <span className="text-white">Campus</span>
              <span className="text-teal-400">Resale</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 CampusResale. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
