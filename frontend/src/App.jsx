import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}

export default App;
