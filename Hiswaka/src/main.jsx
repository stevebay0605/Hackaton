import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Vos styles globaux (Tailwind)
import { AuthProvider } from './context/AuthContext'; // <--- IMPORT IMPORTANT

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Le Provider doit englober toute l'application */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);