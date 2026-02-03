import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function LearningBreadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-2 text-sm text-muted-foreground mb-4",
        className,
      )}
    >
      <Link
        href="/subjects"
        className="flex items-center hover:text-primary transition-colors"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Subjects Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-primary transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
