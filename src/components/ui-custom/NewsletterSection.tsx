
import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-20 px-6 md:px-10 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Stay in the loop</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Subscribe to our newsletter for exclusive updates on new artwork, artist features, and special offers.
          </p>
          
          {isSubmitted ? (
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur animate-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                <Check size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Thank you for subscribing!</h3>
              <p className="text-primary-foreground/80">
                You'll receive our next newsletter in your inbox.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-grow bg-white/10 backdrop-blur text-primary-foreground placeholder:text-primary-foreground/60 px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 transition-apple"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-primary px-6 py-3 rounded-full font-medium transition-all duration-350 ease-apple-ease hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Subscribing...</span>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-primary-foreground/60 mt-3">
                We respect your privacy and will never share your information.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
