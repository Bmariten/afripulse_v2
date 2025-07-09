import api from './api';

export interface FlaggedItem {
  id: string;
  itemType: string;
  name: string;
  reason: string;
  reportedBy: string;
  reportDate: string;
  status: string;
  ip_address?: string;
  user_agent?: string;
  resolution_notes?: string;
  reviewed_by?: string;
  updated_at?: string;
}

export const fetchFlaggedItems = async (): Promise<FlaggedItem[]> => {
  try {
    const response = await api.get('/admin/flagged-items');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching flagged items:', error);
    throw error;
  }
};

export const updateFlaggedItemStatus = async (id: string, status: string, resolution_notes?: string): Promise<FlaggedItem> => {
  try {
    const response = await api.put(`/admin/flagged-items/${id}`, { status, resolution_notes });
    return response.data;
  } catch (error) {
    console.error('Error updating flagged item status:', error);
    throw error;
  }
};

export interface SellerInfo {
  id: string; // This is the seller_profile_id
  name: string;
}

export const fetchAllSellers = async (): Promise<SellerInfo[]> => {
  try {
    const response = await api.get('/admin/sellers');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
};

export interface AffiliateInfo {
  id: string;
  user_id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  clicks: number;
  sales: number;
  commissions: number;
}

export const fetchAllAffiliates = async (): Promise<AffiliateInfo[]> => {
  try {
    const response = await api.get('/admin/affiliates');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    throw error;
  }
};
