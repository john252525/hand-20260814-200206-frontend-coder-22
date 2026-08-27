'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThreadList } from '@/components/communications/thread-list';
import { Chat } from '@/components/communications/chat';
import { useThreads } from '@/lib/hooks/use-communications';
import { Search, MessageSquare } from 'lucide-react';

export default function CommunicationsPage() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const { data: threads, isLoading } = useThreads({ search });

  const selectedThread = threads?.find((t) => t.lot_supplier_id === selectedThreadId);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Коммуникации</h1>
          <p className="text-neutral-500 mt-1">Центр общения с поставщиками</p>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden">
        <div className="flex h-full">
          {/* Threads List */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск переписки..."
                  className="pl-9"
                />
              </div>
            </div>
            <ThreadList
              threads={threads || []}
              selectedId={selectedThreadId}
              onSelect={setSelectedThreadId}
              loading={isLoading}
            />
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedThread ? (
              <>
                <div className="p-4 border-b">
                  <div className="font-medium">{selectedThread.supplier_name}</div>
                  <div className="text-sm text-neutral-500">{selectedThread.tender_title}</div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <Chat
                    lotSupplierId={selectedThread.lot_supplier_id}
                    tenderId={selectedThread.tender_id}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-600">Выберите переписку</h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}