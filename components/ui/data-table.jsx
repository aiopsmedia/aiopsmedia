'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Pagination } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';

function useSorting(columns, initialSort) {
  const [sort, setSort] = React.useState(initialSort || { key: null, direction: 'asc' });

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        if (prev.direction === 'desc') return { key: null, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedData = React.useMemo(() => {
    if (!sort.key) return null;
    return (data) => {
      return [...data].sort((a, b) => {
        const aVal = typeof sort.key === 'function' ? sort.key(a) : a[sort.key];
        const bVal = typeof sort.key === 'function' ? sort.key(b) : b[sort.key];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'string') {
          const cmp = aVal.localeCompare(bVal);
          return sort.direction === 'asc' ? cmp : -cmp;
        }
        const cmp = aVal - bVal;
        return sort.direction === 'asc' ? cmp : -cmp;
      });
    };
  }, [sort.key, sort.direction]);

  return { sort, toggleSort, sortedData };
}

function usePagination({ totalItems, initialPageSize = 10 }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const paginatedSlice = React.useCallback(
    (data) => {
      const start = (currentPage - 1) * pageSize;
      return data.slice(start, start + pageSize);
    },
    [currentPage, pageSize]
  );

  return { currentPage, setCurrentPage, pageSize, setPageSize, totalPages, paginatedSlice };
}

function DataTable({
  columns,
  data = [],
  searchable = true,
  searchPlaceholder = "Search...",
  searchKeys,
  loading = false,
  emptyTitle = "No results",
  emptyDescription = "No data available yet.",
  selectable = false,
  bulkActions,
  pageSize: initialPageSize = 10,
  initialSort,
  onRowClick,
  mobileRenderCard,
  className,
}) {
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState(new Set());

  const { sort, toggleSort, sortedData } = useSorting(columns, initialSort);
  const { currentPage, setCurrentPage, pageSize, setPageSize, totalPages, paginatedSlice } = usePagination({
    totalItems: data.length,
    initialPageSize,
  });

  const filteredData = React.useMemo(() => {
    if (!search || !searchKeys?.length) return data;
    const lower = search.toLowerCase();
    return data.filter((row) =>
      searchKeys.some((key) => {
        const val = typeof key === 'function' ? key(row) : row[key];
        return val != null && String(val).toLowerCase().includes(lower);
      })
    );
  }, [data, search, searchKeys]);

  const sorted = sortedData?.(filteredData) ?? filteredData;
  const paginated = paginatedSlice(sorted);

  const allPageSelected = paginated.length > 0 && paginated.every((row) => selected.has(row.id));
  const somePageSelected = paginated.some((row) => selected.has(row.id));

  const toggleSelectAll = () => {
    if (allPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((row) => next.delete(row.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((row) => next.add(row.id));
        return next;
      });
    }
  };

  const toggleSelectRow = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedRows = React.useMemo(
    () => data.filter((row) => selected.has(row.id)),
    [data, selected]
  );

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        {searchable && <Skeleton className="h-10 w-64" />}
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-8 h-9"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); setCurrentPage(1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC]"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        {selected.size > 0 && bulkActions && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#94A3B8]">{selected.size} selected</span>
            {bulkActions.map((action) => (
              <Button
                key={action.label}
                variant={action.variant || "outline"}
                size="sm"
                onClick={() => action.onClick(selectedRows)}
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <ScrollArea className="w-full">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b border-[rgba(148,163,184,0.15)]">
                  <tr>
                    {selectable && (
                      <th className="w-10 px-3 py-3">
                        <Checkbox
                          checked={allPageSelected ? true : somePageSelected ? 'indeterminate' : false}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </th>
                    )}
                    {columns.map((col) => (
                      <th
                        key={col.key || col.header}
                        className={cn(
                          "px-3 py-3 text-left font-medium text-[#94A3B8]",
                          col.sortable && "cursor-pointer select-none hover:text-[#F8FAFC] transition-colors"
                        )}
                        style={col.width ? { width: col.width } : undefined}
                        onClick={col.sortable ? () => toggleSort(col.key) : undefined}
                      >
                        <div className="flex items-center gap-1">
                          {col.header}
                          {col.sortable && (
                            <span className="inline-flex">
                              {sort.key === col.key && sort.direction === 'asc' ? (
                                <ChevronUp className="h-3.5 w-3.5 text-[#22D3EE]" />
                              ) : sort.key === col.key && sort.direction === 'desc' ? (
                                <ChevronDown className="h-3.5 w-3.5 text-[#22D3EE]" />
                              ) : (
                                <ChevronsUpDown className="h-3.5 w-3.5 text-[#94A3B8]/50" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((row, rowIdx) => (
                    <tr
                      key={row.id || rowIdx}
                      className={cn(
                        "border-b border-[rgba(148,163,184,0.07)] transition-colors",
                        "hover:bg-[#111827]/50",
                        selected.has(row.id) && "bg-[#22D3EE]/5",
                        onRowClick && "cursor-pointer"
                      )}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                    >
                      {selectable && (
                        <td className="w-10 px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selected.has(row.id)}
                            onCheckedChange={() => toggleSelectRow(row.id)}
                            aria-label={`Select row ${row.id}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td key={col.key || col.header} className="px-3 py-3 text-[#F8FAFC]" style={col.width ? { width: col.width } : undefined}>
                          {col.render ? col.render(row) : row[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.map((row, rowIdx) => (
              <div
                key={row.id || rowIdx}
                className={cn(
                  "rounded-lg border border-[rgba(148,163,184,0.15)] bg-[#0B1220] p-4 space-y-2",
                  selected.has(row.id) && "border-[#22D3EE]/30 bg-[#22D3EE]/5"
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {mobileRenderCard ? (
                  mobileRenderCard(row, columns)
                ) : (
                  <div className="space-y-1">
                    {columns.map((col) => (
                      <div key={col.key || col.header} className="flex items-center justify-between text-sm">
                        <span className="text-[#94A3B8]">{col.header}</span>
                        <span className="text-[#F8FAFC] font-medium text-right">
                          {col.render ? col.render(row) : row[col.key]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sorted.length}
            pageSize={pageSize}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          />
        </>
      )}
    </div>
  );
}

export { DataTable };
