import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { SiteProvider } from './components/SiteContext';
import { AuthProvider } from './components/AuthContext';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SiteProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </SiteProvider>
    </AuthProvider>
  </React.StrictMode>
);