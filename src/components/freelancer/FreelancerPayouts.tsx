import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { payoutStorage, earningsStorage } from '@/lib/storage';
import type { FreelancerProfile, FreelancerPayout } from '@/lib/storage';
import { formatCurrency, canRequestPayout, getStatusColor } from '@/lib/freelancerUtils';
import { toast } from 'sonner';

interface FreelancerPayoutsProps {
  freelancerId: string;
  profile: FreelancerProfile;
}

export default function FreelancerPayouts({ freelancerId, profile }: FreelancerPayoutsProps) {
  const [payouts, setPayouts] = useState(payoutStorage.getByFreelancerId(freelancerId));
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'bank_transfer' | 'stripe'>('paypal');

  const availableBalance = earningsStorage.getAvailableBalance(freelancerId);
  const canPayout = canRequestPayout(availableBalance);

  const handleRequestPayout = () => {
    const payoutAmount = parseFloat(amount);
    
    if (!payoutAmount || payoutAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (payoutAmount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (payoutAmount < 50) {
      toast.error('Minimum payout is $50');
      return;
    }

    const newPayout: FreelancerPayout = {
      id: `payout-${Date.now()}`,
      freelancerId,
      amount: payoutAmount,
      paymentMethod,
      paymentDetails: {},
      status: 'requested',
      requestedAt: new Date().toISOString(),
    };

    payoutStorage.save(newPayout);
    setPayouts([newPayout, ...payouts]);
    setIsDialogOpen(false);
    setAmount('');
    toast.success('Payout request submitted!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payouts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!canPayout}>
              <CreditCard className="w-4 h-4 mr-2" />
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Payout</DialogTitle>
              <DialogDescription>
                Request a payout from your available balance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="50"
                  step="0.01"
                  placeholder="50.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available: {formatCurrency(availableBalance)} (Min: $50)
                </p>
              </div>

              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestPayout}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Card */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Available Balance</p>
            <p className="text-4xl font-bold">{formatCurrency(availableBalance)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {canPayout ? 'Ready to withdraw' : 'Minimum $50 required'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/20">
            <DollarSign className="w-12 h-12 text-primary" />
          </div>
        </div>
      </Card>

      {!canPayout && (
        <Card className="p-4 bg-yellow-500/5 border-yellow-500/20">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="font-medium">Minimum Payout Threshold</p>
              <p className="text-sm text-muted-foreground">
                You need at least $50 to request a payout. Keep uploading templates!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Payout History */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Payout History</h2>
        {payouts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No payout requests yet</p>
            <p className="text-sm">Request your first payout when you reach $50</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Processed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    {new Date(payout.requestedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payout.amount)}
                  </TableCell>
                  <TableCell className="capitalize">
                    {payout.paymentMethod.replace('_', ' ')}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payout.processedAt 
                      ? new Date(payout.processedAt).toLocaleDateString()
                      : '-'}
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
