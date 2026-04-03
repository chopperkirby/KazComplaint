import { useComplaints } from '@/contexts/ComplaintContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { mockDashboardStats } from '@/../../shared/mockData';

export default function GovernmentDashboard() {
  const { complaints } = useComplaints();

  const stats = [
    {
      label: 'Всего жалоб',
      value: complaints.length,
      icon: AlertCircle,
      color: 'text-[#0B6E7F]',
    },
    {
      label: 'Решено',
      value: complaints.filter((c) => c.status === 'resolved').length,
      icon: CheckCircle2,
      color: 'text-[#27AE60]',
    },
    {
      label: 'В работе',
      value: complaints.filter((c) => c.status === 'in_progress').length,
      icon: TrendingUp,
      color: 'text-[#E67E22]',
    },
    {
      label: 'Рейтинг удовлетворения',
      value: `${mockDashboardStats.satisfactionRate}%`,
      icon: Users,
      color: 'text-[#3498DB]',
    },
  ];

  const categoryData = [
    { name: 'Экология', value: complaints.filter((c) => c.category === 'ecology').length },
    { name: 'ЖКХ', value: complaints.filter((c) => c.category === 'housing').length },
    { name: 'Акимат', value: complaints.filter((c) => c.category === 'akimat').length },
  ];

  const statusData = [
    { name: 'Новая', value: complaints.filter((c) => c.status === 'new').length },
    { name: 'На утверждении', value: complaints.filter((c) => c.status === 'pending_approval').length },
    { name: 'На выполнении', value: complaints.filter((c) => c.status === 'in_progress').length },
    { name: 'Выполнено', value: complaints.filter((c) => c.status === 'resolved').length },
  ];

  const urgencyData = [
    { name: 'Низкая', value: complaints.filter((c) => c.urgency === 'low').length },
    { name: 'Средняя', value: complaints.filter((c) => c.urgency === 'medium').length },
    { name: 'Высокая', value: complaints.filter((c) => c.urgency === 'high').length },
    { name: 'Критическая', value: complaints.filter((c) => c.urgency === 'critical').length },
  ];

  const COLORS = ['#0B6E7F', '#27AE60', '#E67E22', '#E74C3C'];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Аналитика системы и управление жалобами</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-sm">
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

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Status Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Жалобы по статусам</CardTitle>
            <CardDescription>Текущее распределение по всем статусам</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0B6E7F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Жалобы по категориям</CardTitle>
            <CardDescription>Распределение по отделам</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Urgency Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Жалобы по срочности</CardTitle>
            <CardDescription>Обзор приоритизации</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={urgencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#E67E22" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Ключевые метрики</CardTitle>
            <CardDescription>Показатели производительности системы</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Среднее время решения</span>
              <span className="font-bold text-foreground">{mockDashboardStats.averageResolutionTime} дней</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Рейтинг удовлетворения</span>
              <span className="font-bold text-foreground">{mockDashboardStats.satisfactionRate}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Процент решения</span>
              <span className="font-bold text-foreground">
                {Math.round((complaints.filter((c) => c.status === 'resolved').length / complaints.length) * 100)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-muted-foreground">Критические жалобы</span>
              <span className="font-bold text-foreground">{complaints.filter((c) => c.urgency === 'critical').length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
