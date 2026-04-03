import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CheckCircle2, AlertCircle, Clock, FileText } from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const { complaints } = useComplaints();

  const userComplaints = complaints.filter((c) => c.createdBy.id === user?.id);

  const stats = [
    {
      label: 'Всего жалоб',
      value: userComplaints.length,
      icon: FileText,
      color: 'text-[#0B6E7F]',
    },
    {
      label: 'Решено',
      value: userComplaints.filter((c) => c.status === 'resolved').length,
      icon: CheckCircle2,
      color: 'text-[#27AE60]',
    },
    {
      label: 'В работе',
      value: userComplaints.filter((c) => c.status === 'in_progress').length,
      icon: Clock,
      color: 'text-[#E67E22]',
    },
    {
      label: 'На рассмотрении',
      value: userComplaints.filter((c) => c.status === 'pending_approval' || c.status === 'new').length,
      icon: AlertCircle,
      color: 'text-[#E74C3C]',
    },
  ];

  const categoryData = [
    { name: 'Экология', value: userComplaints.filter((c) => c.category === 'ecology').length },
    { name: 'ЖКХ', value: userComplaints.filter((c) => c.category === 'housing').length },
    { name: 'Акимат', value: userComplaints.filter((c) => c.category === 'akimat').length },
  ].filter((item) => item.value > 0);

  const statusData = [
    { name: 'Новая', value: userComplaints.filter((c) => c.status === 'new').length },
    { name: 'На утверждении', value: userComplaints.filter((c) => c.status === 'pending_approval').length },
    { name: 'На выполнении', value: userComplaints.filter((c) => c.status === 'in_progress').length },
    { name: 'Выполнено', value: userComplaints.filter((c) => c.status === 'resolved').length },
  ].filter((item) => item.value > 0);

  const COLORS = ['#0B6E7F', '#27AE60', '#E67E22', '#E74C3C'];

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Мой профиль</h1>
        <p className="text-muted-foreground">Добро пожаловать, {user?.name}</p>
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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        {categoryData.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Жалобы по категориям</CardTitle>
              <CardDescription>Распределение ваших жалоб</CardDescription>
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
        )}

        {/* Status Distribution */}
        {statusData.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Жалобы по статусам</CardTitle>
              <CardDescription>Текущий статус ваших жалоб</CardDescription>
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
        )}
      </div>

      {/* Empty State */}
      {userComplaints.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Вы еще не подали ни одной жалобы</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
