'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Upload, Trash2, File, FileText, Film, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils';

function formatFileSize(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(size >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { ClipboardCopy } from 'lucide-react';

function fileIcon(mime) {
  if (!mime) return File;
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime.startsWith('video/')) return Film;
  return FileText;
}

export default function MediaManager({ initialMedia }) {
  const [media, setMedia] = React.useState(initialMedia);
  const [selected, setSelected] = React.useState(null);
  const [deleteId, setDeleteId] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const results = [];
    for (const file of files) {
      const url = URL.createObjectURL(file);
      results.push({
        id: `local-${Date.now()}-${file.name}`,
        url,
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        createdAt: new Date().toISOString(),
      });
    }
    setMedia((prev) => [...results, ...prev]);
    setUploading(false);
    toast.success(`${results.length} file(s) added`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success('URL copied');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleDelete = () => {
    setMedia((prev) => prev.filter((m) => m.id !== deleteId));
    setDeleteId(null);
    toast.success('File removed');
  };

  const renderThumbnail = (m) => {
    if (m.mimeType?.startsWith('image/')) {
      return <img src={m.url} alt={m.filename} className="h-full w-full object-cover" />;
    }
    const Icon = fileIcon(m.mimeType);
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#111827]/60">
        <Icon className="h-8 w-8 text-[#94A3B8]" />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Media Library</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Upload and manage media files.</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" multiple hidden onChange={handleUpload} />
          <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      {media.length === 0 ? (
        <Card>
          <EmptyState icon={ImageIcon} title="No media files" description="Upload your first file to get started." action="Upload" onAction={() => fileInputRef.current?.click()} />
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {media.map((m) => (
            <Card key={m.id} className="group overflow-hidden">
              <button type="button" onClick={() => setSelected(m)} className="block h-36 w-full cursor-pointer overflow-hidden bg-[#0B1220]">
                {renderThumbnail(m)}
              </button>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-[#F8FAFC]" title={m.filename}>{m.filename}</p>
                <p className="mt-0.5 text-xs text-[#94A3B8]">{formatFileSize(m.size)} · {formatDate(m.createdAt)}</p>
                <div className="mt-2 flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyUrl(m.url)}>
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => setDeleteId(m.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!selected} onOpenChange={() => setSelected(null)}>
        <ModalContent className="sm:max-w-lg">
          <ModalHeader>
            <ModalTitle>{selected?.filename}</ModalTitle>
            <ModalDescription>{formatFileSize(selected?.size || 0)} · {selected?.mimeType}</ModalDescription>
          </ModalHeader>
          <div className="overflow-hidden rounded-lg bg-[#111827]/40">
            {selected?.mimeType?.startsWith('image/') ? (
              <img src={selected?.url} alt={selected?.filename} className="max-h-80 w-full object-contain" />
            ) : (
              <div className="flex h-40 items-center justify-center">
                {React.createElement(fileIcon(selected?.mimeType), { className: 'h-12 w-12 text-[#94A3B8]' })}
              </div>
            )}
          </div>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
            <Button onClick={() => copyUrl(selected?.url)}>
              <Copy className="h-4 w-4" /> Copy URL
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Remove File</ModalTitle>
            <ModalDescription>Are you sure you want to remove this file?</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Remove</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
