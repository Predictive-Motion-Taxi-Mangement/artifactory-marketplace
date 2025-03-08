
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { CreditCard, Lock } from "lucide-react";

const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, "Card number must be at least 16 digits")
    .max(19, "Card number cannot exceed 19 characters"),
  cardHolder: z.string().min(3, "Cardholder name is required"),
  expDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Date must be in MM/YY format"),
  cvv: z.string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV cannot exceed 4 digits")
});

type PaymentData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  isProcessing: boolean;
  onSubmit: (data: PaymentData) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ isProcessing, onSubmit }) => {
  const form = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expDate: "",
      cvv: ""
    }
  });

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Format with spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const formatExpDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Add slash after month
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    
    return digits;
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="text-primary" size={20} />
        <h2 className="text-xl font-semibold">Payment Information</h2>
      </div>
      
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground bg-secondary/40 p-3 rounded-md">
        <Lock size={16} />
        <span>All payment information is securely encrypted and processed</span>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Card Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="1234 5678 9012 3456" 
                    {...field} 
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                    maxLength={19}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cardHolder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cardholder Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="expDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="MM/YY" 
                      {...field} 
                      onChange={(e) => {
                        const formatted = formatExpDate(e.target.value);
                        field.onChange(formatted);
                      }}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cvv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CVV</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123" 
                      type="password" 
                      {...field} 
                      maxLength={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-between pt-6">
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Lock size={14} />
                <span>Secure checkout</span>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full sm:w-auto"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PaymentForm;
