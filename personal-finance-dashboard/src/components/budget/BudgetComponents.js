'use client';

import { useState } from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Label } from '../ui/Label';
import { Progress } from '../ui/Progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Alert, AlertDescription, AlertTitle } from '../ui/Alert';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import { defaultCategories, BUDGET_ALERTS } from '../../lib/constants';

const BudgetCard = ({ category, budget, spent, onEdit, onDelete }) => {
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const remaining = budget.amount - spent;
  const isWarning = percentage >= BUDGET_ALERTS.WARNING * 100;
  const isDanger = percentage >= BUDGET_ALERTS.DANGER * 100;

  let alertVariant = 'default';
  let alertIcon = CheckCircle;
  let alertTitle = 'On Track';
  let alertMessage = `You have ${formatCurrency(remaining)} remaining in your budget.`;

  if (isDanger) {
    alertVariant = 'destructive';
    alertIcon = AlertTriangle;
    alertTitle = 'Budget Exceeded';
    alertMessage = `You have exceeded your budget by ${formatCurrency(Math.abs(remaining))}.`;
  } else if (isWarning) {
    alertVariant = 'warning';
    alertIcon = AlertTriangle;
    alertTitle = 'Budget Warning';
    alertMessage = `You have used ${formatPercentage(percentage, 0)} of your budget.`;
  }

  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{category}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(budget)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(budget.category)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Budget vs Spent */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Spent</span>
            <span className="font-medium">{formatCurrency(spent)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Budget</span>
            <span className="font-medium">{formatCurrency(budget.amount)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={spent} 
            max={budget.amount}
            className="h-3"
            indicatorClassName={`${
              isDanger ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'
            } progress-animate`}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatPercentage(percentage, 0)} used</span>
            <span>{formatCurrency(remaining)} remaining</span>
          </div>
        </div>

        {/* Alert */}
        {(isWarning || isDanger) && (
          <Alert variant={alertVariant} className="py-2">
            <alertIcon className="h-4 w-4" />
            <div>
              <AlertTitle className="text-sm">{alertTitle}</AlertTitle>
              <AlertDescription className="text-xs">{alertMessage}</AlertDescription>
            </div>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

const BudgetForm = ({ onSubmit, initialData = null, onCancel = null, existingCategories = [] }) => {
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    amount: initialData?.amount || ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else if (!initialData && existingCategories.includes(formData.category)) {
      newErrors.category = 'Budget already exists for this category';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
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
      await onSubmit(formData.category, parseFloat(formData.amount));
      if (!initialData) {
        setFormData({ category: '', amount: '' });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  const availableCategories = defaultCategories.expense.filter(
    category => !existingCategories.includes(category) || category === initialData?.category
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Budget' : 'Set Budget'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              error={!!errors.category}
              disabled={!!initialData} // Disable editing category for existing budgets
            >
              <option value="">Select a category</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monthly Budget ($)</Label>
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

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? 'Update Budget' : 'Set Budget'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export { BudgetCard, BudgetForm };
