
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/skeleton';

const Cart = () => {
  const { state, removeItem, updateQuantity } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (id: string, quantity: number) => {
    if (quantity >= 1) {
      setIsUpdating(true);
      await updateQuantity(id, quantity);
      setTimeout(() => setIsUpdating(false), 500);
    }
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
  };

  const tax = state.total * 0.1; // 10% tax
  const finalTotal = state.total + tax;

  // Show loading state
  if (state.isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center py-4 border-b last:border-0">
                    <Skeleton className="w-20 h-20 rounded" />
                    <div className="flex-grow ml-4">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (state.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Link to="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center p-4 border-b last:border-0">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-grow ml-4">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                      disabled={isUpdating || item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                      disabled={isUpdating}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="ml-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/checkout" className="block mt-4">
                  <Button className="w-full">Proceed to Checkout</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Cart;
