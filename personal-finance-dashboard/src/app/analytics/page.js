'use client';

import { useTransactions, useSavingsGoals } from '../../hooks/useData';
import { 
  ExpenseBreakdownChart, 
  MonthlyTrendChart, 
  CategorySpendingChart, 
  SavingsProgressChart 
} from '../../components/analytics/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Target,
  Calendar
} from 'lucide-react';
import { 
  formatCurrency, 
  formatPercentage, 
  getCurrentMonthTransactions,
  calculateTotalIncome,
  calculateTotalExpenses
} from '../../lib/utils';

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, className = '' }) => (
  <Card className={`${className}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <Icon className="h-8 w-8 text-gray-400" />
          {trend && (
            <p className={`text-xs mt-1 ${
              trend.type === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.type === 'positive' ? '↗' : '↘'} {trend.value}
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function AnalyticsPage() {
  const { transactions, getSummaryStats, isLoading: transactionsLoading } = useTransactions();
  const { savingsGoals, isLoading: savingsLoading } = useSavingsGoals();

  if (transactionsLoading || savingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const summaryStats = getSummaryStats();
  const currentMonthTransactions = getCurrentMonthTransactions(transactions);
  const monthlyIncome = calculateTotalIncome(currentMonthTransactions);
  const monthlyExpenses = calculateTotalExpenses(currentMonthTransactions);

  // Calculate previous month for comparison
  const previousMonth = new Date();
  previousMonth.setMonth(previousMonth.getMonth() - 1);
  const previousMonthStart = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1);
  const previousMonthEnd = new Date(previousMonth.getFullYear(), previousMonth.getMonth() + 1, 0);
  
  const previousMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= previousMonthStart && date <= previousMonthEnd;
  });
  
  const previousMonthIncome = calculateTotalIncome(previousMonthTransactions);
  const previousMonthExpenses = calculateTotalExpenses(previousMonthTransactions);

  // Calculate trends
  const incomeTrend = previousMonthIncome > 0 
    ? ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100 
    : 0;
  const expenseTrend = previousMonthExpenses > 0 
    ? ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 
    : 0;

  const totalCategories = [...new Set(currentMonthTransactions.map(t => t.category))].length;
  const avgTransactionAmount = currentMonthTransactions.length > 0 
    ? currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0) / currentMonthTransactions.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Analytics
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Detailed insights into your financial data
        </p>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Monthly Income"
          value={formatCurrency(monthlyIncome)}
          subtitle="This month"
          icon={TrendingUp}
          trend={{
            type: incomeTrend >= 0 ? 'positive' : 'negative',
            value: formatPercentage(Math.abs(incomeTrend), 1)
          }}
          className="border-green-200"
        />
        
        <StatsCard
          title="Monthly Expenses"
          value={formatCurrency(monthlyExpenses)}
          subtitle="This month"
          icon={TrendingDown}
          trend={{
            type: expenseTrend <= 0 ? 'positive' : 'negative',
            value: formatPercentage(Math.abs(expenseTrend), 1)
          }}
          className="border-red-200"
        />
        
        <StatsCard
          title="Categories Used"
          value={totalCategories}
          subtitle="Different categories"
          icon={BarChart3}
          className="border-blue-200"
        />
        
        <StatsCard
          title="Avg Transaction"
          value={formatCurrency(avgTransactionAmount)}
          subtitle="Average amount"
          icon={Calendar}
          className="border-purple-200"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="lg:col-span-2">
          <MonthlyTrendChart transactions={transactions} />
        </div>

        {/* Expense Breakdown */}
        <ExpenseBreakdownChart transactions={transactions} />

        {/* Category Spending */}
        <CategorySpendingChart transactions={transactions} />

        {/* Savings Progress */}
        {savingsGoals.length > 0 && (
          <div className="lg:col-span-2">
            <SavingsProgressChart savingsGoals={savingsGoals} />
          </div>
        )}
      </div>

      {/* Financial Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Financial Health Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className={`text-3xl font-bold mb-2 ${
                summaryStats.savingsRate > 20 ? 'text-green-600' : 
                summaryStats.savingsRate > 10 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {formatPercentage(summaryStats.savingsRate)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Savings Rate
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {summaryStats.savingsRate > 20 ? 'Excellent!' : 
                 summaryStats.savingsRate > 10 ? 'Good' : 'Needs Improvement'}
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className={`text-3xl font-bold mb-2 ${
                summaryStats.monthlyBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(summaryStats.monthlyBalance)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Monthly Balance
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {summaryStats.monthlyBalance >= 0 ? 'Positive' : 'Deficit'}
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold mb-2 text-blue-600">
                {summaryStats.monthlyTransactions}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Transactions
              </div>
              <div className="text-xs text-gray-500 mt-1">
                This month
              </div>
            </div>
          </div>

          {/* Financial Tips */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Financial Insights
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              {summaryStats.savingsRate < 10 && (
                <li>• Consider increasing your savings rate to at least 10% of your income</li>
              )}
              {summaryStats.monthlyBalance < 0 && (
                <li>• You're spending more than you earn this month - review your expenses</li>
              )}
              {totalCategories > 8 && (
                <li>• You're using many spending categories - consider consolidating for better tracking</li>
              )}
              {summaryStats.savingsRate > 20 && (
                <li>• Great job! You're saving over 20% of your income</li>
              )}
              {currentMonthTransactions.length < 5 && (
                <li>• Add more transactions to get better insights into your spending patterns</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
