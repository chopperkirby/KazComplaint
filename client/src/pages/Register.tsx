import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const [, navigate] = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getRoleFromEmail = (emailStr: string) => {
    const domain = emailStr.split('@')[1]?.toLowerCase();
    if (domain === 'gov.kz') {
      return 'Гос-сотрудник';
    }
    return 'Гражданин';
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      toast.success('Аккаунт создан! Добро пожаловать!');
      navigate('/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ошибка регистрации');
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

        {/* Register Form */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Создайте аккаунт для начала работы
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Ваше имя
                </label>
                <Input
                  type="text"
                  placeholder="Иван Петров"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-border"
                  disabled={isLoading}
                />
              </div>

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
                {email && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} className="text-[#27AE60]" />
                    <span className="text-muted-foreground">
                      Роль: <strong>{getRoleFromEmail(email)}</strong>
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Пароль
                </label>
                <Input
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">
                  Подтвердите пароль
                </label>
                <Input
                  type="password"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Регистрация...
                  </>
                ) : (
                  'Зарегистрироваться'
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">Роль определяется автоматически:</p>
                  <p>📧 <strong>@gmail.kz</strong> → Гражданин</p>
                  <p>👨‍💼 <strong>@gov.kz</strong> → Гос-сотрудник</p>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Уже есть аккаунт? </span>
              <button
                onClick={() => navigate('/login')}
                className="text-[#0B6E7F] hover:underline font-semibold"
              >
                Войти
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
