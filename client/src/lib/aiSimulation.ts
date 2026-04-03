import { AIAnalysis, ComplaintCategory, UrgencyLevel } from '@/../../shared/types';

// Simulate AI analysis of complaint text
export function analyzeComplaint(title: string, description: string): AIAnalysis {
  const text = `${title} ${description}`.toLowerCase();

  // Category detection
  let category: ComplaintCategory = 'akimat';
  let categoryConfidence = 0.7;

  if (
    text.includes('дерево') ||
    text.includes('озеленение') ||
    text.includes('парк') ||
    text.includes('мусор') ||
    text.includes('загрязнение') ||
    text.includes('воздух') ||
    text.includes('вода') ||
    text.includes('экология') ||
    text.includes('спил') ||
    text.includes('посадка')
  ) {
    category = 'ecology';
    categoryConfidence = 0.85;
  } else if (
    text.includes('лифт') ||
    text.includes('крыша') ||
    text.includes('дом') ||
    text.includes('квартира') ||
    text.includes('жкх') ||
    text.includes('водопровод') ||
    text.includes('отопление') ||
    text.includes('электричество')
  ) {
    category = 'housing';
    categoryConfidence = 0.82;
  } else if (
    text.includes('автобус') ||
    text.includes('трамвай') ||
    text.includes('троллейбус') ||
    text.includes('машина') ||
    text.includes('машины') ||
    text.includes('дорога') ||
    text.includes('парковка') ||
    text.includes('транспорт')
  ) {
    category = 'transport';
    categoryConfidence = 0.8;
  }

  // Urgency detection
  let urgency: UrgencyLevel = 'low';
  if (
    text.includes('срочно') ||
    text.includes('критическ') ||
    text.includes('опасно') ||
    text.includes('угроза') ||
    text.includes('аварийно')
  ) {
    urgency = 'critical';
  } else if (
    text.includes('высокая') ||
    text.includes('важно') ||
    text.includes('требуется') ||
    text.includes('необходимо')
  ) {
    urgency = 'high';
  } else if (text.includes('средн') || text.includes('обычно')) {
    urgency = 'medium';
  }

  // Duplicate detection (simple keyword matching)
  const isDuplicate = text.split(' ').length < 15; // Very short descriptions might be duplicates
  const duplicateId = isDuplicate ? `complaint-${Math.floor(Math.random() * 100)}` : undefined;

  // Department suggestion
  let suggestedDepartment = 'Акимат';
  if (category === 'ecology') {
    suggestedDepartment = 'Департамент экологии';
  } else if (category === 'housing') {
    suggestedDepartment = 'Управление ЖКХ';
  } else if (category === 'transport') {
    suggestedDepartment = 'Управление транспорта';
  }

  return {
    category,
    urgency,
    isDuplicate: false, // Set to false to avoid false positives
    duplicateId,
    confidence: Math.min(categoryConfidence, 0.95),
    suggestedDepartment,
  };
}

// Simulate AI image analysis
export function analyzeImage(imageData: string): { detectedObjects: string[]; confidence: number; suggestions: string[] } {
  // Simulate image analysis - in real app would use vision API
  const detectedObjects = [
    'Грязь/мусор',
    'Поврежденная поверхность',
    'Растительность',
    'Дорожное покрытие',
    'Структура здания',
  ];

  const randomObjects = detectedObjects
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 1);

  const suggestions = [
    'Проблема требует немедленного внимания',
    'Рекомендуется осмотр на месте',
    'Возможна угроза безопасности',
    'Требуется техническая экспертиза',
    'Необходимо согласование с соседними отделами',
  ];

  const randomSuggestions = suggestions
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 2) + 1);

  return {
    detectedObjects: randomObjects,
    confidence: 0.75 + Math.random() * 0.2,
    suggestions: randomSuggestions,
  };
}

