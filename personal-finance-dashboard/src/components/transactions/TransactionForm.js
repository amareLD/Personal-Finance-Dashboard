'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Label } from '../ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { defaultCategories } from '../../lib/constants';
import { formatDate } from '../../lib/utils';

export default function TransactionForm({ 
  onSubmit, 
  initialData = null, 
  isLoading = false,
  onCancel = null 
}) {
  const [formData, setFormData] = useState({
    amount: initialData?.amount || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    type: initialData?.type || 'expense',
    date: initialData?.date || new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 100) {
      newErrors.description = 'Description must be 100 characters or less';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form if this is a new transaction (no initialData)
      if (!initialData) {
        setFormData({
          amount: '',
          description: '',
          category: '',
          type: 'expense',
          date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Transaction submission error:', error);
      setErrors({ submit: error.message });
    }
  };

  const categories = defaultCategories[formData.type] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Transaction' : 'Add New Transaction'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              id="type"
              value={formData.type}
              onChange={(e) => {
                handleInputChange('type', e.target.value);
                // Reset category when type changes
                handleInputChange('category', '');
              }}
              error={!!errors.type}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-600">{errors.type}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              error={!!errors.amount}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter description..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              error={!!errors.description}
              maxLength={100}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{errors.description || ''}</span>
              <span>{formData.description.length}/100</span>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              error={!!errors.category}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              error={!!errors.date}
            />
            {errors.date && (
              <p className="text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Saving...' : (initialData ? 'Update Transaction' : 'Add Transaction')}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
