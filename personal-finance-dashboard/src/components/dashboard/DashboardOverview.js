'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency, formatPercentage, getCurrentMonthTransactions } from '../../lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, className = '' }) => (
  <Card className={`card-hover ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-gray-400" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {value}
      </div>
      {trend && (
        <p className={`text-xs flex items-center mt-1 ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 mr-1" />
          )}
          {trendValue}
        </p>
      )}
    </CardContent>
  </Card>
);

const RecentTransactionItem = ({ transaction }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {transaction.description}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
      </p>
    </div>
    <div className={`text-sm font-semibold ${
      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
    }`}>
      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
    </div>
  </div>
);

export default function DashboardOverview({ transactions = [], summaryStats = {} }) {
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Get the 5 most recent transactions
    const recent = [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentTransactions(recent);
  }, [transactions]);

  const {
    totalBalance = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    savingsRate = 0
  } = summaryStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Here's your financial overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          icon={Wallet}
          trend={totalBalance >= 0 ? 'up' : 'down'}
          trendValue={totalBalance >= 0 ? 'Positive balance' : 'Negative balance'}
          className={totalBalance >= 0 ? 'border-green-200' : 'border-red-200'}
        />
        <StatCard
          title="Monthly Income"
          value={formatCurrency(monthlyIncome)}
          icon={TrendingUp}
          trend="up"
          trendValue="This month"
          className="border-green-200"
        />
        <StatCard
          title="Monthly Expenses"
          value={formatCurrency(monthlyExpenses)}
          icon={TrendingDown}
          trend="down"
          trendValue="This month"
          className="border-red-200"
        />
        <StatCard
          title="Savings Rate"
          value={formatPercentage(savingsRate)}
          icon={DollarSign}
          trend={savingsRate > 20 ? 'up' : 'down'}
          trendValue={savingsRate > 20 ? 'Great job!' : 'Room to improve'}
          className={savingsRate > 20 ? 'border-green-200' : 'border-yellow-200'}
        />
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-0">
              {recentTransactions.map((transaction) => (
                <RecentTransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No transactions yet. Add your first transaction to get started!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
