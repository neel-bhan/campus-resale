import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertCircle, ArrowLeft, Sparkles, Shield, Users } from "lucide-react";
import { loginUser, registerUser, setAuthToken } from "@/utils/api";
import type { LoginRequest, RegisterRequest } from "@/utils/api";

interface LoginPageProps {
  onLoginSuccess?: (token: string, user: any) => void;
  user?: any;
}

export function LoginPage({ onLoginSuccess, user }: LoginPageProps) {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState<
    RegisterRequest & { university: string }
  >({
    email: "",
    password: "",
    name: "",
    university: "",
  });

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser(loginForm);
      if (response.data && response.data.token) {
        setAuthToken(response.data.token);
        onLoginSuccess?.(response.data.token, response.data.user);
        navigate("/dashboard");
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle register form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await registerUser({
        email: registerForm.email,
        password: registerForm.password,
        name: registerForm.name,
        university: registerForm.university,
      });

      if (response.data && response.data.token) {
        setAuthToken(response.data.token);
        onLoginSuccess?.(response.data.token, response.data.user);
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(5,150,105,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(5,150,105,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>
        <div className="text-xl font-bold">
          <span className="text-white">Campus</span>
          <span className="text-teal-400">Resale</span>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] px-6">
        <div className="w-full max-w-md">
          {/* Floating card effect */}
          <div className="relative">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-400/20 to-blue-400/20 rounded-3xl blur opacity-25"></div>
            
            {/* Main card */}
            <div className="relative bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 shadow-2xl">
              {/* Header with icon */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-teal-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                  <Sparkles className="w-8 h-8 text-teal-400" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-ping"></div>
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  {isSignUp ? "Join the Community" : "Welcome Back"}
                </h1>
                <p className="text-gray-400">
                  {isSignUp 
                    ? "Create your student account to get started" 
                    : "Sign in to access your campus marketplace"
                  }
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 animate-shake">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={isSignUp ? handleRegister : handleLogin} className="space-y-6">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300 font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={registerForm.name}
                      onChange={(e) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-2xl h-12 transition-all duration-200"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 font-medium">
                    University Email
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@university.edu"
                      value={isSignUp ? registerForm.email : loginForm.email}
                      onChange={(e) => {
                        if (isSignUp) {
                          setRegisterForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                        } else {
                          setLoginForm((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                        }
                      }}
                      className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-2xl h-12 pl-12 transition-all duration-200"
                      required
                    />
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="university" className="text-gray-300 font-medium">
                      University
                    </Label>
                    <div className="relative">
                      <Input
                        id="university"
                        type="text"
                        placeholder="University of Example"
                        value={registerForm.university}
                        onChange={(e) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            university: e.target.value,
                          }))
                        }
                        className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-2xl h-12 pl-12 transition-all duration-200"
                        required
                      />
                      <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={isSignUp ? registerForm.password : loginForm.password}
                      onChange={(e) => {
                        if (isSignUp) {
                          setRegisterForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }));
                        } else {
                          setLoginForm((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }));
                        }
                      }}
                      className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-2xl h-12 pr-12 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-teal-400 to-blue-400 hover:from-teal-300 hover:to-blue-300 text-black font-semibold h-12 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                      {isSignUp ? "Creating Account..." : "Signing In..."}
                    </div>
                  ) : (
                    isSignUp ? "Create Account" : "Sign In"
                  )}
                </Button>
              </form>

              {/* Switch between login and signup */}
              <div className="mt-8 text-center">
                <p className="text-gray-400 mb-4">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                  }}
                  className="text-teal-400 hover:text-teal-300 font-semibold transition-colors underline underline-offset-4 hover:no-underline"
                >
                  {isSignUp ? "Sign In Instead" : "Create Account"}
                </button>
              </div>

              {/* Features showcase for signup */}
              {isSignUp && (
                <div className="mt-8 pt-6 border-t border-gray-800/50">
                  <p className="text-gray-400 text-sm text-center mb-4">Join thousands of students trading safely</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-gray-800/30 rounded-xl">
                      <div className="w-8 h-8 bg-teal-400/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-4 h-4 text-teal-400" />
                      </div>
                      <p className="text-xs text-gray-400">Verified</p>
                    </div>
                    <div className="p-3 bg-gray-800/30 rounded-xl">
                      <div className="w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-xs text-gray-400">Trusted</p>
                    </div>
                    <div className="p-3 bg-gray-800/30 rounded-xl">
                      <div className="w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-xs text-gray-400">Exclusive</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
