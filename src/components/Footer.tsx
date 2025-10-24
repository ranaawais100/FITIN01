import { Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ScrollToTop } from "./ui/ScrollToTop";

const Footer = () => {
  const footerLinks = {
    shop: ["All Products", "Mens Track Suit", "Shalwar Kameez", "Shirts", "Hoodies", "Trouser"],
  company: ["About Us", "Contact"],
    support: ["FAQ", "Shipping", "Returns", "Track Order", "Size Guide"],
  };

  return (
  <footer className="bg-background text-foreground border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 md:gap-6 lg:gap-8 mb-12 justify-between">
          {/* Brand */}
          <div className="w-full md:w-[35%] lg:w-[40%]">
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-primary">
              FITIN
              <span className="block text-xs font-light uppercase tracking-widest text-accent">
                Clothing Brand
              </span>
            </h3>
            <p className="text-xs md:text-sm opacity-70 mb-6 max-w-sm text-foreground">
              Discover premium menswear that helps you express your unique style and confidence.
            </p>
            <div className="flex gap-2 md:gap-4">
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-primary hover:bg-accent/20 h-8 w-8 md:h-10 md:w-10"
                asChild
              >
                <a href="https://www.facebook.com/share/1CkpPShAKy/" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-primary hover:bg-accent/20 h-8 w-8 md:h-10 md:w-10"
                asChild
              >
                <a href="https://www.instagram.com/hu25401?utm_source=qr&igsh=MXhvYzJueHJ5cGltaQ==" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Shop Links */}
          <div className="w-[30%] md:w-[18%] lg:w-[15%]">
            <h4 className="font-semibold mb-2 md:mb-4 uppercase tracking-wider text-xs md:text-sm text-primary">
              Shop
            </h4>
            <ul className="space-y-1 md:space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  {link === "All Products" ? (
                    <Link
                      to="/products"
                      className="text-xs md:text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all"
                    >
                      {link}
                    </Link>
                  ) : (
                    <a
                      href="#"
                      className="text-xs md:text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all"
                    >
                      {link}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="w-[30%] md:w-[18%] lg:w-[15%]">
            <h4 className="font-semibold mb-2 md:mb-4 uppercase tracking-wider text-xs md:text-sm text-primary">
              Company
            </h4>
            <ul className="space-y-1 md:space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  {link === "About Us" ? (
                    <Link
                      to="/about"
                      className="text-xs md:text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all"
                    >
                      {link}
                    </Link>
                  ) : link === "Contact" ? (
                    <Link
                      to="/contact"
                      className="text-xs md:text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all"
                    >
                      {link}
                    </Link>
                  ) : (
                    <a
                      href="#"
                      className="text-xs md:text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all"
                    >
                      {link}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="w-[30%] md:w-[18%] lg:w-[15%]">
            <h4 className="font-semibold mb-2 md:mb-4 uppercase tracking-wider text-xs md:text-sm text-primary">
              Support
            </h4>
            <ul className="space-y-1 md:space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-xs md:text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <ScrollToTop />
        </div>

        {/* Copyright */}
        <div className="text-center text-sm opacity-70 border-t border-border pt-8">
          <p>&copy; 2024 FITIN Clothing Brand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
