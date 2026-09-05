'use client';

import * as React from 'react';
import { Bot, Send, X, Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const SUGGESTIONS = [
  'What services do you offer?',
  'Tell me about your ERP products',
  'How much does website development cost?',
  'Can you help with AI automation?',
];

export default function AiChatbot() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  const send = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-8),
        }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message || 'Sorry, I could not process that. Please try again.',
          links: data.links || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again in a moment.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6] text-[#050816] shadow-2xl shadow-[#22D3EE]/30 transition-transform duration-200 hover:scale-105"
        aria-label="Open AI assistant"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-7 w-7" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[540px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-[rgba(148,163,184,0.15)] bg-[#0B1220] shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 border-b border-[rgba(148,163,184,0.15)] bg-gradient-to-r from-[#22D3EE]/10 to-[#8B5CF6]/10 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] to-[#8B5CF6]">
              <Sparkles className="h-4 w-4 text-[#050816]" />
            </span>
            <div>
              <p className="text-sm font-semibold text-[#F8FAFC]">AI Assistant</p>
              <p className="text-xs text-[#94A3B8]">Powered by Groq · RAG</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
            </span>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#111827]">
                    <Bot className="h-4 w-4 text-[#22D3EE]" />
                  </span>
                  <div className="rounded-xl rounded-tl-sm bg-[#111827] px-3 py-2 text-sm text-[#94A3B8]">
                    Hi! I&apos;m the AIOpsMedia assistant. Ask me about our services, products, pricing, or anything else!
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-[rgba(148,163,184,0.15)] bg-[#111827]/40 px-3 py-1.5 text-xs text-[#94A3B8] transition-colors hover:border-[#22D3EE]/40 hover:text-[#22D3EE]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={cn('flex items-start gap-2', m.role === 'user' && 'justify-end')}>
                {m.role === 'assistant' && (
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#111827]">
                    <Bot className="h-4 w-4 text-[#22D3EE]" />
                  </span>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed',
                    m.role === 'user'
                      ? 'rounded-tr-sm bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816]'
                      : 'rounded-tl-sm bg-[#111827] text-[#F8FAFC]'
                  )}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  {m.links?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="rounded-full bg-[#22D3EE]/10 px-2 py-0.5 text-xs text-[#22D3EE] hover:bg-[#22D3EE]/20"
                        >
                          {link.label.replace(/^(Service|Product|Blog|Case Study|Page|FAQ):\s*/, '')}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2">
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#111827]">
                  <RefreshCw className="h-4 w-4 animate-spin text-[#22D3EE]" />
                </span>
                <div className="rounded-xl rounded-tl-sm bg-[#111827] px-3 py-2 text-sm text-[#94A3B8]">
                  Thinking with Groq...
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[rgba(148,163,184,0.15)] p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, pricing, products..."
                className="min-w-0 flex-1 rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#050816] px-3 py-2 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8]/50 focus:border-[#22D3EE]/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#22D3EE] to-[#8B5CF6] text-[#050816] transition-opacity disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}