import { createContext, useContext, useReducer, ReactNode, useEffect, Dispatch } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  product_id: string;
  affiliate_id?: string | null;
}

interface CartState {
  items: CartItem[];
  total: number;
  isLoading: boolean;
}

// Expose CartAction type for components that need to dispatch directly
export type CartAction =
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  dispatch: Dispatch<CartAction>; // Add the dispatch function to the context
} | undefined>(undefined);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload)
      };
    
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.product_id === action.payload.product_id);
      
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + action.payload.quantity
        };
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems)
        };
      }
      
      const newItems = [...state.items, action.payload];
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product_id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item => {
        if (item.product_id === action.payload.id) {
          return { ...item, quantity: action.payload.quantity };
        }
        return item;
      });
      
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems)
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
      
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0,
    isLoading: true
  });
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch cart when user changes
  useEffect(() => {
    // Check if user exists AND is authenticated (has a token)
    const isAuthenticated = user && localStorage.getItem('token');
    
    if (isAuthenticated) {
      fetchCart();
    } else {
      // If no authenticated user, clear cart and load from localStorage
      dispatch({ type: 'SET_LOADING', payload: true });
      const savedCart = localStorage.getItem('afripulse_cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART', payload: parsedCart });
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  // Save cart to localStorage when it changes (for guest users)
  useEffect(() => {
    if (!user && !state.isLoading) {
      localStorage.setItem('afripulse_cart', JSON.stringify(state.items));
    }
  }, [state.items, user, state.isLoading]);

  const fetchCart = async () => {
    // Check if user exists AND is authenticated (has a token)
    const isAuthenticated = user && localStorage.getItem('token');
    if (!isAuthenticated) {
      // Don't attempt API call for non-authenticated users
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Use the main cart endpoint which is a GET endpoint
      const response = await api.get('/cart/');
      console.log('Cart response:', response);
      const cartItems = response.data?.items || [];
      
      // Transform data to match our CartItem structure
      const formattedItems: CartItem[] = cartItems.map(item => {
        const product = item.product as any; // The property is 'product', not 'products'
        const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url || 
                           product.product_images?.[0]?.image_url;
        
        return {
          id: item.id,
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: primaryImage,
          affiliate_id: item.affiliate_id
        };
      });

      dispatch({ type: 'SET_CART', payload: formattedItems });
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Error',
        description: 'Could not load your cart. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Add item to cart
  const addItem = async (item: Omit<CartItem, 'id'>) => {
    try {
      if (user) {
        // First check if the item is already in the cart
        const response = await api.get(`/cart/items`, { params: { productId: item.product_id } });
        const existingItems = response.data;
        
        if (existingItems && existingItems.length > 0) {
          // Update quantity of existing item
          const existingItem = existingItems[0];
          const newQuantity = existingItem.quantity + item.quantity;
          
          await api.put(`/cart/items/${existingItem.id}`, { quantity: newQuantity });
        } else {
          // Add new item to cart
          await api.post(`/cart/items`, { product_id: item.product_id, quantity: item.quantity, affiliate_id: item.affiliate_id });
        }
        
        // Refresh cart
        fetchCart();
      } else {
        // Handle guest user cart
        const newItem: CartItem = {
          ...item,
          id: Date.now().toString()
        };
        dispatch({ type: 'ADD_ITEM', payload: newItem });
      }

      toast({
        title: 'Added to cart',
        description: `${item.name} added to your cart.`
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: 'Error',
        description: 'Could not add item to cart. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Remove item from cart
  const removeItem = async (productId: string) => {
    try {
      if (user) {
        try {
          await api.delete(`/cart/items`, {
            data: { customerId: user.id, productId },
            withCredentials: true
          });
          fetchCart();
        } catch (error) {
          throw error;
        }
      } else {
        dispatch({ type: 'REMOVE_ITEM', payload: productId });
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: 'Error',
        description: 'Could not remove item from cart. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Update item quantity
  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity < 1) return;
      
      if (user) {
        try {
          await api.put(`/cart/items/quantity`, {
            customerId: user.id,
            productId,
            quantity
          }, { withCredentials: true });
          fetchCart();
        } catch (error) {
          throw error;
        }
      } else {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast({
        title: 'Error',
        description: 'Could not update item quantity. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      if (user) {
        try {
          await api.delete(`/cart/items/all`, {
            data: { customerId: user.id },
            withCredentials: true
          });
          fetchCart();
        } catch (error) {
          throw error;
        }
      } else {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Could not clear your cart. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <CartContext.Provider value={{ 
      state, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart,
      dispatch // Expose the dispatch function to consumers
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
