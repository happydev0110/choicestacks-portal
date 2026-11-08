"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BookIcon, SportIcon } from "./sportsbook-icons";
import { ESPORT_IDS, FIXTURES, SPORTS, type SportId } from "./sportsbook-data";
import styles from "./sportsbook.module.css";

export function ScrollFilters({
  children,
  label,
  selected,
  large = false,
}: {
  children: ReactNode;
  label: string;
  selected: string;
  large?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const measure = () => {
    const el = track.current;
    if (el)
      setEdges({
        left: el.scrollLeft > 2,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
      });
  };
  useEffect(() => {
    const el = track.current;
    const observer = new ResizeObserver(measure);
    const wheel = (event: WheelEvent) => {
      if (!el || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
      const next = Math.max(
        0,
        Math.min(el.scrollWidth - el.clientWidth, el.scrollLeft + event.deltaY),
      );
      if (next !== el.scrollLeft) {
        event.preventDefault();
        el.scrollLeft = next;
      }
    };
    if (el) observer.observe(el);
    el?.addEventListener("wheel", wheel, { passive: false });
    measure();
    return () => {
      observer.disconnect();
      el?.removeEventListener("wheel", wheel);
    };
  }, []);
  useEffect(() => {
    const el = track.current;
    const active = el?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (el && active) {
      const left = active.offsetLeft - el.offsetLeft;
      if (left < el.scrollLeft) el.scrollLeft = left;
      else if (left + active.offsetWidth > el.scrollLeft + el.clientWidth - 28)
        el.scrollLeft = left + active.offsetWidth - el.clientWidth + 28;
    }
    measure();
  }, [selected]);
  function scroll(direction: number) {
    const el = track.current;
    if (el)
      el.scrollBy({
        left: direction * el.clientWidth * 0.75,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }
  return (
    <div
      className={`${styles.scrollFilters} ${large ? styles.largeFilters : ""}`}
    >
      <div
        ref={track}
        className={styles.sportPills}
        role="group"
        aria-label={label}
        onScroll={measure}
      >
        {children}
      </div>
      {edges.left && (
        <button
          className={`${styles.scrollArrow} ${styles.scrollPrevious}`}
          aria-label={`Previous ${label.toLowerCase()}`}
          onClick={() => scroll(-1)}
        >
          <ChevronLeft size={16} />
        </button>
      )}
      {edges.right && (
        <button
          className={`${styles.scrollArrow} ${styles.scrollNext}`}
          aria-label={`More ${label.toLowerCase()}`}
          onClick={() => scroll(1)}
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

export function FilterDropdown({
  label,
  value,
  options,
  onChange,
  children,
}: {
  label: string;
  value: string;
  options: { value: string; label: string; count?: number }[];
  onChange: (value: string) => void;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  const active = options.find((option) => option.value === value);
  return (
    <div
      ref={root}
      className={styles.filterDropdown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
        if (
          ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key) &&
          open
        ) {
          event.preventDefault();
          const items = [
            ...(root.current?.querySelectorAll<HTMLButtonElement>(
              '[role="option"]',
            ) || []),
          ];
          const current = items.indexOf(
            document.activeElement as HTMLButtonElement,
          );
          const next =
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? items.length - 1
                : event.key === "ArrowDown"
                  ? (current + 1) % items.length
                  : (current - 1 + items.length) % items.length;
          items[next]?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (!open && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {children}
        <span>{active?.label}</span>
        {active?.count !== undefined && <small>{active.count}</small>}
        <BookIcon name="ic-rounded-arrow" size={16} />
      </button>
      {open && (
        <div className={styles.filterOptions} role="listbox" aria-label={label}>
          {options.map((option) => (
            <button
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
                trigger.current?.focus();
              }}
            >
              {option.label}
              {option.count !== undefined && <small>{option.count}</small>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SportsMenu({
  sport,
  onChoose,
  onClose,
}: {
  sport: SportId;
  onChoose: (sport: SportId) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState("Sports");
  return (
    <section
      className={styles.moreMenu}
      id="more-sports"
      aria-label="All sports"
    >
      <div className={styles.menuTabs} role="group" aria-label="Sport type">
        {["Sports", "Esports"].map((name) => (
          <button
            key={name}
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <button
        className={styles.closeSportsMenu}
        aria-label="Close sports menu"
        onClick={onClose}
      >
        <X size={18} />
      </button>
      <div className={styles.sportsMenuGrid}>
        {SPORTS.filter(
          (item) => ESPORT_IDS.includes(item.id) === (tab === "Esports"),
        ).map((item) => (
          <button
            key={item.id}
            aria-pressed={sport === item.id}
            onClick={() => onChoose(item.id)}
          >
            <SportIcon sport={item.id} size={32} />
            <span>{item.name}</span>
            <small>{FIXTURES.filter((f) => f.sport === item.id).length}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
