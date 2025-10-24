import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signInUser } from "@/lib/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    
    try {
      // Sign in with Firebase Authentication
      const user = await signInUser(email, password);
      toast.success(`Welcome back, ${user.displayName || 'User'}!`);
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error: unknown) {
      const errorMessage = (error as { message?: string }).message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-muted/10 py-12">
        <form onSubmit={handleSubmit} className="bg-background p-8 rounded-xl shadow-md w-full max-w-md space-y-6">
          <h1 className="text-2xl font-bold mb-2 text-center">Login</h1>
          <p className="text-muted-foreground text-center mb-4">Welcome back! Please login to your account.</p>
          {error && <div className="bg-destructive/10 text-destructive p-2 rounded text-sm">{error}</div>}
          <div>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-border rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-border rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary underline hover:text-primary/80">Sign Up</Link>
          </div>
          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to Home
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
