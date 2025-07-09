import api from '@/services/api'; // Use the centralized api instance

// This interface should match the backend's AffiliateLink model
export interface AffiliateLink {
  id: string;
  affiliate_id: string;
  product_id: string;
  code?: string; // Backend might use code instead of tracking_code
  tracking_code?: string;
  clicks: number;
  conversions: number;
  created_at: string;
  updated_at: string;
  product_name?: string; // Added from backend response
  product_image?: string; // Added from backend response
  full_url?: string; // Added from backend response
}

/**
 * Generates a new affiliate link for a given product.
 * @param productId The ID of the product to generate a link for.
 * @returns The newly created affiliate link data.
 */
export const generateAffiliateLink = async (productId: string): Promise<AffiliateLink> => {
  try {
    // The base URL and auth headers are now handled by the api instance
    const response = await api.post('/affiliate/links', { product_id: productId });
    
    // The backend returns { message: '...', link: {...} }
    return response.data.link;
  } catch (error: any) {
    if (error.response) {
      // Re-throw the error with a more specific message if available
      throw new Error(error.response.data.message || 'Failed to generate affiliate link.');
    }
    throw new Error('An unexpected error occurred while generating the link.');
  }
};

/**
 * Gets all affiliate links for the current user.
 * @returns Array of affiliate links with product details.
 */
export const getAffiliateLinks = async (): Promise<AffiliateLink[]> => {
  try {
    const response = await api.get('/affiliate/links');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch affiliate links.');
    }
    throw new Error('An unexpected error occurred while fetching affiliate links.');
  }
};

/**
 * Gets performance data for the affiliate's links.
 * @returns Performance data for all affiliate links.
 */
export const getLinkPerformance = async (): Promise<AffiliateLink[]> => {
  try {
    const response = await api.get('/affiliate/link-performance');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch link performance data.');
    }
    throw new Error('An unexpected error occurred while fetching link performance data.');
  }
};

