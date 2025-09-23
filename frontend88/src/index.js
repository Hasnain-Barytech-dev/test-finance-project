import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('Starting React app...');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('React app rendered!');
