import { Badge } from '@/components/ui/badge';
import { UrgencyLevel } from '@/../../shared/types';
import { URGENCY_CONFIG } from '@/../../shared/types';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
}

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const config = URGENCY_CONFIG[urgency];
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
    >
      {config.label}
    </Badge>
  );
}
