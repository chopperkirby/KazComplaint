import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, MapPin, BarChart3, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { mockDashboardStats } from '@/../../shared/mockData';

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const role = user?.role;

  const stats = [
    {
      label: 'Всего жалоб',
      value: mockDashboardStats.totalComplaints,
      icon: FileText,
      color: 'text-[#0B6E7F]',
    },
    {
      label: 'Решено',
      value: mockDashboardStats.resolvedComplaints,
      icon: CheckCircle2,
      color: 'text-[#27AE60]',
    },
    {
      label: 'В работе',
      value: mockDashboardStats.inProgressComplaints,
      icon: Clock,
      color: 'text-[#E67E22]',
    },
    {
      label: 'Новых',
      value: mockDashboardStats.newComplaints,
      icon: AlertCircle,
      color: 'text-[#E74C3C]',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FA] to-background">
      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              KazComplaint
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Современная система для подачи и обработки городских жалоб. Помогите улучшить наш город вместе с нами.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {role === 'citizen' ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/submit')}
                    className="bg-[#0B6E7F] hover:bg-[#0A5A6B] text-white"
                  >
                    <FileText className="mr-2" size={20} />
                    Подать жалобу
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/complaints')}
                  >
                    <MapPin className="mr-2" size={20} />
                    Мои жалобы
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={() => navigate('/dashboard/government')}
                    className="bg-[#0B6E7F] hover:bg-[#0A5A6B] text-white"
                  >
                    <BarChart3 className="mr-2" size={20} />
                    Dashboard
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/complaints')}
                  >
                    <FileText className="mr-2" size={20} />
                    Управление
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-[#0B6E7F]/10 to-[#27AE60]/10 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏙️</div>
              <p className="text-muted-foreground">Улучшаем город вместе</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </CardTitle>
                    <Icon className={`${stat.color} w-5 h-5`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
          Как это работает
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {role === 'citizen' ? (
            <>
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">📝</div>
                  <CardTitle>Подайте жалобу</CardTitle>
                  <CardDescription>
                    Опишите проблему, добавьте фото и укажите место на карте
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">🤖</div>
                  <CardTitle>ИИ анализ</CardTitle>
                  <CardDescription>
                    Система автоматически определит категорию и срочность
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">✅</div>
                  <CardTitle>Отслеживайте статус</CardTitle>
                  <CardDescription>
                    Получайте обновления о ходе решения вашей проблемы
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">📊</div>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>
                    Полная статистика по жалобам и проблемным зонам города
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">🗺️</div>
                  <CardTitle>Карта проблем</CardTitle>
                  <CardDescription>
                    Визуализация всех проблемных точек по районам
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl mb-4">⚙️</div>
                  <CardTitle>Управление</CardTitle>
                  <CardDescription>
                    Назначайте жалобы, меняйте статусы и добавляйте комментарии
                  </CardDescription>
                </CardHeader>
              </Card>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0B6E7F] text-white py-16 mt-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            {role === 'citizen'
              ? 'Заметили проблему? Сообщите нам!'
              : 'Готовы помочь городу?'}
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            {role === 'citizen'
              ? 'Ваш голос важен. Подайте жалобу и помогите улучшить наш город.'
              : 'Управляйте жалобами и координируйте работу команды для решения городских проблем.'}
          </p>
          <Button
            size="lg"
            onClick={() =>
              navigate(role === 'citizen' ? '/submit' : '/dashboard/government')
            }
            className="bg-white text-[#0B6E7F] hover:bg-gray-100"
          >
            {role === 'citizen' ? 'Подать жалобу' : 'Перейти в Dashboard'}
          </Button>
        </div>
      </section>
    </div>
  );
}
