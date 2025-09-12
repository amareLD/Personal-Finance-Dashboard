'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  formatCurrency, 
  formatDate, 
  filterTransactions, 
  sortTransactions, 
  paginateArray 
} from '../../lib/utils';
import { defaultCategories, ITEMS_PER_PAGE } from '../../lib/constants';

const TransactionRow = ({ transaction, onEdit, onDelete }) => (
  <tr className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
    <td className="px-4 py-3">
      <div>
        <p className="font-medium text-gray-900 dark:text-gray-100">
          {transaction.description}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {transaction.category}
        </p>
      </div>
    </td>
    <td className="px-4 py-3">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        transaction.type === 'income' 
          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}>
        {transaction.type}
      </span>
    </td>
    <td className={`px-4 py-3 font-semibold ${
      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
    }`}>
      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
    </td>
    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
      {formatDate(transaction.date)}
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(transaction)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(transaction.id)}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </td>
  </tr>
);

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => (
  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
    <div className="text-sm text-gray-700 dark:text-gray-300">
      Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} results
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>
      <span className="text-sm text-gray-700 dark:text-gray-300">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default function TransactionList({ 
  transactions = [], 
  onEdit, 
  onDelete 
}) {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: ''
  });
  
  const [sortConfig, setSortConfig] = useState({
    field: 'date',
    direction: 'desc'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [paginatedData, setPaginatedData] = useState({
    items: [],
    totalPages: 0,
    totalItems: 0
  });

  // Filter and sort transactions
  useEffect(() => {
    let filtered = filterTransactions(transactions, filters);
    filtered = sortTransactions(filtered, sortConfig.field, sortConfig.direction);
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, filters, sortConfig]);

  // Paginate filtered transactions
  useEffect(() => {
    const paginated = paginateArray(filteredTransactions, currentPage, ITEMS_PER_PAGE);
    setPaginatedData(paginated);
  }, [filteredTransactions, currentPage]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      startDate: '',
      endDate: ''
    });
  };

  const allCategories = [...defaultCategories.income, ...defaultCategories.expense];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Transactions</span>
          <div className="text-sm font-normal text-gray-500">
            {paginatedData.totalItems} total
          </div>
        </CardTitle>
      </CardHeader>
      
      {/* Filters */}
      <div className="px-6 pb-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search descriptions..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <Select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>

          {/* Category Filter */}
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {allCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>

          {/* Date Range */}
          <Input
            type="date"
            placeholder="Start Date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
          <Input
            type="date"
            placeholder="End Date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>

        {/* Clear Filters */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      <CardContent className="p-0">
        {paginatedData.items.length > 0 ? (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleSort('description')}
                    >
                      Description
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleSort('type')}
                    >
                      Type
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleSort('amount')}
                    >
                      Amount
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => handleSort('date')}
                    >
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.items.map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {paginatedData.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={paginatedData.totalPages}
                totalItems={paginatedData.totalItems}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              {transactions.length === 0 
                ? 'No transactions yet. Add your first transaction to get started!'
                : 'No transactions match your current filters.'
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
