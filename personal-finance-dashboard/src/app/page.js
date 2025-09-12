'use client';

import { useTransactions } from '../hooks/useData';
import DashboardOverview from '../components/dashboard/DashboardOverview';

export default function Home() {
  const { transactions, getSummaryStats, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 ">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const summaryStats = getSummaryStats();

  return (
    <DashboardOverview 
      transactions={transactions} 
      summaryStats={summaryStats}
    />
  );
}
