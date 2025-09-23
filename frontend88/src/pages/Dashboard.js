import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Welcome back, {user?.name}!
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {[
          { title: 'Total Income', amount: '$5,240', icon: '💰', color: '#10b981' },
          { title: 'Total Expenses', amount: '$3,180', icon: '💸', color: '#ef4444' },
          { title: 'Net Savings', amount: '$2,060', icon: '📊', color: '#3b82f6' },
          { title: 'This Month', amount: '$320', icon: '📅', color: '#8b5cf6' }
        ].map((stat, index) => (
          <div key={index} style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                backgroundColor: stat.color,
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.875rem'
              }}>
                {stat.icon}
              </div>
              <div style={{ marginLeft: '1rem' }}>
                <dt style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#6b7280',
                  margin: 0
                }}>
                  {stat.title}
                </dt>
                <dd style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '500', 
                  color: '#111827',
                  margin: 0
                }}>
                  {stat.amount}
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '1rem' }}>
          Recent Transactions
        </h3>
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
          No recent transactions. Add your first transaction!
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
