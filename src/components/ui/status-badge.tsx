import { Badge } from '@/components/ui/badge';
import { TENDER_STATUS_CONFIG } from '@/config/constants';
import { cn } from '@/lib/utils/cn';
import {
  Sparkles,
  FileDown,
  FileCheck,
  Cog,
  Brain,
  CheckCircle,
  HelpCircle,
  XCircle,
  Calculator,
  Gauge,
  Search,
  Radar,
  Users,
  UserX,
  FileClock,
  Send,
  FilePartial,
  FileFull,
  Handshake,
  ClipboardCheck,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  FileDown,
  FileCheck,
  Cog,
  Brain,
  CheckCircle,
  HelpCircle,
  XCircle,
  Calculator,
  Gauge,
  Search,
  Radar,
  Users,
  UserX,
  FileClock,
  Send,
  FilePartial,
  FileFull,
  Handshake,
  ClipboardCheck,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
};

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const config = TENDER_STATUS_CONFIG[status as keyof typeof TENDER_STATUS_CONFIG];

  if (!config) {
    return <Badge variant="secondary">{status}</Badge>;
  }

  const Icon = iconMap[config.icon] || CheckCircle;
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <Badge
      variant="outline"
      className={cn(sizeClasses[size], 'gap-1.5 font-medium', className)}
      style={{
        backgroundColor: config.color,
        color: config.textColor,
        borderColor: config.textColor + '33',
      }}
    >
      <Icon className={cn('h-3.5 w-3.5', size === 'lg' && 'h-4 w-4')} />
      {config.label}
    </Badge>
  );
}