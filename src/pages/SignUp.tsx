import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signUpUser } from "@/lib/authService";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    // Validation
    if (!name || !email || !password || !confirm) {
      setError("Please fill all fields.");
      toast.error("Please fill all fields.");
      setLoading(false);
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    
    if (password !== confirm) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    try {
      // Create user with Firebase Authentication
      await signUpUser(email, password, name);
      toast.success("Account created successfully! Welcome to FITIN.");
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
          <h1 className="text-2xl font-bold mb-2 text-center">Sign Up</h1>
          <p className="text-muted-foreground text-center mb-4">Create your account to get started.</p>
          {error && <div className="bg-destructive/10 text-destructive p-2 rounded text-sm">{error}</div>}
          <div>
            <label className="block text-sm mb-1 font-medium">Full Name</label>
            <input
              type="text"
              className="w-full p-2 border border-border rounded"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>
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
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full p-2 border border-border rounded"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary underline hover:text-primary/80">Sign In</Link>
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
