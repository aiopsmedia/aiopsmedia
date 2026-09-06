'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EmbeddedForm({ form }) {
  const router = useRouter();
  const [values, setValues] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState('');

  const fields = Array.isArray(form.fields) ? form.fields : [];

  const setValue = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess('');

    const nextErrors = {};
    for (const field of fields) {
      const value = values[field.key];
      const isEmpty =
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0);
      if (field.required && isEmpty) {
        nextErrors[field.key] = `${field.label} is required`;
      } else if (!isEmpty && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        nextErrors[field.key] = `Please enter a valid email for ${field.label}`;
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/forms/${form.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Submission failed');
      }

      if (data.redirectUrl) {
        router.push(data.redirectUrl);
        return;
      }

      setSuccess(data.message || form.successMessage || 'Thanks! Your submission has been received.');
      setValues({});
    } catch (err) {
      console.error('[form] submit error:', err);
      setErrors({ form: err?.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-[#22D3EE]/20 bg-[#22D3EE]/5 p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-[#22D3EE]" />
        <p className="mt-4 text-base font-medium text-[#F8FAFC]">{success}</p>
        <button
          type="button"
          onClick={() => setSuccess('')}
          className="mt-4 text-sm text-[#22D3EE] hover:underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-sm text-red-400">{errors.form}</p>
        </div>
      )}

      {fields.map((field) => {
        if (field.type === 'textarea') {
          return (
            <Textarea
              key={field.key}
              label={field.required ? `${field.label} *` : field.label}
              value={values[field.key] || ''}
              onChange={(e) => setValue(field.key, e.target.value)}
              placeholder={field.placeholder || ''}
              rows={4}
              error={errors[field.key]}
            />
          );
        }

        if (field.type === 'select') {
          return (
            <div key={field.key}>
              <label className="mb-1.5 block text-sm font-medium text-[#F8FAFC]">
                {field.required ? `${field.label} *` : field.label}
              </label>
              <Select value={values[field.key] || ''} onValueChange={(v) => setValue(field.key, v)}>
                <SelectTrigger>
                  <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {(field.options || []).map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors[field.key] && (
                <p className="mt-1.5 text-xs text-red-400">{errors[field.key]}</p>
              )}
            </div>
          );
        }

        if (field.type === 'checkbox') {
          return (
            <div key={field.key}>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={Boolean(values[field.key])}
                  onChange={(e) => setValue(field.key, e.target.checked)}
                  className="h-4 w-4 rounded border-[rgba(148,163,184,0.15)] bg-[#0B1220] text-[#22D3EE] focus:ring-[#22D3EE]/50"
                />
                <span className="text-sm font-medium text-[#F8FAFC]">
                  {field.required ? `${field.label} *` : field.label}
                </span>
              </label>
              {errors[field.key] && (
                <p className="mt-1.5 text-xs text-red-400">{errors[field.key]}</p>
              )}
            </div>
          );
        }

        return (
          <Input
            key={field.key}
            type={field.type}
            label={field.required ? `${field.label} *` : field.label}
            value={values[field.key] || ''}
            onChange={(e) => setValue(field.key, e.target.value)}
            placeholder={field.placeholder || ''}
            error={errors[field.key]}
          />
        );
      })}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] px-4 py-3 text-sm font-semibold text-[#050816] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Submit
          </>
        )}
      </button>
    </form>
  );
}