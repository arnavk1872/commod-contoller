import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package } from 'lucide-react';

interface NavigationProps {
  currentView: 'dashboard' | 'products';
  onViewChange: (view: 'dashboard' | 'products') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <nav className="flex flex-wrap gap-2">
        {user?.role === 'Manager' && (
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'outline'}
            onClick={() => onViewChange('dashboard')}
            className="flex items-center gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            {t('navigation.dashboard')}
          </Button>
        )}
        <Button
          variant={currentView === 'products' ? 'default' : 'outline'}
          onClick={() => onViewChange('products')}
          className="flex items-center gap-2"
        >
          <Package className="h-4 w-4" />
          {t('navigation.products')}
        </Button>
      </nav>
    </div>
  );
};

export default Navigation;
