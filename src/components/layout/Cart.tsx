
import React from "react";
import { ShoppingCart, X, Minus, Plus, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const { 
    isCartOpen, 
    toggleCart, 
    cart, 
    removeFromCart, 
    updateQuantity,
    totalItems,
    totalPrice 
  } = useCart();

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={toggleCart}
        />
      )}
      
      {/* Cart Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background z-50 shadow-strong border-l border-border transform transition-transform duration-350 ease-apple-ease",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <ShoppingCart size={20} />
            <h2 className="text-lg font-medium">Your Cart ({totalItems})</h2>
          </div>
          <button 
            onClick={toggleCart}
            className="text-foreground/70 hover:text-foreground transition-apple"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Cart Content */}
        <div className="h-[calc(100%-170px)] overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart size={48} className="text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Add some artwork to your cart and it will appear here.
              </p>
              <button
                onClick={toggleCart}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-apple hover:bg-primary/90"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-border">
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-apple"
                        aria-label={`Remove ${item.title} from cart`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">By {item.artistName}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-secondary transition-apple"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-secondary transition-apple"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Cart Footer */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              onClick={toggleCart}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-apple hover:bg-primary/90"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
