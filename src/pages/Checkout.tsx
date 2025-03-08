
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft, ArrowRight, CreditCard, Truck, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ShippingForm from "@/components/checkout/ShippingForm";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";

type CheckoutStep = "shipping" | "payment" | "confirmation";

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: ""
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardHolder: "",
    expDate: "",
    cvv: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // If cart is empty, redirect to explore
  React.useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      navigate("/explore");
    }
  }, [cart, navigate, orderComplete]);

  const handleShippingSubmit = (data: typeof shippingInfo) => {
    setShippingInfo(data);
    setCurrentStep("payment");
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (data: typeof paymentInfo) => {
    setPaymentInfo(data);
    processOrder();
  };

  const processOrder = () => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      // Generate random order ID
      const newOrderId = `ORD-${Math.floor(Math.random() * 10000)}`;
      setOrderId(newOrderId);
      setOrderComplete(true);
      setCurrentStep("confirmation");
      clearCart();
      setIsProcessing(false);
      window.scrollTo(0, 0);
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${newOrderId} has been confirmed.`
      });
    }, 1500);
  };

  const renderStepIndicator = () => (
    <div className="relative flex justify-between w-full max-w-2xl mx-auto py-8">
      <div className="absolute top-10 left-0 right-0 h-0.5 bg-secondary">
        <div 
          className="h-full bg-primary transition-all duration-500"
          style={{ 
            width: currentStep === "shipping" ? "0%" : 
                  currentStep === "payment" ? "50%" : "100%" 
          }}
        />
      </div>
      
      <div className="flex flex-col items-center z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
          currentStep === "shipping" ? "bg-primary text-primary-foreground" : 
          currentStep === "payment" || currentStep === "confirmation" ? "bg-primary/90 text-primary-foreground" : 
          "bg-secondary text-foreground"
        }`}>
          {currentStep === "shipping" ? "1" : <Check size={18} />}
        </div>
        <div className="mt-2 text-sm font-medium">Shipping</div>
      </div>
      
      <div className="flex flex-col items-center z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
          currentStep === "payment" ? "bg-primary text-primary-foreground" : 
          currentStep === "confirmation" ? "bg-primary/90 text-primary-foreground" : 
          "bg-secondary text-foreground"
        }`}>
          {currentStep === "payment" || currentStep === "shipping" ? "2" : <Check size={18} />}
        </div>
        <div className="mt-2 text-sm font-medium">Payment</div>
      </div>
      
      <div className="flex flex-col items-center z-10">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
          currentStep === "confirmation" ? "bg-primary text-primary-foreground" : 
          "bg-secondary text-foreground"
        }`}>
          {currentStep === "confirmation" ? <Check size={18} /> : "3"}
        </div>
        <div className="mt-2 text-sm font-medium">Confirmation</div>
      </div>
    </div>
  );

  const renderOrderConfirmation = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-primary" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Thank you for your order!</h2>
      <p className="text-muted-foreground mb-8">Order #{orderId}</p>
      
      <div className="max-w-md mx-auto bg-secondary/30 rounded-lg p-6 mb-8">
        <p className="mb-4">We've sent a confirmation email to <span className="font-medium">{shippingInfo.email}</span></p>
        <p>Your artwork will be shipped to:</p>
        <div className="mt-2 text-foreground">
          <div>{shippingInfo.fullName}</div>
          <div>{shippingInfo.address}</div>
          <div>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</div>
          <div>{shippingInfo.country}</div>
        </div>
      </div>
      
      <Button 
        onClick={() => navigate("/explore")}
        className="mx-auto"
      >
        Continue Shopping
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="container max-w-6xl px-4 py-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => {
              if (currentStep === "payment") {
                setCurrentStep("shipping");
              } else if (!orderComplete) {
                navigate(-1);
              }
            }}
            disabled={isProcessing}
          >
            <ArrowLeft size={16} className="mr-2" />
            {currentStep === "payment" ? "Back to Shipping" : "Back"}
          </Button>
          
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>
        
        {!orderComplete && renderStepIndicator()}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === "shipping" && (
              <ShippingForm 
                initialValues={shippingInfo}
                onSubmit={handleShippingSubmit}
              />
            )}
            
            {currentStep === "payment" && (
              <PaymentForm 
                isProcessing={isProcessing}
                onSubmit={handlePaymentSubmit}
              />
            )}
            
            {currentStep === "confirmation" && renderOrderConfirmation()}
          </div>
          
          {!orderComplete && (
            <div>
              <OrderSummary />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
