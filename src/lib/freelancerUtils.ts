import { FreelancerReview, FreelancerEarning } from './storage';

export const calculateAverageRating = (reviews: FreelancerReview[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const canRequestPayout = (balance: number, minimum: number = 50): boolean => {
  return balance >= minimum;
};

export const getEarningsForPeriod = (
  earnings: FreelancerEarning[],
  days: number
): FreelancerEarning[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return earnings.filter(e => new Date(e.createdAt) >= cutoffDate);
};

export const calculateEarningsByMonth = (earnings: FreelancerEarning[]): Record<string, number> => {
  const monthlyEarnings: Record<string, number> = {};
  
  earnings
    .filter(e => e.status === 'completed' && e.transactionType !== 'withdrawal')
    .forEach(earning => {
      const date = new Date(earning.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyEarnings[monthKey]) {
        monthlyEarnings[monthKey] = 0;
      }
      monthlyEarnings[monthKey] += earning.amount;
    });
  
  return monthlyEarnings;
};

export const validateTemplateZip = async (file: File): Promise<{ valid: boolean; error?: string }> => {
  // Basic validation
  if (file.size > 50 * 1024 * 1024) { // 50MB limit
    return { valid: false, error: 'File size must be less than 50MB' };
  }
  
  if (!file.name.endsWith('.zip')) {
    return { valid: false, error: 'File must be a ZIP archive' };
  }
  
  return { valid: true };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    draft: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    submitted: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    under_review: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    approved: 'bg-green-500/10 text-green-500 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    published: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    requested: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    processing: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    failed: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  
  return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
};
