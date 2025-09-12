'use client';

import { useState, useRef } from 'react';
import { useTransactions } from '../../hooks/useData';
import TransactionForm from '../../components/transactions/TransactionForm';
import TransactionList from '../../components/transactions/TransactionList';
import { Alert, AlertDescription } from '../../components/ui/Alert';
import Button from '../../components/ui/Button';
import { Plus, X } from 'lucide-react';
import Modal from '../../components/ui/Modal';

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
  const fileInputRef = useRef();

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

  // CSV Export Functionality
  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) return;
    const headers = Object.keys(transactions[0]);
    const csvRows = [headers.join(','), ...transactions.map(tx => headers.map(h => `"${tx[h]}"`).join(','))];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import Functionality
  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(Boolean);
      const headers = lines[0].split(',');
      const imported = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.replace(/"/g, ''));
        const obj = {};
        headers.forEach((h, i) => { obj[h] = values[i]; });
        return obj;
      });
      imported.forEach(tx => addTransaction(tx));
      setAlert({ type: 'success', message: 'CSV imported!' });
      setTimeout(() => setAlert(null), 3000);
    };
    reader.readAsText(file);
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
        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            className="flex items-center gap-2"
            variant="outline"
          >
            Export CSV
          </Button>
          <Button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2"
            variant="outline"
          >
            Import CSV
          </Button>
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImportCSV}
          />
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingTransaction(null);
            }}
            className="flex items-center gap-2"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancel' : 'Add Transaction'}
          </Button>
        </div>
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

      {/* Edit Transaction Modal */}
      <Modal open={!!editingTransaction} onClose={handleCancelEdit}>
        {editingTransaction && (
          <TransactionForm
            initialData={editingTransaction}
            onSubmit={handleEditTransaction}
            onCancel={handleCancelEdit}
          />
        )}
      </Modal>

      {/* Transaction List */}
      <TransactionList
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}
