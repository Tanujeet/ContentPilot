// components/ui/sidebar-nav.tsx
"use client";
import { cn } from "@/lib/utils";
import {
  IconFileText,
  IconLayout,
  IconWand,
  IconCalendar,
  IconHistory,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { label: "Posts", href: "/posts", icon: <IconFileText size={18} /> },
  { label: "Templates", href: "/templates", icon: <IconLayout size={18} /> },
  { label: "Generate", href: "/generate", icon: <IconWand size={18} /> },
  { label: "Schedule", href: "/schedule", icon: <IconCalendar size={18} /> },
  { label: "History", href: "/history", icon: <IconHistory size={18} /> },
];

export const SidebarNav = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-[250px] shrink-0 bg-[#1A1325] text-white flex flex-col justify-between py-6 px-4">
      <div>
        <nav className="flex flex-col gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[#2B1C47] transition text-sm",
                pathname === link.href && "bg-[#2B1C47]"
              )}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-2">
        <Link
          href="/posts/new"
          className="bg-[#8A63F8] hover:bg-[#9e78fa] transition text-white text-sm font-medium flex items-center justify-center gap-2 py-2 rounded-md"
        >
          <IconPlus size={16} />
          New Post
        </Link>
      </div>
    </aside>
  );
};
