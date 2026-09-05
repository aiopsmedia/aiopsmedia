'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react';
import { formatCurrency, slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalDescription } from '@/components/ui/modal';
import { Package } from 'lucide-react';
import { createProduct, updateProduct, deleteProduct, toggleProduct } from '@/actions/cms';

const emptyForm = {
  title: '',
  slug: '',
  serviceId: '',
  shortDescription: '',
  price: '',
  originalPrice: '',
  image: '',
  category: '',
  ctaText: 'Request Demo',
  order: 0,
};

export default function ProductsManager({ initialProducts, services }) {
  const router = useRouter();
  const [products, setProducts] = React.useState(initialProducts);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState(emptyForm);
  const [loading, setLoading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      title: product.title,
      slug: product.slug,
      serviceId: product.serviceId || '',
      shortDescription: product.shortDescription || '',
      price: product.price != null ? String(product.price) : '',
      originalPrice: product.originalPrice != null ? String(product.originalPrice) : '',
      image: product.image || '',
      category: product.category || '',
      ctaText: product.ctaText || 'Request Demo',
      order: product.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    setLoading(true);
    const payload = { ...form, slug: form.slug || slugify(form.title) };
    try {
      const res = editing ? await updateProduct(editing.id, payload) : await createProduct(payload);
      if (res?.error) toast.error(res.error);
      else {
        toast.success(editing ? 'Product updated' : 'Product created');
        setModalOpen(false);
        router.refresh();
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, checked) => {
    const res = await toggleProduct(id, checked);
    if (res?.error) toast.error(res.error);
    else router.refresh();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await deleteProduct(deleteId);
      if (res?.error) toast.error(res.error);
      else {
        toast.success('Product deleted');
        setDeleteId(null);
        router.refresh();
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Products</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">Manage your product catalog.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <EmptyState icon={Package} title="No products" description="Add your first product to get started." action="Add Product" onAction={openCreate} />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="flex h-40 items-center justify-center bg-[#111827]/40">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                ) : (
                  <ImageOff className="h-10 w-10 text-[#94A3B8]/30" />
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-[#F8FAFC]">{product.title}</p>
                  <Badge variant={product.isActive ? 'success' : 'outline'}>{product.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                {product.shortDescription && (
                  <p className="mt-1 line-clamp-2 text-sm text-[#94A3B8]">{product.shortDescription}</p>
                )}
                <p className="mt-2 text-sm text-[#94A3B8]">
                  {product.service?.title || 'No service'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-semibold text-[#F8FAFC]">
                    {product.price != null ? formatCurrency(product.price) : '—'}
                  </span>
                  {product.originalPrice != null && (
                    <span className="text-xs text-[#94A3B8] line-through">{formatCurrency(product.originalPrice)}</span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-[rgba(148,163,184,0.1)] pt-3">
                  <Switch checked={product.isActive} onCheckedChange={(c) => handleToggle(product.id, c)} />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => setDeleteId(product.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <ModalHeader>
            <ModalTitle>{editing ? 'Edit Product' : 'Add Product'}</ModalTitle>
            <ModalDescription>Fill in the product details below.</ModalDescription>
          </ModalHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Title *" value={form.title} onChange={(e) => setField('title', e.target.value)} />
              <Input label="Slug" value={form.slug} onChange={(e) => setField('slug', e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">Link to Service</label>
              <select
                value={form.serviceId}
                onChange={(e) => setField('serviceId', e.target.value)}
                className="flex h-10 w-full rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]/50"
              >
                <option value="">None</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.title}</option>
                ))}
              </select>
            </div>
            <Textarea label="Short Description" value={form.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Price" type="number" value={form.price} onChange={(e) => setField('price', e.target.value)} />
              <Input label="Original Price" type="number" value={form.originalPrice} onChange={(e) => setField('originalPrice', e.target.value)} />
            </div>
            <Input label="Image URL" value={form.image} onChange={(e) => setField('image', e.target.value)} />
            <Input label="Category" value={form.category} onChange={(e) => setField('category', e.target.value)} />
            <ModalFooter>
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" loading={loading}>{editing ? 'Update' : 'Create'}</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <Modal open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Delete Product</ModalTitle>
            <ModalDescription>Are you sure you want to delete this product?</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} loading={loading}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
