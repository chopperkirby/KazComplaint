// User roles
export type UserRole = 'citizen' | 'government';

// Complaint status
export type ComplaintStatus = 'new' | 'pending_approval' | 'in_progress' | 'resolved';

// Complaint category
export type ComplaintCategory = 'ecology' | 'housing' | 'akimat' | 'transport';

// Complaint urgency
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

// User type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  district?: string;
  department?: string;
}

// Complaint type
export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  urgency: UrgencyLevel;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  assignedTo?: User;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
  };
  images: string[];
  comments: Comment[];
  rating?: number;
  isDuplicate?: boolean;
  duplicateOf?: string;
}

// Comment type
export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
  attachments?: string[];
}

// Dashboard stats
export interface DashboardStats {
  totalComplaints: number;
  newComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  averageResolutionTime: number;
  satisfactionRate: number;
  complaintsByCategory: Record<ComplaintCategory, number>;
  complaintsByDistrict: Record<string, number>;
  complaintsByStatus: Record<ComplaintStatus, number>;
}

// AI Analysis result
export interface AIAnalysis {
  category: ComplaintCategory;
  urgency: UrgencyLevel;
  isDuplicate: boolean;
  duplicateId?: string;
  confidence: number;
  suggestedDepartment: string;
}

// Filter options
export interface ComplaintFilters {
  status?: ComplaintStatus[];
  category?: ComplaintCategory[];
  urgency?: UrgencyLevel[];
  district?: string[];
  assignedTo?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
}

// Districts in Almaty
export const ALMATY_DISTRICTS = [
  'Alatau',
  'Auezov',
  'Bostandyk',
  'Turksib',
  'Almaly',
  'Medeu',
  'Chimkent',
  'Saryarka',
];

// Category labels and colors
export const CATEGORY_CONFIG: Record<ComplaintCategory, { label: string; color: string; icon: string }> = {
  ecology: { label: 'Экология', color: '#27AE60', icon: 'Leaf' },
  housing: { label: 'ЖКХ', color: '#3498DB', icon: 'Home' },
  akimat: { label: 'Акимат', color: '#E67E22', icon: 'Building2' },
  transport: { label: 'Транспорт', color: '#9B59B6', icon: 'Car' },
};

// Status labels and colors
export const STATUS_CONFIG: Record<ComplaintStatus, { label: string; color: string; bgColor: string }> = {
  new: { label: 'Новая', color: '#0B6E7F', bgColor: '#E0F2F1' },
  pending_approval: { label: 'На утверждении', color: '#E67E22', bgColor: '#FEF3E2' },
  in_progress: { label: 'На выполнении', color: '#3498DB', bgColor: '#E3F2FD' },
  resolved: { label: 'Выполнено', color: '#27AE60', bgColor: '#E8F5E9' },
};

// Urgency labels and colors
export const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Низкая', color: '#95A5A6', bgColor: '#ECEFF1' },
  medium: { label: 'Средняя', color: '#F39C12', bgColor: '#FFF3E0' },
  high: { label: 'Высокая', color: '#E74C3C', bgColor: '#FFEBEE' },
  critical: { label: 'Критическая', color: '#C0392B', bgColor: '#FFCDD2' },
};
