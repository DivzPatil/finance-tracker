import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Plus, RefreshCw, Calendar, Tag, IndianRupee, PieChart, BarChart3, Wallet, CreditCard } from 'lucide-react';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ income: 0, expenses: 0, balance: 0 });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [filter, setFilter] = useState('all');

const calculateStats = useCallback(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    setStats({ income, expenses, balance: income - expenses });
}, [transactions]);
// Fetch data when app starts
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Recalculate stats whenever transactions change
  useEffect(() => {
    calculateStats();
  }, [transactions, calculateStats]);












 

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/transactions');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
      setError('');
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to connect to backend. Make sure your server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description.trim(),
          amount: parseFloat(amount),
          type
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Reset form
      setDescription('');
      setAmount('');
      setType('expense');
      setError('');
      setIsFormVisible(false);
      
      // Refresh transactions
      await fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const recentTransactions = filteredTransactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-10 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full shadow-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Personal Finance Tracker
          </h1>
          <p className="text-gray-600 text-lg">Smart money management for a brighter financial future</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-red-500 rounded-full p-1 mr-3">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Income Card */}
          <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-green-100 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.income)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                <span className="text-xs font-medium">+{transactions.filter(t => t.type === 'income').length} transactions</span>
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.expenses)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                <span className="text-xs font-medium">{transactions.filter(t => t.type === 'expense').length} transactions</span>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className={`bg-gradient-to-br ${stats.balance >= 0 ? 'from-blue-400 to-indigo-500' : 'from-orange-400 to-red-500'} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 p-3 rounded-full">
                <DollarSign className="w-6 h-6" />
              </div>
              <div className="text-right">
                <p className={`${stats.balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>Net Balance</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.balance)}</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                <span className="text-xs font-medium">{stats.balance >= 0 ? 'Positive' : 'Negative'} Balance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Transaction</span>
            </button>
            
            <button
              onClick={fetchTransactions}
              disabled={loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-gray-400 to-gray-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Transaction Form */}
          {isFormVisible && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Add New Transaction</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-1" />
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="Enter transaction description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <IndianRupee className="w-4 h-4 inline mr-1" />
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <CreditCard className="w-4 h-4 inline mr-1" />
                      Type
                    </label>
                    <select 
                      value={type} 
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="expense">💸 Expense</option>
                      <option value="income">💰 Income</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleSubmit}
                    disabled={loading || !description.trim() || !amount}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Adding...
                      </div>
                    ) : (
                      'Add Transaction'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className={`${isFormVisible ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg mr-3">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                </div>

                {/* Filter Buttons */}
                <div className="flex space-x-2">
                  {['all', 'income', 'expense'].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filter === filterType
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filterType === 'all' ? '📊 All' : filterType === 'income' ? '💰 Income' : '💸 Expense'}
                    </button>
                  ))}
                </div>
              </div>

              {loading && transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading your financial data...</p>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <PieChart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">No transactions found</p>
                  <p className="text-sm text-gray-400">Add your first transaction to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div 
                      key={transaction._id} 
                      className={`p-4 rounded-xl border-l-4 transition-all duration-300 hover:shadow-md hover:scale-102 ${
                        transaction.type === 'income' 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 hover:from-green-100 hover:to-emerald-100' 
                          : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400 hover:from-red-100 hover:to-pink-100'
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.5s ease-out forwards'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className={`p-2 rounded-lg mr-4 ${
                            transaction.type === 'income' ? 'bg-green-200' : 'bg-red-200'
                          }`}>
                            {transaction.type === 'income' ? 
                              <TrendingUp className="w-5 h-5 text-green-600" /> : 
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            }
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 mb-1">{transaction.description}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(transaction.date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                            transaction.type === 'income' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transaction.type === 'income' ? '💰 Income' : '💸 Expense'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredTransactions.length > 5 && (
                    <div className="text-center pt-4">
                      <p className="text-gray-500 text-sm">
                        Showing 5 of {filteredTransactions.length} {filter === 'all' ? '' : filter} transactions
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <p className="text-gray-600">
            <span className="font-semibold">💡 Full-Stack Finance Tracker</span> - Built with React, Node.js, and MongoDB
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;