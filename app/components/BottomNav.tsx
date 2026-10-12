"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "../lib/i18n";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();

  const items = [
    { label: t.navHome, href: "/" },
    { label: t.navChat, href: "/chat" },
    { label: t.navReports, href: "/reports" },
    { label: t.navFamily, href: "/family" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 flex w-full max-w-[390px] -translate-x-1/2 justify-around bg-white py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium ${
            pathname === item.href ? "text-primary" : "text-muted"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}