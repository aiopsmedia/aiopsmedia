'use client';

import { useEffect, useRef, useState } from 'react';
import { Briefcase, Users, Calendar, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultStats = [
  { icon: Briefcase, value: 50, suffix: '+', label: 'Projects Completed', color: '#22D3EE' },
  { icon: Users, value: 30, suffix: '+', label: 'Happy Clients', color: '#8B5CF6' },
  { icon: Calendar, value: 5, suffix: '+', label: 'Years Experience', color: '#A78BFA' },
  { icon: ThumbsUp, value: 99, suffix: '%', label: 'Client Satisfaction', color: '#22D3EE' },
];

function useCountUp(end, duration, started) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    let raf;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, started]);

  return count;
}

function StatItem({ icon: Icon, value, suffix, label, color }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 2000, visible);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <div
        className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-[#94A3B8]">{label}</div>
    </div>
  );
}

function StatsSection({ stats }) {
  const items = stats && stats.length > 0 ? stats : defaultStats;

  return (
    <section className="bg-[#0B1220] py-20 sm:py-28" aria-labelledby="stats-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {items.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { StatsSection };
