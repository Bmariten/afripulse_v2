
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          role: 'admin' | 'seller' | 'affiliate' | 'customer' | 'guest' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          role?: 'admin' | 'seller' | 'affiliate' | 'customer' | 'guest' | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          role?: 'admin' | 'seller' | 'affiliate' | 'customer' | 'guest' | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      seller_profiles: {
        Row: {
          id: string;
          business_name: string | null;
          description: string | null;
          paypal_email: string | null;
          bank_account: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          business_name?: string | null;
          description?: string | null;
          paypal_email?: string | null;
          bank_account?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string | null;
          description?: string | null;
          paypal_email?: string | null;
          bank_account?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      affiliate_profiles: {
        Row: {
          id: string;
          website: string | null;
          social_media: string | null;
          paypal_email: string | null;
          bank_account: string | null;
          commission_rate: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          website?: string | null;
          social_media?: string | null;
          paypal_email?: string | null;
          bank_account?: string | null;
          commission_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          website?: string | null;
          social_media?: string | null;
          paypal_email?: string | null;
          bank_account?: string | null;
          commission_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          seller_id: string;
          name: string;
          description: string | null;
          long_description: string | null;
          price: number;
          discount_price: number | null;
          category: string | null;
          inventory_count: number;
          featured: boolean;
          status: 'active' | 'inactive' | 'flagged';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          name: string;
          description?: string | null;
          long_description?: string | null;
          price: number;
          discount_price?: number | null;
          category?: string | null;
          inventory_count?: number;
          featured?: boolean;
          status?: 'active' | 'inactive' | 'flagged';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          name?: string;
          description?: string | null;
          long_description?: string | null;
          price?: number;
          discount_price?: number | null;
          category?: string | null;
          inventory_count?: number;
          featured?: boolean;
          status?: 'active' | 'inactive' | 'flagged';
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          is_primary: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      affiliate_links: {
        Row: {
          id: string;
          affiliate_id: string;
          product_id: string;
          link_code: string;
          created_at: string;
          clicks: number;
        };
        Insert: {
          id?: string;
          affiliate_id: string;
          product_id: string;
          link_code: string;
          created_at?: string;
          clicks?: number;
        };
        Update: {
          id?: string;
          affiliate_id?: string;
          product_id?: string;
          link_code?: string;
          created_at?: string;
          clicks?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string | null;
          total_amount: number;
          status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          shipping_address: any | null;
          billing_address: any | null;
          payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id?: string | null;
          total_amount: number;
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          shipping_address?: any | null;
          billing_address?: any | null;
          payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          total_amount?: number;
          status?: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
          shipping_address?: any | null;
          billing_address?: any | null;
          payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          price_per_unit: number;
          affiliate_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          price_per_unit: number;
          affiliate_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          price_per_unit?: number;
          affiliate_id?: string | null;
          created_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          customer_id: string;
          product_id: string;
          quantity: number;
          affiliate_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          product_id: string;
          quantity?: number;
          affiliate_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          product_id?: string;
          quantity?: number;
          affiliate_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