// Simulate AI confidence score animation
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.9) return 'Очень высокая уверенность';
  if (confidence >= 0.8) return 'Высокая уверенность';
  if (confidence >= 0.7) return 'Средняя уверенность';
  return 'Низкая уверенность';
}

// Simulate processing time
export function getProcessingTime(): number {
  return Math.random() * 2000 + 1000; // 1-3 seconds
}

// Simulate AI autofill from image
export function autofillFromImage(detectedObjects: string[]): { title: string; description: string; location: string; hint: string } {
  const objectsText = detectedObjects.join(', ').toLowerCase();

  let title = 'Проблема на улице';
  let description = 'Обнаружена проблема:';
  let location = 'Алматы, центральный район';
  let hint = '';

  // Determine title and description based on detected objects
  if (objectsText.includes('мусор') || objectsText.includes('грязь')) {
    title = 'Загрязнение территории';
    description = 'На территории обнаружено скопление мусора и загрязнение. Требуется уборка и санитарная обработка.';
    hint = 'Система определила проблему с загрязнением. Уточните место и добавьте детали о типе мусора.';
  } else if (objectsText.includes('поврежденная поверхность') || objectsText.includes('дорога')) {
    title = 'Повреждение дорожного покрытия';
    description = 'Обнаружено повреждение асфальта, ямы или трещины на дорожном покрытии. Требуется ремонт.';
    hint = 'Система определила проблему с дорогой. Укажите точное местоположение и размер повреждения.';
  } else if (objectsText.includes('растительность') || objectsText.includes('дерево')) {
    title = 'Проблема с озеленением';
    description = 'Обнаружена проблема с растительностью: поваленное дерево, сухие ветви или неухоженные насаждения.';
    hint = 'Система определила проблему с озеленением. Опишите, нужна ли обрезка, спил или посадка.';
  } else if (objectsText.includes('здание') || objectsText.includes('структура')) {
    title = 'Проблема с зданием или сооружением';
    description = 'Обнаружена проблема со зданием: повреждение фасада, крыши или других конструкций.';
    hint = 'Система определила проблему со зданием. Уточните, какая часть здания повреждена.';
  } else {
    title = 'Проблема на территории города';
    description = 'Обнаружена проблема на территории города. Требуется проверка и принятие мер.';
    hint = 'Система анализирует фото. Пожалуйста, уточните описание проблемы.';
  }

  return { title, description, location, hint };
}

// Generate AI recommendations for government employees
export function generateAIRecommendations(complaint: any): { priority: string; estimatedTime: string; suggestedActions: string[] } {
  const urgencyMap: Record<string, { priority: string; time: string }> = {
    critical: { priority: 'Критический', time: '1-2 часа' },
    high: { priority: 'Высокий', time: '1-3 дня' },
    medium: { priority: 'Средний', time: '3-7 дней' },
    low: { priority: 'Низкий', time: '7-14 дней' },
  };

  const categoryActions: Record<string, string[]> = {
    ecology: [
      'Провести осмотр территории',
      'Согласовать с Департаментом экологии',
      'Определить объем работ',
      'Составить смету',
    ],
    housing: [
      'Проверить техническое состояние',
      'Вызвать специалиста',
      'Согласовать с управляющей компанией',
      'Составить график работ',
    ],
    akimat: [
      'Направить в соответствующий отдел',
      'Провести предварительное совещание',
      'Определить ответственного',
      'Установить сроки выполнения',
    ],
    transport: [
      'Проверить техническое состояние транспорта',
      'Согласовать с Управлением транспорта',
      'Определить график ремонта',
      'Уведомить пассажиров',
    ],
  };

  const baseUrgency = complaint.urgency || 'medium';
  const urgencyInfo = urgencyMap[baseUrgency] || urgencyMap.medium;
  const actions = categoryActions[complaint.category] || categoryActions.akimat;

  return {
    priority: urgencyInfo.priority,
    estimatedTime: urgencyInfo.time,
    suggestedActions: actions.slice(0, 3),
  };
}
