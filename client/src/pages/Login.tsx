import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Добро пожаловать!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setIsLoading(true);
    try {
      await login(demoEmail, 'password123');
      toast.success('Добро пожаловать!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FA] to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0B6E7F] to-[#27AE60] rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">K</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">KazComplaint</h1>
          <p className="text-muted-foreground mt-2">Система подачи городских жалоб</p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Вход</CardTitle>
            <CardDescription>
              Введите ваш email и пароль для входа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="example@gmail.kz или example@gov.kz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Пароль
                </label>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B6E7F] hover:bg-[#0A5A6B] text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Роль определяется по домену:</p>
                  <p>📧 <strong>gmail.kz</strong> → Гражданин</p>
                  <p>👨‍💼 <strong>gov.kz</strong> → Гос-сотрудник</p>
                </div>
              </div>
            </div>

            {/* Demo Buttons */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center">Демо-аккаунты:</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('citizen@gmail.kz')}
                disabled={isLoading}
                className="w-full"
              >
                📧 Гражданин (gmail.kz)
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin('officer@gov.kz')}
                disabled={isLoading}
                className="w-full"
              >
                👨‍💼 Гос-сотрудник (gov.kz)
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Нет аккаунта? </span>
              <button
                onClick={() => navigate('/register')}
                className="text-[#0B6E7F] hover:underline font-semibold"
              >
                Зарегистрируйтесь
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
