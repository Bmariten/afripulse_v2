
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Activity {
  id: string;
  product: string;
  amount: number;
  affiliate?: string;
  date: Date;
}

interface RecentActivityTableProps {
  activities: Activity[];
}

const RecentActivityTable = ({ activities }: RecentActivityTableProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Affiliate ID</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length > 0 ? (
            activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.product}</TableCell>
                <TableCell>${activity.amount.toFixed(2)}</TableCell>
                <TableCell>{activity.affiliate || 'Direct Sale'}</TableCell>
                <TableCell>{formatDate(activity.date)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No recent activity
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentActivityTable;
