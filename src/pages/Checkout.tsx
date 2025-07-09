
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Order placed successfully!",
      description: "Your order has been confirmed.",
    });
    
    dispatch({ type: 'CLEAR_CART' });
    navigate('/order-confirmation');
    setLoading(false);
  };

  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" required />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" required />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h2 className="text-lg font-semibold">Payment</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" required placeholder="**** **** **** ****" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expMonth">Expiration Month</Label>
                    <Input id="expMonth" required placeholder="MM" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expYear">Expiration Year</Label>
                    <Input id="expYear" required placeholder="YYYY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" required placeholder="***" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">${(state.total + state.total * 0.1).toFixed(2)}</span>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Processing..." : "Place Order"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
