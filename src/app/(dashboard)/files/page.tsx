'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { useFiles, useUploadFile, useDeleteFile, useDownloadFile } from '@/lib/hooks/use-files';
import { formatFileSize } from '@/lib/utils/format';
import { useDropzone } from 'react-dropzone';
import { Upload, Trash, Download } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { FileRecord } from '@/lib/api/files';

export default function FilesPage() {
  const { data: files, isLoading, refetch } = useFiles();
  const uploadMut = useUploadFile();
  const deleteMut = useDeleteFile();
  const downloadMut = useDownloadFile();
  const [selectedEntityType, setSelectedEntityType] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => uploadMut.mutate({ file, entityType: selectedEntityType || undefined }));
  }, [uploadMut, selectedEntityType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const columns: ColumnDef<FileRecord, unknown>[] = [
    { accessorKey: 'filename', header: 'Имя' },
    { accessorKey: 'content_type', header: 'Тип' },
    { accessorKey: 'file_size', header: 'Размер', cell: ({ row }) => formatFileSize(row.original.file_size) },
    { accessorKey: 'upload_date', header: 'Дата', cell: ({ row }) => new Date(row.original.upload_date).toLocaleString() },
    { id: 'actions', header: '', cell: ({ row }) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={() => downloadMut.mutate(row.original.id)}><Download className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={() => deleteMut.mutate(row.original.id)}><Trash className="h-4 w-4" /></Button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Файлы</h1>
      <Card>
        <CardHeader><CardTitle>Загрузка</CardTitle></CardHeader>
        <CardContent>
          <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400'}`}>
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-neutral-400 mb-4" />
            <p className="text-lg font-medium">{isDragActive ? 'Отпустите файлы' : 'Перетащите файлы или нажмите'}</p>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium">Тип сущности (необязательно)</label>
            <input
              className="mt-1 w-full p-2 border rounded-md"
              placeholder="tender"
              value={selectedEntityType}
              onChange={(e) => setSelectedEntityType(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <DataTable columns={columns} data={files || []} loading={isLoading} onRetry={refetch} />
        </CardContent>
      </Card>
    </div>
  );
}