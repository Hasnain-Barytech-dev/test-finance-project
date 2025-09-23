import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  return (
    <header style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      borderBottom: '1px solid #e5e7eb' 
    }}>
      <div style={{ padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>
            Finance Tracker
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', margin: 0 }}>
                  {user?.name}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                  {user?.role}
                </p>
              </div>
              
              <button onClick={logout} style={{
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                color: '#dc2626',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
