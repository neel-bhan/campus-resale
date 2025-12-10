import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-8">
          <div className="text-xl font-bold">
            <span className="text-white">Campus</span>
            <span className="text-teal-400">Resale</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-gray-300">
            <button 
              onClick={() => navigate("/")}
              className="hover:text-white transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate("/posts?filter=sports-tickets")}
              className="hover:text-white transition-colors"
            >
              Sports Tickets
            </button>
            <button 
              onClick={() => navigate("/posts?category=textbooks")}
              className="hover:text-white transition-colors"
            >
              Textbooks
            </button>
            <button 
              onClick={() => navigate("/posts")}
              className="hover:text-white transition-colors"
            >
              Marketplace
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-black transition-colors bg-transparent"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            className="bg-teal-400 text-black hover:bg-teal-300 hover:text-black transition-colors"
            onClick={() => navigate("/posts")}
          >
            Browse Marketplace
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            The Ultimate <span className="text-teal-400">College</span>
            <br />
            <span className="text-teal-400">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
            Buy and sell tickets, textbooks, and more exclusively with verified
            students from your university.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-teal-400 text-black hover:bg-teal-300 transition-colors px-8 py-4 text-lg font-semibold"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-700 hover:text-white transition-colors px-8 py-4 text-lg bg-transparent"
              onClick={() => navigate("/posts")}
            >
              Browse Marketplace
            </Button>
          </div>
        </div>
      </main>

      {/* How it Works Section */}
      <section className="container mx-auto px-6 lg:px-8 py-20 lg:py-32">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-16">
          How <span className="text-teal-400">Campus</span>
          <span className="text-teal-400">Resale</span> Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Student Verification */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 hover:bg-gray-900/50 transition-all duration-300">
            <div className="w-14 h-14 bg-teal-400/20 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Student Verification
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Sign up with your university email to verify your identity and
              gain access to your campus marketplace.
            </p>
          </div>

          {/* Sports Tickets */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 hover:bg-gray-900/50 transition-all duration-300">
            <div className="w-14 h-14 bg-teal-400/20 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Sports Tickets
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Buy and sell tickets for college games at fair prices directly
              from other students.
            </p>
          </div>

          {/* Textbook Exchange */}
          <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 hover:border-gray-700 hover:bg-gray-900/50 transition-all duration-300">
            <div className="w-14 h-14 bg-teal-400/20 rounded-xl flex items-center justify-center mb-6">
              <svg
                className="w-7 h-7 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">
              Textbook Exchange
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Save money by trading textbooks with students who've already taken
              your courses.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-6 lg:px-8">
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
