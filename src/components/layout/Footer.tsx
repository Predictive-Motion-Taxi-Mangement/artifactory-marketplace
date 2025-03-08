
import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary/30 pt-16 pb-8 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-medium tracking-tighter inline-block mb-4">
              artifi
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              A curated marketplace for exceptional AI-generated digital artwork, connecting artists and collectors.
            </p>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-apple"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-apple"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-apple"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-medium text-sm tracking-wide uppercase text-muted-foreground mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/explore" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  All Artwork
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Artists
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-medium text-sm tracking-wide uppercase text-muted-foreground mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/account" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Order History
                </Link>
              </li>
              <li>
                <Link to="/account/wishlist" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-medium text-sm tracking-wide uppercase text-muted-foreground mb-4">
              Information
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-foreground/80 hover:text-foreground transition-apple">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="pt-8 border-t border-border mt-8 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} Artifi. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <Link to="/privacy-policy" className="hover:text-foreground transition-apple">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-apple">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-foreground transition-apple">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
