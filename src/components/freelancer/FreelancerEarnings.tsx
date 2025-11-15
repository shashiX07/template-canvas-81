import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { earningsStorage } from '@/lib/storage';
import { formatCurrency, getStatusColor } from '@/lib/freelancerUtils';

interface FreelancerEarningsProps {
  freelancerId: string;
}

export default function FreelancerEarnings({ freelancerId }: FreelancerEarningsProps) {
  const earnings = earningsStorage.getByFreelancerId(freelancerId);
  const totalEarnings = earningsStorage.getTotalEarnings(freelancerId);
  const availableBalance = earningsStorage.getAvailableBalance(freelancerId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Earnings</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold mt-2">{formatCurrency(totalEarnings)}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold mt-2">{formatCurrency(availableBalance)}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-2">
                {formatCurrency(earnings.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0))}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <TrendingDown className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {earnings.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No earnings yet</p>
            <p className="text-sm">Start earning by uploading templates</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell>
                    {new Date(earning.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{earning.description}</TableCell>
                  <TableCell className="capitalize">{earning.transactionType}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(earning.status)}>
                      {earning.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(earning.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
