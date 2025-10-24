/**
 * TEMPORARY PAGE - CREATE FIRST ADMIN
 * 
 * This page helps you create your first admin user.
 * After creating an admin, DELETE THIS FILE and remove its route.
 * 
 * To use:
 * 1. Add route in App.tsx: <Route path="/create-admin" element={<CreateAdmin />} />
 * 2. Navigate to: http://localhost:8080/create-admin
 * 3. Fill in the form and submit
 * 4. DELETE this file after admin is created
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { signUpUser } from '@/lib/authService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminCreated, setAdminCreated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Create admin user
      const user = await signUpUser(email, password, name, 'admin');

      console.log('✅ Admin user created successfully!');
      console.log('User ID:', user.uid);
      console.log('Email:', email);
      console.log('Name:', name);
      console.log('Role: admin');

      toast.success('Admin user created successfully!');
      setAdminCreated(true);

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/admin-login');
      }, 3000);
    } catch (error: unknown) {
      console.error('Error creating admin:', error);
      const errorMessage = (error as { message?: string }).message || 'Failed to create admin user';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (adminCreated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-muted/10 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="bg-background p-8 rounded-xl shadow-lg border border-border text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Lock className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4 text-green-600">Admin Created!</h1>
              <p className="text-muted-foreground mb-4">
                Your admin account has been created successfully.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm mb-2"><strong>Email:</strong> {email}</p>
                <p className="text-sm mb-2"><strong>Name:</strong> {name}</p>
                <p className="text-sm"><strong>Role:</strong> Admin</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting to login page...
              </p>
              <Button onClick={() => navigate('/admin-login')} className="w-full">
                Go to Login
              </Button>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 font-medium">
                  ⚠️ Important: Delete the file<br />
                  <code className="text-xs">src/pages/CreateAdmin.tsx</code><br />
                  after creating your admin user!
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold mb-2">Create First Admin</h1>
              <p className="text-muted-foreground text-sm">
                Set up your first administrator account
              </p>
            </div>

            {/* Warning */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium">
                ⚠️ This is a temporary setup page. Delete this file after creating your admin account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Admin User"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Admin...' : 'Create Admin Account'}
              </Button>
            </form>

            {/* Info */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                This will create a user account with admin privileges in Firebase Authentication and Firestore.
              </p>
            </div>

            {/* Back */}
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/')}
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
}
