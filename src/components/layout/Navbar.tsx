
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const { totalItems, toggleCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the search here
    console.log("Search for:", searchQuery);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-apple py-4 px-6 md:px-10",
        isScrolled 
          ? "bg-white/80 backdrop-blur border-b border-border shadow-subtle" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-medium tracking-tighter inline-block transition-apple hover:opacity-80"
        >
          artifi
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/explore" 
            className="text-sm font-medium text-foreground/80 transition-apple hover:text-foreground"
          >
            Explore
          </Link>
          <Link 
            to="/collections" 
            className="text-sm font-medium text-foreground/80 transition-apple hover:text-foreground"
          >
            Collections
          </Link>
          <Link 
            to="/artists" 
            className="text-sm font-medium text-foreground/80 transition-apple hover:text-foreground"
          >
            Artists
          </Link>
          <Link 
            to="/blog" 
            className="text-sm font-medium text-foreground/80 transition-apple hover:text-foreground"
          >
            Blog
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="relative text-foreground/70 hover:text-foreground transition-apple"
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative text-foreground/70 hover:text-foreground transition-apple"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </button>

          {/* Account */}
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className="relative text-foreground/70 hover:text-foreground transition-apple"
            aria-label="Account"
          >
            <User size={20} />
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-foreground/70 hover:text-foreground transition-apple"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background animate-fade-in">
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
              <Link to="/" className="text-2xl font-medium tracking-tighter">
                artifi
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col space-y-6 mt-12 text-lg">
              <Link
                to="/explore"
                className="py-2 border-b border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                to="/collections"
                className="py-2 border-b border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                Collections
              </Link>
              <Link
                to="/artists"
                className="py-2 border-b border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                Artists
              </Link>
              <Link
                to="/blog"
                className="py-2 border-b border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to={isAuthenticated ? "/account" : "/login"}
                className="py-2 border-b border-border"
                onClick={() => setMobileMenuOpen(false)}
              >
                {isAuthenticated ? "My Account" : "Sign In"}
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur animate-fade-in">
          <div className="p-6 max-w-3xl mx-auto mt-20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-medium">Search</h2>
              <button
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for artwork, collections, or artists..."
                  className="w-full py-4 px-5 pr-12 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-apple"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-apple"
                  aria-label="Submit search"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
