import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import LoginPage from '../components/LoginPage';
import Layout from '../components/Layout';
import Dashboard from '../components/Dashboard';
import ProductList from '../components/ProductList';
import Navigation from '../components/Navigation';

const AppContent = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'products'>('dashboard');

  if (!user) {
    return <LoginPage />;
  }

  // Auto-redirect Store Keepers to products since they can't access dashboard
  const effectiveView = user.role === 'Store Keeper' ? 'products' : currentView;

  return (
    <Layout>
      <Navigation 
        currentView={effectiveView} 
        onViewChange={setCurrentView} 
      />
      
      {effectiveView === 'dashboard' && <Dashboard />}
      {effectiveView === 'products' && <ProductList />}
    </Layout>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
