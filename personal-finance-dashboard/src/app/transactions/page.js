'use client';

import { useState } from 'react';
import { useTransactions } from '../../hooks/useData';
import TransactionForm from '../../components/transactions/TransactionForm';
import TransactionList from '../../components/transactions/TransactionList';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { Plus, X } from 'lucide-react';

export default function TransactionsPage() {
  const { 
    transactions, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction, 
    isLoading 
  } = useTransactions();
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleAddTransaction = async (transactionData) => {
    try {
      await addTransaction(transactionData);
      setShowForm(false);
      setAlert({
        type: 'success',
        message: 'Transaction added successfully!'
      });
      // Clear alert after 3 seconds
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'destructive',
        message: error.message
      });
    }
  };

  const handleEditTransaction = async (transactionData) => {
    try {
      await updateTransaction(editingTransaction.id, transactionData);
      setEditingTransaction(null);
      setAlert({
        type: 'success',
        message: 'Transaction updated successfully!'
      });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({
        type: 'destructive',
        message: error.message
      });
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setAlert({
          type: 'success',
          message: 'Transaction deleted successfully!'
        });
        setTimeout(() => setAlert(null), 3000);
      } catch (error) {
        setAlert({
          type: 'destructive',
          message: error.message
        });
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(false); // Close add form if open
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleCancelAdd = () => {
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Transactions
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your income and expenses
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            setEditingTransaction(null); // Close edit form if open
          }}
          className="flex items-center gap-2"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? 'Cancel' : 'Add Transaction'}
        </Button>
      </div>

      {/* Alert */}
      {alert && (
        <Alert 
          variant={alert.type} 
          dismissible 
          onDismiss={() => setAlert(null)}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      {/* Add Transaction Form */}
      {showForm && (
        <TransactionForm
          onSubmit={handleAddTransaction}
          onCancel={handleCancelAdd}
        />
      )}

      {/* Edit Transaction Form */}
      {editingTransaction && (
        <TransactionForm
          initialData={editingTransaction}
          onSubmit={handleEditTransaction}
          onCancel={handleCancelEdit}
        />
      )}

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}
