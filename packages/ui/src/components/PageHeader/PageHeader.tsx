import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLabels } from "../ThemeProvider";

export interface Crumb {
  label: React.ReactNode;
  /** A real URL, so it opens in a new tab and shows on hover. */
  href?: string;
  /** For a client-side router: call `e.preventDefault()` and navigate. */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The page's one h1. */
  title: React.ReactNode;
  /** One sentence that says where the page stands: "53 charges, 41 with a receipt." */
  description?: React.ReactNode;
  /** The page's primary action, and at most a secondary beside it. */
  actions?: React.ReactNode;
  /** Where this page sits. The current page is the title, not a crumb — leave it out. */
  breadcrumbs?: Crumb[];
  /** A single way up, instead of breadcrumbs: "Charges". Rendered as "‹ Charges". */
  back?: Crumb;
  /** Beside the title: a status Chip, a period. */
  meta?: React.ReactNode;
}

function CrumbLink({ crumb, className, children }: { crumb: Crumb; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={crumb.href}
      onClick={crumb.onClick}
      className={cn(
        "sui:inline-flex sui:items-center sui:gap-[2px] sui:rounded-xs sui:text-fg-subtle sui:no-underline sui:hover:text-fg sui:hover:underline",
        className,
      )}
    >
      {children}
    </a>
  );
}

/**
 * The top of a page: where it sits, what it is called, how it stands, and the
 * one thing to do here.
 *
 * It renders the page's h1. One per page, and every page has one — a screen
 * whose only heading is in the sidebar is a screen a screen reader user
 * cannot jump to the start of.
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  back,
  meta,
  className,
  ...props
}: PageHeaderProps) {
  const labels = useLabels();
  return (
    // A div, not <header>: outside <main> a <header> is the page's banner
    // landmark, and in a product's own shell there already is one.
    <div className={cn("sui:flex sui:flex-col sui:gap-[8px]", className)} {...props}>
      {back ? (
        <CrumbLink crumb={back} className="sui:-ml-[4px] sui:self-start sui:text-sm">
          <ChevronLeft size={15} aria-hidden />
          {back.label}
        </CrumbLink>
      ) : breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label={labels.breadcrumb}>
          <ol className="sui:m-0 sui:flex sui:list-none sui:flex-wrap sui:items-center sui:gap-[4px] sui:p-0 sui:text-sm">
            {breadcrumbs.map((c, i) => (
              <li key={i} className="sui:flex sui:items-center sui:gap-[4px]">
                {c.href || c.onClick ? <CrumbLink crumb={c}>{c.label}</CrumbLink> : <span className="sui:text-fg-subtle">{c.label}</span>}
                <ChevronRight size={13} aria-hidden className="sui:text-fg-faint" />
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
      <div className="sui:flex sui:flex-wrap sui:items-end sui:justify-between sui:gap-x-[16px] sui:gap-y-[12px]">
        <div className="sui:min-w-0 sui:flex-1 sui:basis-[280px]">
          <div className="sui:flex sui:flex-wrap sui:items-center sui:gap-x-[10px] sui:gap-y-[4px]">
            <h1 className="sui:m-0 sui:text-xl sui:font-semibold sui:tracking-tight sui:text-fg">{title}</h1>
            {meta}
          </div>
          {description && <p className="sui:m-0 sui:mt-[2px] sui:text-sm sui:text-fg-subtle">{description}</p>}
        </div>
        {actions && <div className="sui:flex sui:shrink-0 sui:flex-wrap sui:items-center sui:gap-[8px]">{actions}</div>}
      </div>
    </div>
  );
}
