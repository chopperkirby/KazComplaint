import { Badge } from '@/components/ui/badge';
import { ComplaintCategory } from '@/../../shared/types';
import { CATEGORY_CONFIG } from '@/../../shared/types';

interface CategoryBadgeProps {
  category: ComplaintCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  return (
    <Badge
      className={className}
      style={{
        backgroundColor: config.color + '20',
        color: config.color,
      }}
    >
      {config.label}
    </Badge>
  );
}
