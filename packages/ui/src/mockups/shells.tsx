import * as React from "react";
import {
  Bell,
  CreditCard,
  FileText,
  Home,
  Inbox,
  Landmark,
  Receipt,
  Settings,
  Upload as UploadIcon,
  Users,
  BarChart3,
} from "lucide-react";
import { AppShell, NavItem, NavGroup } from "../components/AppShell";
import { Avatar } from "../components/Avatar";
import { IconButton } from "../components/IconButton";
import { SearchInput } from "../components/SearchInput";

/** Navigation in a mockup goes nowhere: it is a picture of a product, not one. */
const stay = (e: React.MouseEvent) => e.preventDefault();

function Wordmark({ product }: { product: string }) {
  return (
    <span className="sui:flex sui:items-baseline sui:gap-[6px]">
      <span className="sui:text-lg sui:font-semibold sui:tracking-tight sui:text-fg">smarta</span>
      <span className="sui:text-2xs sui:font-medium sui:text-fg-subtle">{product}</span>
    </span>
  );
}

export type WebappPage = "overview" | "charges" | "upload" | "return" | "settings";

/** The client-facing product's frame: Lena's view of her own business. */
export function WebappShell({ current, children }: { current: WebappPage; children: React.ReactNode }) {
  const item = (page: WebappPage, label: string, icon: React.ReactNode, count?: number) => (
    <NavItem href={`#${page}`} onClick={stay} icon={icon} active={current === page} count={count}>
      {label}
    </NavItem>
  );
  return (
    <AppShell
      brand={<Wordmark product="" />}
      nav={
        <>
          <NavGroup>{item("overview", "Overview", <Home size={16} />)}</NavGroup>
          <NavGroup label="Bookkeeping">
            {item("charges", "Charges", <CreditCard size={16} />, 7)}
            {item("upload", "Upload receipts", <UploadIcon size={16} />)}
          </NavGroup>
          <NavGroup label="Taxes">{item("return", "Tax return 2025", <FileText size={16} />, 2)}</NavGroup>
        </>
      }
      navFooter={item("settings", "Settings", <Settings size={16} />)}
      topBar={
        <>
          <IconButton variant="ghost" label="Notifications, 2 unread" icon={<Bell size={17} />} indicator />
          <Avatar name="Lena Brandt" size="sm" />
        </>
      }
    >
      {children}
    </AppShell>
  );
}

export type BackofficePage = "queue" | "clients" | "reports";

/** The internal tool's frame: Ana's view across every client. */
export function BackofficeShell({ current, children }: { current: BackofficePage; children: React.ReactNode }) {
  const item = (page: BackofficePage, label: string, icon: React.ReactNode, count?: number) => (
    <NavItem href={`#${page}`} onClick={stay} icon={icon} active={current === page} count={count}>
      {label}
    </NavItem>
  );
  return (
    <AppShell
      brand={<Wordmark product="backoffice" />}
      nav={
        <>
          <NavGroup label="Work">
            {item("queue", "Review queue", <Inbox size={16} />, 7)}
            {item("clients", "Clients", <Users size={16} />)}
          </NavGroup>
          <NavGroup label="Insight">
            {item("reports", "Reports", <BarChart3 size={16} />)}
            <NavItem href="#banks" onClick={stay} icon={<Landmark size={16} />}>
              Bank connections
            </NavItem>
            <NavItem href="#receipts" onClick={stay} icon={<Receipt size={16} />}>
              Unmatched receipts
            </NavItem>
          </NavGroup>
        </>
      }
      topBar={
        <>
          <SearchInput
            size="sm"
            label="Search clients"
            placeholder="Search clients"
            value=""
            onChange={() => {}}
            containerClassName="sui:hidden sui:w-[260px] sui:md:flex"
          />
          <Avatar name="Ana Ribeiro" size="sm" />
        </>
      }
    >
      {children}
    </AppShell>
  );
}

export const eur = (n: number, locale = "de-DE") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(n);
