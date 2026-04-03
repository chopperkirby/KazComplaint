import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, MessageCircle, Star, Send, Sparkles, Clock, CheckCircle2, Lightbulb, AlertCircle } from 'lucide-react';
import { STATUS_CONFIG, URGENCY_CONFIG, CATEGORY_CONFIG } from '@/../../shared/types';
import { ComplaintStatus, UrgencyLevel } from '@/../../shared/types';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { generateAIRecommendations } from '@/lib/aiSimulation';

export default function ComplaintDetail() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/complaint/:id');
  const { user } = useAuth();
  const role = user?.role;
  const { getComplaintById, updateComplaint, addComment } = useComplaints();

  const complaint = getComplaintById(params?.id as string);
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintStatus | ''>('');
  const [rating, setRating] = useState(0);

  if (!complaint) {
    return (
      <div className="container py-16">
        <Card className="border-0 shadow-sm">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">Жалоба не найдена</p>
            <Button onClick={() => navigate('/complaints')} variant="outline">
              Вернуться к жалобам
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Комментарий не может быть пустым');
      return;
    }

    addComment(complaint.id, {
      id: nanoid(),
      text: newComment,
      author: user!,
      createdAt: new Date().toISOString(),
    });

    setNewComment('');
    toast.success('Комментарий добавлен');
  };

  const handleStatusChange = (status: ComplaintStatus) => {
    updateComplaint(complaint.id, { status });
    setNewStatus('');
    toast.success('Статус обновлен');
  };

  const handleRating = (value: number) => {
    updateComplaint(complaint.id, { rating: value });
    setRating(value);
    toast.success('Оценка сохранена');
  };

  const aiRecommendations = role === 'government' ? generateAIRecommendations(complaint) : null;

  return (
    <div className="container py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/complaints')}
        className="flex items-center gap-2 text-[#0B6E7F] hover:text-[#0A5A6B] mb-6 font-medium"
      >
        <ArrowLeft size={18} />
        Вернуться к жалобам
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground mb-2">{complaint.title}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      style={{
                        backgroundColor: STATUS_CONFIG[complaint.status as ComplaintStatus]?.bgColor,
                        color: STATUS_CONFIG[complaint.status as ComplaintStatus]?.color,
                      }}
                    >
                      {STATUS_CONFIG[complaint.status as ComplaintStatus]?.label}
                    </Badge>
                    <Badge
                      style={{
                        backgroundColor: URGENCY_CONFIG[complaint.urgency as UrgencyLevel]?.bgColor,
                        color: URGENCY_CONFIG[complaint.urgency as UrgencyLevel]?.color,
                      }}
                    >
                      {URGENCY_CONFIG[complaint.urgency as UrgencyLevel]?.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Описание</h3>
                <p className="text-muted-foreground">{complaint.description}</p>
              </div>

              {/* Images */}
              {complaint.images && complaint.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Фото</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {complaint.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Complaint ${idx}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Место</h3>
                <p className="text-muted-foreground">{complaint.location.address}</p>
              </div>

              {/* Category */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Категория</h3>
                <p className="text-muted-foreground">
                  {CATEGORY_CONFIG[complaint.category]?.label}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Создано</h3>
                  <p className="text-muted-foreground text-sm">
                    {new Date(complaint.createdAt).toLocaleString('ru-RU')}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Обновлено</h3>
                  <p className="text-muted-foreground text-sm">
                    {new Date(complaint.updatedAt).toLocaleString('ru-RU')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <MessageCircle size={18} className="text-[#0B6E7F]" />
                <h2 className="font-semibold text-foreground">Комментарии ({complaint.comments.length})</h2>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Comments List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {complaint.comments.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Комментариев нет</p>
                ) : (
                  complaint.comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{comment.author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className="space-y-2 pt-4 border-t border-border">
                <label className="text-sm font-semibold text-foreground">Добавить комментарий</label>
                <Textarea
                  placeholder="Напишите ваш комментарий..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="border-border"
                />
                <Button
                  onClick={handleAddComment}
                  className="w-full bg-[#0B6E7F] hover:bg-[#0A5A6B] text-white"
                >
                  <Send size={16} className="mr-2" />
                  Отправить
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Recommendations (Government Only) */}
          {role === 'government' && aiRecommendations && (
            <Card className="border-0 shadow-sm bg-gradient-to-br from-[#E67E22]/5 to-[#E67E22]/10 border border-[#E67E22]/20">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles size={18} className="text-[#E67E22]" />
                  ИИ Рекомендации
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Priority */}
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <AlertCircle size={20} className="text-[#E67E22] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Приоритет</p>
                    <p className="font-semibold text-foreground">{aiRecommendations.priority}</p>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <Clock size={20} className="text-[#0B6E7F] flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Ожидаемое время</p>
                    <p className="font-semibold text-foreground">{aiRecommendations.estimatedTime}</p>
                  </div>
                </div>

                {/* Suggested Actions */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <Lightbulb size={14} />
                    Рекомендуемые действия
                  </p>
                  <ul className="space-y-1">
                    {aiRecommendations.suggestedActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-[#27AE60] mt-1">✓</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Management (Government Only) */}
          {role === 'government' && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Изменить статус</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={newStatus} onValueChange={(value) => handleStatusChange(value as ComplaintStatus)}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Выберите новый статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Новая</SelectItem>
                    <SelectItem value="pending_approval">На утверждении</SelectItem>
                    <SelectItem value="in_progress">На выполнении</SelectItem>
                    <SelectItem value="resolved">Выполнено</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Rating (Citizen Only) */}
          {role === 'citizen' && complaint.status === 'resolved' && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Оценить решение</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleRating(value)}
                      className="text-2xl transition-transform hover:scale-110"
                    >
                      {value <= (complaint.rating || 0) ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Создано</p>
                <p className="font-medium text-foreground">{complaint.createdBy.name}</p>
              </div>
              {complaint.assignedTo && (
                <div>
                  <p className="text-muted-foreground">Назначено</p>
                  <p className="font-medium text-foreground">{complaint.assignedTo.name}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground">ID жалобы</p>
                <p className="font-mono text-foreground text-xs break-all">{complaint.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
