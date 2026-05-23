"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    key: "diario",
    label: "Diario",
    href: "/",
  },
  {
    key: "calendar",
    label: "Calendario",
    href: "/calendario",
  },
  {
    key: "metricas",
    label: "Métricas",
    href: "/metricas",
  },
];

function Icon({ active, type }: { active: boolean; type: string }) {
  const color = active ? "var(--color-primary)" : "var(--color-text-secondary)";
  const props = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: active ? color : "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "diario") {
    return (
      <svg {...props}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg {...props}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <line x1="6" y1="18" x2="6" y2="8" />
      <line x1="12" y1="18" x2="12" y2="4" />
      <line x1="18" y1="18" x2="18" y2="12" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.key}
            href={item.href}
            className="flex flex-col items-center gap-xs"
          >
            <Icon active={active} type={item.key} />
            <span
              className={
                active
                  ? "text-label-sm text-primary"
                  : "text-label-sm text-text-secondary"
              }
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
