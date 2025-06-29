import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Languages } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: t('auth.validationError'),
        description: t('auth.fillAllFields'),
        variant: "destructive"
      });
      return;
    }

    const success = await login(email, password);
    
    if (!success) {
      toast({
        title: t('auth.loginFailed'),
        description: t('auth.invalidCredentials'),
        variant: "destructive"
      });
    } else {
      toast({
        title: t('auth.loginSuccess'),
        description: t('auth.loginSuccessDesc')
      });
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleLanguage}
          className="border-2"
          title={`Switch to ${language === 'en' ? 'Français' : 'English'}`}
        >
          <Languages className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="border-2"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-white rounded-sm"></div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('app.title')}
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {t('app.tagline')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder={t('auth.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-2 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={t('auth.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-2 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? t('auth.signingIn') : t('auth.signIn')}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">{t('auth.demoAccounts')}</p>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg space-y-1">
              <p><strong>{t('auth.manager')}:</strong> manager@company.com / manager123</p>
              <p><strong>{t('auth.storeKeeper')}:</strong> keeper@company.com / keeper123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
