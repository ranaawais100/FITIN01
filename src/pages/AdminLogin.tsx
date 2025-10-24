import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { signInUser, onAuthStateChange } from "@/lib/authService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated and is an admin
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // Check if user is admin
        const isAdmin = await checkIfUserIsAdmin(user.uid);
        if (isAdmin) {
          navigate("/admin");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Check if user has admin role in Firestore
  const checkIfUserIsAdmin = async (userId: string): Promise<boolean> => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.role === "admin";
      }
      // User document doesn't exist
      console.warn("User profile not found in Firestore");
      return false;
    } catch (error: unknown) {
      // Handle permission errors gracefully
      const errorObj = error as { code?: string };
      if (errorObj.code === 'permission-denied') {
        console.error("Permission denied. Please check Firestore security rules.");
        toast.error("Database permission error. Please contact administrator.");
      } else {
        console.error("Error checking admin status:", error);
      }
      return false;
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with Firebase Authentication
      const user = await signInUser(email, password);

      // Check if user has admin role
      const isAdmin = await checkIfUserIsAdmin(user.uid);

      if (isAdmin) {
        // Store admin session
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminId", user.uid);
        toast.success("Login successful! Welcome to Admin Dashboard");
        navigate("/admin");
      } else {
        toast.error("Access denied. You don't have admin privileges.");
        toast.info("If you just created your admin account, please set up your Firestore profile.");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      
      // Provide specific error messages
      const errorObj = error as { code?: string; message?: string };
      if (errorObj.code === 'permission-denied') {
        toast.error("Database access denied. Please update Firestore security rules.");
      } else if (errorObj.message) {
        toast.error(errorObj.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-muted/10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-background p-8 rounded-xl shadow-lg border border-border">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
              <p className="text-muted-foreground text-sm">
                Enter your credentials to access the admin dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="admin@clothingstore.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login to Dashboard"}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs font-medium mb-2 text-muted-foreground">Admin Access Required</p>
              <p className="text-xs text-muted-foreground">
                Please sign in with your admin credentials. Only authorized admin accounts can access the dashboard.
              </p>
            </div>

            {/* Back to Home */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-sm text-primary hover:underline"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
