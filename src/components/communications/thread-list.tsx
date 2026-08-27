import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils/cn';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Thread } from '@/lib/api/communications';

interface ThreadListProps {
  threads: Thread[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export function ThreadList({ threads, selectedId, onSelect, loading }: ThreadListProps) {
  if (loading) return <div className="p-4 text-sm text-neutral-500">Загрузка...</div>;
  if (!threads?.length) return <div className="p-4 text-sm text-neutral-500">Нет переписок</div>;

  return (
    <ScrollArea className="h-full">
      <div className="divide-y">
        {threads.map((thread) => (
          <button
            key={thread.lot_supplier_id}
            onClick={() => onSelect(thread.lot_supplier_id)}
            className={cn(
              'w-full text-left p-4 hover:bg-neutral-50 transition-colors',
              selectedId === thread.lot_supplier_id && 'bg-primary-50'
            )}
          >
            <div className="flex justify-between items-start">
              <span className="font-medium">{thread.supplier_name}</span>
              {thread.unread_count > 0 && <Badge variant="destructive">{thread.unread_count}</Badge>}
            </div>
            <span className="text-sm text-neutral-500 truncate block mt-1">{thread.last_message}</span>
            <span className="text-xs text-neutral-400">
              {formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: true, locale: ru })}
            </span>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}