import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title = 'Нет данных', description = 'Здесь пока ничего нет', action }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-12 w-12 text-neutral-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-neutral-500 mb-4">{description}</p>
        {action && (
          <Button onClick={action.onClick}>{action.label}</Button>
        )}
      </CardContent>
    </Card>
  );
}