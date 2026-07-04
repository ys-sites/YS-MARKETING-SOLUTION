import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

const PANEL_EASE = [0.16, 1, 0.3, 1] as const;
const EXPAND_SPRING = { type: 'spring' as const, stiffness: 150, damping: 26, mass: 1.05 };
const COLLAPSE_SPRING = { type: 'spring' as const, stiffness: 190, damping: 30, mass: 1.1 };

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  className?: string;
  defaultOpenFirst?: boolean;
  items: FaqItem[];
  searchPlaceholder?: string;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text: string, query: string) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi'));

  return parts.map((part, index) =>
    part.toLowerCase() === normalizedQuery.toLowerCase() ? (
      <mark className="rounded-sm bg-brand-red-light text-brand-red" key={index}>
        {part}
      </mark>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}

function itemMatchesQuery(item: FaqItem, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return (
    item.question.toLowerCase().includes(normalizedQuery) ||
    item.answer.toLowerCase().includes(normalizedQuery)
  );
}

function getDefaultOpenId(items: FaqItem[], defaultOpenFirst: boolean) {
  return defaultOpenFirst && items[0] ? items[0].id : null;
}

interface FaqRowProps {
  isOpen: boolean;
  item: FaqItem;
  onToggle: () => void;
  panelId: string;
  query: string;
  triggerId: string;
}

function FaqRow({ isOpen, item, onToggle, panelId, query, triggerId }: FaqRowProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left outline-none cursor-pointer"
        id={triggerId}
        onClick={onToggle}
        type="button"
      >
        <span className="font-bold text-[15px] text-ink leading-6 tracking-tight">
          {highlightText(item.question, query)}
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            'mt-0.5 size-4 shrink-0 text-brand-red transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <motion.div
        animate={{ height: isOpen ? 'auto' : 0 }}
        aria-labelledby={triggerId}
        className="overflow-hidden"
        id={panelId}
        initial={false}
        role="region"
        transition={{ height: isOpen ? EXPAND_SPRING : COLLAPSE_SPRING }}
      >
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -6 }}
          aria-hidden={!isOpen}
          className="px-5 pb-5 text-[14px] text-muted leading-6"
          initial={false}
          transition={{
            opacity: { duration: isOpen ? 0.38 : 0.2, ease: PANEL_EASE, delay: isOpen ? 0.06 : 0 },
            y: isOpen ? EXPAND_SPRING : COLLAPSE_SPRING,
          }}
        >
          {highlightText(item.answer, query)}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function FaqAccordion({
  className,
  defaultOpenFirst = false,
  items,
  searchPlaceholder = 'Search FAQs...',
}: FaqAccordionProps) {
  const listId = useId();
  const wasSearchingRef = useRef(false);

  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(() => getDefaultOpenId(items, defaultOpenFirst));

  const normalizedQuery = query.trim();
  const isSearching = normalizedQuery.length > 0;

  const visibleItems = useMemo(() => items.filter((item) => itemMatchesQuery(item, query)), [items, query]);

  useEffect(() => {
    if (isSearching) {
      wasSearchingRef.current = true;
      setOpenId((current) => {
        if (current && visibleItems.some((item) => item.id === current)) return current;
        return visibleItems[0]?.id ?? null;
      });
      return;
    }

    if (wasSearchingRef.current) {
      wasSearchingRef.current = false;
      setOpenId(getDefaultOpenId(items, defaultOpenFirst));
    }
  }, [defaultOpenFirst, isSearching, items, visibleItems]);

  const toggleItem = useCallback((id: string) => {
    setOpenId((current) => (current === id ? null : id));
  }, []);

  return (
    <div className={cn('mx-auto flex w-full max-w-2xl flex-col gap-3', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-400" aria-hidden />
        <input
          aria-label={searchPlaceholder}
          className="h-12 w-full appearance-none rounded-full border border-zinc-200 bg-white pl-11 pr-11 text-[15px] text-ink shadow-none outline-none placeholder:text-zinc-400 focus:border-brand-red/40 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label="Clear search"
            className="absolute top-1/2 right-3 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-ink cursor-pointer"
            onClick={() => setQuery('')}
            type="button"
          >
            <X aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-2.5">
        <AnimatePresence initial={false} mode="popLayout">
          {visibleItems.length > 0 ? (
            visibleItems.map((item) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                initial={{ opacity: 0, y: 4 }}
                key={item.id}
                layout="position"
                transition={{ duration: 0.2, ease: PANEL_EASE }}
              >
                <FaqRow
                  isOpen={openId === item.id}
                  item={item}
                  onToggle={() => toggleItem(item.id)}
                  panelId={`${listId}-${item.id}-panel`}
                  query={query}
                  triggerId={`${listId}-${item.id}-trigger`}
                />
              </motion.div>
            ))
          ) : (
            <motion.p
              animate={{ opacity: 1 }}
              className="px-2 py-8 text-center text-[14px] text-muted"
              initial={{ opacity: 0 }}
              key="empty"
            >
              No FAQs match your search.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
