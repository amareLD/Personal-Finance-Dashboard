'use client';

import { useState } from 'react';
import { Edit2, Trash2, Target, Plus, Calendar, DollarSign } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Label } from '../ui/Label';
import { Progress } from '../ui/Progress';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { 
  formatCurrency, 
  formatDate, 
  getProgressPercentage, 
  getMonthsBetween 
} from '../../lib/utils';

const SavingsGoalCard = ({ goal, onEdit, onDelete, onAddAmount }) => {
  const [addAmount, setAddAmount] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
  const remaining = goal.targetAmount - goal.currentAmount;
  const monthsRemaining = getMonthsBetween(new Date(), new Date(goal.deadline));
  const monthlyTarget = remaining > 0 && monthsRemaining > 0 ? remaining / monthsRemaining : 0;

  const handleAddAmount = async () => {
    const amount = parseFloat(addAmount);
    if (amount > 0) {
      try {
        await onAddAmount(goal.id, amount);
        setAddAmount('');
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding amount:', error);
      }
    }
  };

  return (
    <Card className={`card-hover ${goal.completed ? 'border-green-200 bg-green-50 dark:bg-green-950' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            {goal.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {!goal.completed && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => onEdit(goal)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-medium">{progress.toFixed(1)}%</span>
          </div>
          <Progress 
            value={goal.currentAmount} 
            max={goal.targetAmount}
            className="h-3"
            indicatorClassName={`${
              goal.completed ? 'bg-green-500' : 'bg-blue-500'
            } progress-animate`}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatCurrency(goal.currentAmount)}</span>
            <span>{formatCurrency(goal.targetAmount)}</span>
          </div>
        </div>

        {/* Goal Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-600 dark:text-gray-400">Remaining</p>
              <p className="font-medium">{formatCurrency(remaining)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-gray-600 dark:text-gray-400">Deadline</p>
              <p className="font-medium">{formatDate(goal.deadline)}</p>
            </div>
          </div>
        </div>

        {/* Timeline Info */}
        {!goal.completed && monthsRemaining > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{monthsRemaining}</strong> months remaining
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              Save {formatCurrency(monthlyTarget)} per month to reach your goal
            </p>
          </div>
        )}

        {/* Completed Badge */}
        {goal.completed && (
          <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-center">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              🎉 Goal Completed!
            </p>
          </div>
        )}

        {/* Add Amount Form */}
        {showAddForm && !goal.completed && (
          <div className="p-3 border rounded-lg space-y-3">
            <Label>Add to Savings</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                className="flex-1"
              />
              <Button 
                size="sm" 
                onClick={handleAddAmount}
                disabled={!addAmount || parseFloat(addAmount) <= 0}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SavingsGoalForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    targetAmount: initialData?.targetAmount || '',
    currentAmount: initialData?.currentAmount || 0,
    deadline: initialData?.deadline || ''
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

    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (parseFloat(formData.currentAmount) < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = 'Deadline must be in the future';
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
      if (!initialData) {
        setFormData({
          name: '',
          targetAmount: '',
          currentAmount: 0,
          deadline: ''
        });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData ? 'Edit Savings Goal' : 'Create Savings Goal'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Goal Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount ($)</Label>
            <Input
              id="targetAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={(e) => handleInputChange('targetAmount', e.target.value)}
              error={!!errors.targetAmount}
            />
            {errors.targetAmount && (
              <p className="text-sm text-red-600">{errors.targetAmount}</p>
            )}
          </div>

          {/* Current Amount */}
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Amount ($)</Label>
            <Input
              id="currentAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={(e) => handleInputChange('currentAmount', e.target.value)}
              error={!!errors.currentAmount}
            />
            {errors.currentAmount && (
              <p className="text-sm text-red-600">{errors.currentAmount}</p>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Target Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              error={!!errors.deadline}
            />
            {errors.deadline && (
              <p className="text-sm text-red-600">{errors.deadline}</p>
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
              {initialData ? 'Update Goal' : 'Create Goal'}
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

export { SavingsGoalCard, SavingsGoalForm };
