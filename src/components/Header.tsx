import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/use-cart";
import { useState, useEffect } from "react";
import { User, ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { onAuthStateChange, signOutUser } from "@/lib/authService";
import { toast } from "sonner";
import type { User as FirebaseUser } from "firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: "Shop All", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("Logged out successfully");
      setIsMenuOpen(false);
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              FITIN
              <span className="block text-xs font-light uppercase tracking-widest text-muted-foreground">
                Clothing Store
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-6 md:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium tracking-wide hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side: Cart, User & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:gap-4">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {currentUser.displayName || currentUser.email}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </>
            ) : (
              <Button variant="ghost" size="icon" className="relative hidden md:flex" onClick={() => navigate('/login')}>
                <User className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="relative hidden md:flex" onClick={() => navigate('/checkout')}>
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            </Button>
            <span className="hidden md:inline text-sm font-medium">PKR {totalPrice.toFixed(2)}</span>
            
            {/* Mobile Menu Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  className="text-sm font-medium tracking-wide hover:text-primary transition-colors py-2"
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                {currentUser ? (
                  <>
                    <div className="px-2 py-2 bg-muted/50 rounded">
                      <p className="text-sm font-medium">{currentUser.displayName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2" 
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2" 
                    onClick={() => { navigate('/login'); handleNavClick(); }}
                  >
                    <User className="h-5 w-5" />
                    Login / Sign Up
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2" 
                  onClick={() => { navigate('/checkout'); handleNavClick(); }}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Cart ({totalItems} items) - PKR {totalPrice.toFixed(2)}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
