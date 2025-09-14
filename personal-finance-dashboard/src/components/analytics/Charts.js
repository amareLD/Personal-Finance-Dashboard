'use client';

import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  calculateCategoryTotals, 
  getCurrentMonthTransactions, 
  formatCurrency 
} from '../../lib/utils';
import { CHART_COLORS } from '../../lib/constants';
import { format, subMonths, startOfMonth } from 'date-fns';

// Custom Tooltip for Currency
const CurrencyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
        {label && <p className="font-medium mb-2">{label}</p>}
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Expense Breakdown Pie Chart
export const ExpenseBreakdownChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);
    const expenseTransactions = currentMonthTransactions.filter(t => t.type === 'expense');
    const categoryTotals = calculateCategoryTotals(expenseTransactions);
    
    return categoryTotals
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8) // Top 8 categories
      .map((item, index) => ({
        category: item.category,
        amount: item.amount,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No expense data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown (This Month)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="amount"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CurrencyTooltip />} />
              <Legend 
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {entry.payload.category}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Monthly Trend Line Chart
export const MonthlyTrendChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: format(monthStart, 'MMM yyyy'),
        income,
        expenses,
        balance: income - expenses
      });
    }
    
    return months;
  }, [transactions]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Category Spending Bar Chart
export const CategorySpendingChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);
    const expenseTransactions = currentMonthTransactions.filter(t => t.type === 'expense');
    const categoryTotals = calculateCategoryTotals(expenseTransactions);
    
    return categoryTotals
      .filter(item => item.amount > 0) // Only show categories with actual spending
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4) // Top 4 categories only
      .map((item, index) => ({
        category: item.category.length > 12 ? item.category.substring(0, 12) + '...' : item.category,
        amount: item.amount,
        fullCategory: item.category,
        color: CHART_COLORS[index % CHART_COLORS.length]
      }));
  }, [transactions]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No spending data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 4 Spending Categories (This Month)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                        <p className="font-medium mb-2">{data.fullCategory}</p>
                        <p style={{ color: payload[0].color }}>
                          Amount: {formatCurrency(payload[0].value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

// Savings Progress Chart
export const SavingsProgressChart = ({ savingsGoals }) => {
  const chartData = useMemo(() => {
    return savingsGoals.map(goal => ({
      name: goal.name.length > 20 ? goal.name.substring(0, 20) + '...' : goal.name,
      fullName: goal.name,
      current: goal.currentAmount,
      target: goal.targetAmount,
      progress: (goal.currentAmount / goal.targetAmount) * 100
    }));
  }, [savingsGoals]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            No savings goals available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goals Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
                        <p className="font-medium mb-2">{data.fullName}</p>
                        <p style={{ color: payload[0].color }}>
                          Current: {formatCurrency(data.current)}
                        </p>
                        <p style={{ color: payload[1].color }}>
                          Target: {formatCurrency(data.target)}
                        </p>
                        <p>Progress: {data.progress.toFixed(1)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="current" fill="#10b981" name="Current Amount" />
              <Bar dataKey="target" fill="#94a3b8" name="Target Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
