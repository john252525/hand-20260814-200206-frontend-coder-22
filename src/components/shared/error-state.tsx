import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Ошибка загрузки',
  description = 'Произошла ошибка при загрузке данных',
  onRetry,
}: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-neutral-500 mb-4">{description}</p>
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Повторить
          </Button>
        )}
      </CardContent>
    </Card>
  );
}