import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

// This would typically be a more specific type
interface FlaggedItem {
  id: string;
  itemType: string;
  name: string;
  reason: string;
  reportedBy: string;
  reportDate: string;
  status: string;
  details?: any; // For additional context
}

const AdminFlaggedDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<FlaggedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/flagged/${id}`);
        setItem(response.data);
      } catch (err) {
        setError('Failed to load item details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  if (loading) {
    return <MainLayout showSidebar userRole="admin" pageTitle="Loading..."><p>Loading...</p></MainLayout>;
  }

  if (error) {
    return <MainLayout showSidebar userRole="admin" pageTitle="Error"><p>{error}</p></MainLayout>;
  }

  if (!item) {
    return <MainLayout showSidebar userRole="admin" pageTitle="Not Found"><p>Item not found.</p></MainLayout>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'dismissed':
        return <Badge className="bg-gray-500">Dismissed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout showSidebar userRole="admin" pageTitle={`Flagged Item: ${item.name}`}>
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>Details for flagged item ID: {item.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Report Details</h3>
              {getStatusBadge(item.status)}
            </div>
            <p><strong>Item Type:</strong> {item.itemType}</p>
            <p><strong>Reason for Flag:</strong> {item.reason}</p>
            <p><strong>Reported By:</strong> {item.reportedBy}</p>
            <p><strong>Date Reported:</strong> {new Date(item.reportDate).toLocaleDateString()}</p>
            
            {/* Add more item-specific details here */}

            <div className="flex space-x-2 mt-4">
              <Button>Resolve</Button>
              <Button variant="outline">Dismiss</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AdminFlaggedDetails;
