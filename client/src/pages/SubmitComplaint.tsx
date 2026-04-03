import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle, Upload, X, Sparkles, Lightbulb } from 'lucide-react';
import { analyzeComplaint, analyzeImage, autofillFromImage, getConfidenceLabel, getProcessingTime } from '@/lib/aiSimulation';
import { CATEGORY_CONFIG, URGENCY_CONFIG, ALMATY_DISTRICTS } from '@/../../shared/types';
import { Complaint, ComplaintCategory, UrgencyLevel } from '@/../../shared/types';
import { nanoid } from 'nanoid';

export default function SubmitComplaint() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { addComplaint } = useComplaints();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ComplaintCategory | '',
    district: '',
    lat: 43.2381,
    lng: 76.9453,
  });

  const [images, setImages] = useState<string[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  const [autofillHint, setAutofillHint] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'analysis' | 'success'>('form');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setImages((prev) => [...prev, result]);
          
          // Analyze first image and autofill form
          if (images.length === 0) {
            const imgAnalysis = analyzeImage(result);
            setImageAnalysis(imgAnalysis);
            
            // Autofill form data
            const autofill = autofillFromImage(imgAnalysis.detectedObjects);
            setFormData((prev) => ({
              ...prev,
              title: autofill.title,
              description: autofill.description,
            }));
            setAutofillHint(autofill.hint);
          }
          
          toast.success('Фото загружено и проанализировано');
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (index === 0) {
      setImageAnalysis(null);
      setAutofillHint('');
      setFormData((prev) => ({
        ...prev,
        title: '',
        description: '',
      }));
    }
  };

  const handleAnalyze = async () => {
    if (!formData.title || !formData.description || !formData.category || !formData.district) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    setIsAnalyzing(true);

    // Simulate processing time
    const processingTime = getProcessingTime();
    await new Promise((resolve) => setTimeout(resolve, processingTime));

    // Text analysis
    const textAnalysis = analyzeComplaint(formData.title, formData.description);
    setAiAnalysis(textAnalysis);

    setStep('analysis');
    setIsAnalyzing(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newComplaint: Complaint = {
      id: nanoid(),
      title: formData.title,
      description: formData.description,
      category: formData.category as ComplaintCategory,
      status: 'new',
      urgency: aiAnalysis.urgency as UrgencyLevel,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user!,
      location: {
        lat: formData.lat,
        lng: formData.lng,
        address: `${formData.district}, Алматы`,
        district: formData.district,
      },
      images: images,
      comments: [],
    };

    addComplaint(newComplaint);
    setStep('success');
    setIsSubmitting(false);

    setTimeout(() => {
      navigate(`/complaint/${newComplaint.id}`);
    }, 2000);
  };

  if (step === 'success') {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-12 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-[#27AE60]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-[#27AE60]" size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Жалоба успешно подана!
              </h2>
              <p className="text-muted-foreground mb-8">
                Спасибо за вашу активность. Ваша жалоба отправлена на рассмотрение.
              </p>
              <div className="bg-muted p-4 rounded-lg mb-8">
                <p className="text-sm text-muted-foreground">
                  Номер жалобы: <span className="font-mono font-bold text-foreground">{formData.title.substring(0, 3).toUpperCase()}-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                Перенаправление на страницу жалобы...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'analysis') {
    return (
      <div className="container py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={20} className="text-[#E67E22]" />
                Анализ жалобы
              </CardTitle>
              <CardDescription>
                Система проанализировала вашу жалобу с помощью ИИ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Категория</h3>
                <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                  <span className="text-2xl">
                    {CATEGORY_CONFIG[aiAnalysis.category as ComplaintCategory]?.icon === 'Leaf' && '🌿'}
                    {CATEGORY_CONFIG[aiAnalysis.category as ComplaintCategory]?.icon === 'Home' && '🏠'}
                    {CATEGORY_CONFIG[aiAnalysis.category as ComplaintCategory]?.icon === 'Building2' && '🏢'}
                    {CATEGORY_CONFIG[aiAnalysis.category as ComplaintCategory]?.icon === 'Car' && '🚗'}
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">
                      {CATEGORY_CONFIG[aiAnalysis.category as ComplaintCategory]?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Уверенность: {Math.round(aiAnalysis.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Срочность</h3>
                <div
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{
                    backgroundColor:
                      URGENCY_CONFIG[aiAnalysis.urgency as UrgencyLevel]?.bgColor || '#f0f0f0',
                  }}
                >
                  <AlertCircle
                    size={24}
                    style={{
                      color: URGENCY_CONFIG[aiAnalysis.urgency as UrgencyLevel]?.color || '#666',
                    }}
                  />
                  <div>
                    <p
                      className="font-semibold"
                      style={{
                        color: URGENCY_CONFIG[aiAnalysis.urgency as UrgencyLevel]?.color || '#666',
                      }}
                    >
                      {URGENCY_CONFIG[aiAnalysis.urgency as UrgencyLevel]?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Приоритет обработки
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Analysis */}
              {imageAnalysis && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Sparkles size={16} className="text-[#E67E22]" />
                    Анализ фото
                  </h3>
                  <div className="p-4 bg-muted rounded-lg space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Обнаруженные объекты:</p>
                      <div className="flex flex-wrap gap-2">
                        {imageAnalysis.detectedObjects.map((obj: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-[#0B6E7F]/10 text-[#0B6E7F] rounded-full text-sm">
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Рекомендации:</p>
                      <ul className="space-y-1">
                        {imageAnalysis.suggestions.map((sug: string, idx: number) => (
                          <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                            <span className="text-[#27AE60] mt-1">✓</span>
                            {sug}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Department */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Рекомендуемый отдел</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-foreground font-medium">
                    {aiAnalysis.suggestedDepartment}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="flex-1"
                >
                  Назад
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#0B6E7F] hover:bg-[#0A5A6B] text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={16} />
                      Отправка...
                    </>
                  ) : (
                    'Подтвердить и отправить'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Подать новую жалобу</CardTitle>
            <CardDescription>
              Загрузите фото, и система автоматически заполнит форму с помощью ИИ анализа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Фото проблемы (обязательно)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-[#0B6E7F] transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
                  <p className="text-sm font-medium text-foreground">Нажмите для загрузки фото</p>
                  <p className="text-xs text-muted-foreground">или перетащите файлы сюда</p>
                </label>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Autofill Hint */}
              {autofillHint && (
                <div className="p-4 bg-[#E67E22]/10 border border-[#E67E22]/20 rounded-lg flex items-start gap-3">
                  <Lightbulb size={18} className="text-[#E67E22] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">{autofillHint}</p>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Заголовок жалобы *
              </label>
              <Input
                name="title"
                placeholder="Например: Засоренный парк на ул. Ауэзова"
                value={formData.title}
                onChange={handleInputChange}
                className="border-border"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Описание проблемы *
              </label>
              <Textarea
                name="description"
                placeholder="Подробно опишите проблему, что нужно исправить, и почему это важно"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className="border-border"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Категория *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecology">🌿 Экология</SelectItem>
                  <SelectItem value="housing">🏠 ЖКХ</SelectItem>
                  <SelectItem value="transport">🚗 Транспорт</SelectItem>
                  <SelectItem value="akimat">🏢 Акимат</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Район города *
              </label>
              <Select
                value={formData.district}
                onValueChange={(value) => handleSelectChange('district', value)}
              >
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Выберите район" />
                </SelectTrigger>
                <SelectContent>
                  {ALMATY_DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !images.length}
                className="flex-1 bg-[#0B6E7F] hover:bg-[#0A5A6B] text-white"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Анализ...
                  </>
                ) : (
                  'Далее: Анализ жалобы'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
