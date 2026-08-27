export const mockFiles = [
  {
    id: 'file-1',
    filename: 'Техническое задание.docx',
    content_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    file_size: 15360,
    upload_date: '2026-08-15T10:00:00Z',
    entity_type: 'tender',
    entity_id: 'tender-1',
  },
  {
    id: 'file-2',
    filename: 'КП_поставщик.xlsx',
    content_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    file_size: 20480,
    upload_date: '2026-08-16T12:30:00Z',
    entity_type: 'offer',
    entity_id: 'offer-1',
  },
] as const;