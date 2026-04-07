import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/theme.css';

// PrimeReact Styles
import "primereact/resources/themes/lara-light-indigo/theme.css";  // Standard theme for PrimeReact
import "primereact/resources/primereact.min.css";                  // Core styles
import "primeicons/primeicons.css";                                 // Icons

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
