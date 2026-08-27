export const mockThreads = [
  {
    lot_supplier_id: 'supplier-1',
    supplier_name: 'ООО ТехноСнаб',
    tender_id: 'tender-1',
    tender_title: 'Поставка ноутбуков',
    last_message: 'Здравствуйте, направляем КП.',
    last_message_at: '2026-08-16T15:00:00Z',
    unread_count: 2,
  },
  {
    lot_supplier_id: 'supplier-2',
    supplier_name: 'АО ПромТорг',
    tender_id: 'tender-2',
    tender_title: 'Закупка крепежа',
    last_message: 'Уточните сроки поставки',
    last_message_at: '2026-08-16T09:00:00Z',
    unread_count: 0,
  },
] as const;