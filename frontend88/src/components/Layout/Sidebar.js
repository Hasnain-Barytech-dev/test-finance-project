import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Transactions', path: '/transactions', icon: '💰' },
    { name: 'Analytics', path: '/analytics', icon: '��' },
  ];

  return (
    <aside style={{
      position: 'fixed',
      left: 0,
      top: '4rem',
      height: 'calc(100vh - 4rem)',
      width: '16rem',
      backgroundColor: 'white',
      boxShadow: '1px 0 3px rgba(0,0,0,0.1)',
      borderRight: '1px solid #e5e7eb'
    }}>
      <nav style={{ marginTop: '2rem', padding: '0 1rem' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#1d4ed8' : '#4b5563'
                })}
              >
                <span style={{ marginRight: '0.75rem', fontSize: '1.125rem' }}>
                  {item.icon}
                </span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
