
import React, { useState } from "react";
import { CreditCard, Truck, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Separator } from "@/components/ui/separator";

const OrderSummary: React.FC = () => {
  const { cart, totalPrice } = useCart();
  const [isDetailOpen, setIsDetailOpen] = useState(true);
  
  const shipping = 9.99;
  const tax = totalPrice * 0.08; // 8% tax rate
  const orderTotal = totalPrice + shipping + tax;

  const toggleDetail = () => {
    setIsDetailOpen(!isDetailOpen);
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border sticky top-8">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="mb-6">
        <button
          onClick={toggleDetail}
          className="flex items-center justify-between w-full mb-3"
        >
          <span className="font-medium">
            {cart.length} {cart.length === 1 ? "item" : "items"}
          </span>
          {isDetailOpen ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>
        
        {isDetailOpen && (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-16 h-16 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium line-clamp-1">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    By {item.artistName}
                  </div>
                  <div className="flex justify-between mt-1 text-sm">
                    <span>Qty: {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span className="text-xl">${orderTotal.toFixed(2)}</span>
      </div>
      
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Truck size={16} />
          <span>Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          <span>Delivery in 3-5 business days</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CreditCard size={16} />
          <span>Secure payment processing</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
