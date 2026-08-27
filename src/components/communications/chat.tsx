'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMessages, useSendMessage } from '@/lib/hooks/use-communications';
import { formatDateTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import { Send, Paperclip, AlertCircle } from 'lucide-react';

export function Chat({ lotSupplierId, tenderId }: { lotSupplierId: string; tenderId: string }) {
  const { data: messages, isLoading, isError, refetch } = useMessages(lotSupplierId, tenderId);
  const sendMessage = useSendMessage();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      setError(null);
      await sendMessage.mutateAsync({
        lot_supplier_id: lotSupplierId,
        body_text: input.trim(),
        subject: '',
        message_type: 'manual',
      });
      setInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {isLoading && <div className="text-sm text-neutral-500">Загрузка...</div>}
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Не удалось загрузить сообщения. <button onClick={refetch} className="underline">Повторить</button></AlertDescription>
          </Alert>
        )}
        <div className="space-y-3">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[70%] rounded-lg p-3',
                msg.direction === 'outgoing' ? 'bg-primary-600 text-white ml-auto' : 'bg-neutral-100'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.body_text}</p>
              <span className={cn('text-xs mt-1 block', msg.direction === 'outgoing' ? 'text-primary-200' : 'text-neutral-400')}>
                {formatDateTime(msg.created_at)}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      {error && (
        <div className="px-4 text-sm text-red-600">{error}</div>
      )}
      <div className="border-t p-4 flex items-end gap-2">
        <Button variant="ghost" size="icon" type="button"><Paperclip className="h-5 w-5" /></Button>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Введите сообщение..."
          className="flex-1 min-h-[40px] max-h-[120px] resize-none"
          rows={1}
        />
        <Button onClick={handleSend} disabled={!input.trim() || sendMessage.isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}