import { Badge } from '@/components/ui/badge';
import { ComplaintStatus } from '@/../../shared/types';
import { STATUS_CONFIG } from '@/../../shared/types';

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
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
