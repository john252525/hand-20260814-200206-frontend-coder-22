export const navigation = [
  {
    title: 'Основное',
    items: [
      { key: 'dashboard', label: 'Дашборд', href: '/', icon: 'dashboard' },
      { key: 'tenders', label: 'Тендеры', href: '/tenders', icon: 'tenders' },
      { key: 'suppliers', label: 'Поставщики', href: '/suppliers', icon: 'suppliers' },
    ],
  },
  {
    title: 'Работа',
    items: [
      { key: 'communications', label: 'Коммуникации', href: '/communications', icon: 'communications' },
      { key: 'offers', label: 'КП', href: '/offers', icon: 'offers' },
      { key: 'negotiations', label: 'Переговоры', href: '/negotiations', icon: 'negotiations' },
      { key: 'decisions', label: 'Решения', href: '/decisions', icon: 'decisions' },
    ],
  },
  {
    title: 'Анализ',
    items: [
      { key: 'analytics', label: 'Аналитика', href: '/analytics', icon: 'analytics' },
      { key: 'tasks', label: 'Задачи', href: '/tasks', icon: 'tasks' },
      { key: 'files', label: 'Файлы', href: '/files', icon: 'files' },
    ],
  },
  {
    title: 'Система',
    items: [
      { key: 'settings', label: 'Настройки', href: '/settings', icon: 'settings' },
      { key: 'admin', label: 'Администрирование', href: '/admin', icon: 'admin' },
    ],
  },
];