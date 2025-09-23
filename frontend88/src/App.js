import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for transactions
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [users, setUsers] = useState([]);
  const [transactionForm, setTransactionForm] = useState({
    type: 'expense',
    amount: '',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [transactionFilters, setTransactionFilters] = useState({
    type: '',
    categoryId: '',
    startDate: '',
    endDate: ''
  });

  const API_BASE = 'http://localhost:5000/api';

  // Fetch functions with useCallback for optimization
  const fetchTransactions = useCallback(async () => {
    if (!user) return;
    try {
      const query = new URLSearchParams(transactionFilters).toString();
      const response = await fetch(`${API_BASE}/transactions?${query}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [user, transactionFilters]);

  const fetchCategories = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_BASE}/transactions/categories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [user]);

  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    try {
      const [overviewRes, categoriesRes, trendsRes] = await Promise.all([
        fetch(`${API_BASE}/analytics/overview`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}),
        fetch(`${API_BASE}/analytics/categories`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}),
        fetch(`${API_BASE}/analytics/trends`, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }})
      ]);
      
      const overview = await overviewRes.json();
      const categoryData = await categoriesRes.json();
      const trends = await trendsRes.json();
      
      setAnalyticsData({ overview, categoryData, trends });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  }, [user]);

  const fetchUsers = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    try {
      const response = await fetch(`${API_BASE}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [user]);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchCategories();
      fetchAnalytics();
      if (user.role === 'admin') {
        fetchUsers();
      }
    }
  }, [user, fetchTransactions, fetchCategories, fetchAnalytics, fetchUsers]);

  // Memoized calculations for performance
  const dashboardStats = useMemo(() => {
    if (!analyticsData?.overview) return { totalIncome: 0, totalExpenses: 0, netSavings: 0, thisMonth: 0 };
    
    const { totalIncome, totalExpenses, netSavings, monthlyIncome, monthlyExpenses } = analyticsData.overview;
    const currentMonth = new Date().getMonth();
    const thisMonth = (monthlyIncome[currentMonth] || 0) - (monthlyExpenses[currentMonth] || 0);
    
    return { totalIncome, totalExpenses, netSavings, thisMonth };
  }, [analyticsData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setCurrentPage('dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error: ' + error.message);
    }
    setLoading(false);
  };

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    setCurrentPage('dashboard');
    setFormData({ email: '', password: '' });
    setError('');
    setTransactions([]);
    setCategories([]);
    setAnalyticsData(null);
  }, []);

  const handleTransactionSubmit = async (e) => {
    e.preventDefault();
    if (!user.hasPermission || user.role === 'read-only') return;
    
    try {
      const url = editingTransaction 
        ? `${API_BASE}/transactions/${editingTransaction.id}`
        : `${API_BASE}/transactions`;
      
      const method = editingTransaction ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(transactionForm)
      });
      
      if (response.ok) {
        setTransactionForm({
          type: 'expense',
          amount: '',
          description: '',
          categoryId: '',
          date: new Date().toISOString().split('T')[0]
        });
        setEditingTransaction(null);
        fetchTransactions();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!user.hasPermission || user.role === 'read-only') return;
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.ok) {
        fetchTransactions();
        fetchAnalytics();
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (user.role !== 'admin') return;
    
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  // Login form
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>Finance Tracker</h1>
            <p style={{ color: '#666', margin: 0 }}>Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin}>
            {error && (
              <div style={{ backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', color: '#721c24', padding: '12px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px' }}>
                {error}
              </div>
            )}
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '500' }}>Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: '500' }}>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                placeholder="Enter your password"
              />
            </div>
            
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: loading ? '#6c757d' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '4px', fontSize: '13px' }}>
            <strong>Demo Credentials:</strong><br/>
            <strong>Email:</strong> admin@demo.com<br/>
            <strong>Password:</strong> password<br/><br/>
            <em>Or try: user@demo.com / password</em>
          </div>
        </div>
      </div>
    );
  }

  // Main application layout
  return (
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
              <h1 style={{ margin: 0, color: '#333', fontSize: '24px' }}>Finance Tracker</h1>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Personal Finance Management</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold', color: '#333' }}>{user.name}</div>
                <div style={{ fontSize: '12px', color: '#666', textTransform: 'capitalize' }}>Role: {user.role}</div>
              </div>
              <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #ddd', padding: '0 2rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'transactions', label: 'Transactions', icon: '💰' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              ...(user.role === 'admin' ? [{ id: 'users', label: 'Users', icon: '👥' }] : [])
            ].map(nav => (
              <button
                key={nav.id}
                onClick={() => setCurrentPage(nav.id)}
                style={{
                  padding: '12px 0',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: currentPage === nav.id ? '3px solid #007bff' : '3px solid transparent',
                  color: currentPage === nav.id ? '#007bff' : '#666',
                  fontWeight: currentPage === nav.id ? 'bold' : 'normal',
                  cursor: 'pointer'
                }}
              >
                {nav.icon} {nav.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        {/* Main content */}
<main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
  {currentPage === 'transactions' && (
    <div>
      <h2 style={{ marginBottom: '30px', color: '#333' }}>Transactions</h2>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Category</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #dee2e6' }}>Amount</th>
                {user.role !== 'read-only' && (
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  {/* ... transaction rows ... */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}


        {/* Analytics Page */}
        {currentPage === 'analytics' && analyticsData && (
          <div>
            <h2 style={{ marginBottom: '30px', color: '#333' }}>Financial Analytics</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
              {/* Monthly Trends Chart */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Monthly Trends</h3>
                {analyticsData.trends && (
                  <Line
                    data={{
                      labels: analyticsData.trends.labels || [],
                      datasets: [
                        {
                          label: 'Income',
                          data: analyticsData.trends.income || [],
                          borderColor: '#28a745',
                          backgroundColor: '#28a74520',
                          tension: 0.1
                        },
                        {
                          label: 'Expenses',
                          data: analyticsData.trends.expenses || [],
                          borderColor: '#dc3545',
                          backgroundColor: '#dc354520',
                          tension: 0.1
                        },
                        {
                          label: 'Savings',
                          data: analyticsData.trends.savings || [],
                          borderColor: '#007bff',
                          backgroundColor: '#007bff20',
                          tension: 0.1
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                )}
              </div>

              {/* Category Distribution (Expenses) */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Expense Categories</h3>
                {analyticsData.categoryData?.expenses && analyticsData.categoryData.expenses.length > 0 && (
                  <Pie
                    data={{
                      labels: analyticsData.categoryData.expenses.map(item => item.name),
                      datasets: [{
                        data: analyticsData.categoryData.expenses.map(item => item.amount),
                        backgroundColor: [
                          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                          '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                        ]
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                )}
              </div>

              {/* Income vs Expenses Bar Chart */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', gridColumn: 'span 2' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Income vs Expenses Comparison</h3>
                {analyticsData.overview && (
                  <Bar
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                      datasets: [
                        {
                          label: 'Income',
                          data: analyticsData.overview.monthlyIncome || [],
                          backgroundColor: '#28a745'
                        },
                        {
                          label: 'Expenses',
                          data: analyticsData.overview.monthlyExpenses || [],
                          backgroundColor: '#dc3545'
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                )}
              </div>

              {/* Category Breakdown Table */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', gridColumn: 'span 2' }}>
                <h3 style={{ marginTop: 0, color: '#333' }}>Category Breakdown</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                  <div>
                    <h4 style={{ color: '#28a745', marginBottom: '15px' }}>Income Categories</h4>
                    {analyticsData.categoryData?.income?.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Category</th>
                            <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Amount</th>
                            <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.categoryData.income.map((item, index) => (
                            <tr key={index}>
                              <td style={{ padding: '8px', borderBottom: '1px solid #f8f9fa' }}>{item.name}</td>
                              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f8f9fa' }}>${item.amount}</td>
                              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f8f9fa' }}>{item.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>No income data available</p>
                    )}
                  </div>
                  <div>
                    <h4 style={{ color: '#dc3545', marginBottom: '15px' }}>Expense Categories</h4>
                    {analyticsData.categoryData?.expenses?.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f8f9fa' }}>
                            <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Category</th>
                            <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Amount</th>
                            <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analyticsData.categoryData.expenses.map((item, index) => (
                            <tr key={index}>
                              <td style={{ padding: '8px', borderBottom: '1px solid #f8f9fa' }}>{item.name}</td>
                              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f8f9fa' }}>${item.amount}</td>
                              <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #f8f9fa' }}>{item.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>No expense data available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Page (Admin Only) */}
        {currentPage === 'users' && user.role === 'admin' && (
          <div>
            <h2 style={{ marginBottom: '30px', color: '#333' }}>User Management</h2>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginTop: 0 }}>All Users</h3>
              {users.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>No users found</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Role</th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Created</th>
                        <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(userItem => (
                        <tr key={userItem.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                          <td style={{ padding: '12px' }}>{userItem.name}</td>
                          <td style={{ padding: '12px' }}>{userItem.email}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '12px', 
                              fontWeight: 'bold',
                              backgroundColor: userItem.role === 'admin' ? '#dc3545' : userItem.role === 'user' ? '#28a745' : '#6c757d',
                              color: 'white'
                            }}>
                              {userItem.role}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>{new Date(userItem.created_at).toLocaleDateString()}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            {userItem.id !== user.id && (
                              <select
                                value={userItem.role}
                                onChange={(e) => handleUpdateUserRole(userItem.id, e.target.value)}
                                style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px' }}
                              >
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="read-only">Read-only</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
              <h4 style={{ marginTop: 0, color: '#1565c0' }}>Role Permissions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <div>
                  <strong style={{ color: '#dc3545' }}>Admin</strong>
                  <ul style={{ fontSize: '14px', marginTop: '5px', color: '#333' }}>
                    <li>Full access to all features</li>
                    <li>User management</li>
                    <li>All transaction operations</li>
                    <li>View all analytics</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ color: '#28a745' }}>User</strong>
                  <ul style={{ fontSize: '14px', marginTop: '5px', color: '#333' }}>
                    <li>Manage own transactions</li>
                    <li>View own analytics</li>
                    <li>Add, edit, delete transactions</li>
                  </ul>
                </div>
                <div>
                  <strong style={{ color: '#6c757d' }}>Read-only</strong>
                  <ul style={{ fontSize: '14px', marginTop: '5px', color: '#333' }}>
                    <li>View own transactions only</li>
                    <li>View own analytics</li>
                    <li>Cannot modify data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
