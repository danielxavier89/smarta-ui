import { DayPicker, type DayPickerProps, type Locale } from "react-day-picker";
import { de, enGB, pt } from "react-day-picker/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, formatMonth, type SmartaLocale } from "../../lib/format";
import { useLabels, useLocale } from "../ThemeProvider";

/**
 * The calendar both date pickers open. Not exported on its own yet: it has no
 * job outside a picker until a product asks for an inline one.
 *
 * react-day-picker does the hard part — the ARIA grid, arrow keys across weeks,
 * PageUp/PageDown across months, Home/End across a week — and nothing visual:
 * its own stylesheet is not imported, every part is styled here with tokens.
 * Every word it says on its own is replaced with one of ours, because its
 * defaults ("Go to the Previous Month", "Today, …, selected") are English
 * whatever locale it is given.
 */
const DATE_FNS_LOCALES: Record<string, Locale> = {
  de,
  "de-DE": de,
  pt,
  "pt-PT": pt,
  en: enGB,
  "en-GB": enGB,
};

function dateFnsLocale(locale: SmartaLocale): Locale {
  return DATE_FNS_LOCALES[locale] ?? DATE_FNS_LOCALES[locale.split("-")[0]] ?? enGB;
}

const day =
  "sui:grid sui:size-[36px] sui:place-items-center sui:rounded-md sui:border-0 sui:bg-transparent sui:p-0 " +
  "sui:text-sm sui:tabular-nums sui:text-fg sui:cursor-pointer sui:hover:bg-surface-hover " +
  "sui:focus-visible:outline-2 sui:focus-visible:outline-offset-2 sui:focus-visible:outline-focus-ring " +
  "sui:disabled:cursor-not-allowed sui:disabled:hover:bg-transparent";

/** Omit, applied to each member of a union rather than collapsing it. DayPickerProps is a union keyed on mode. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

export type CalendarProps = DistributiveOmit<DayPickerProps, "locale"> & { locale?: SmartaLocale };

export function Calendar({ locale: localeProp, classNames, labels: dpLabels, ...props }: CalendarProps) {
  const labels = useLabels();
  const contextLocale = useLocale();
  const locale = localeProp ?? contextLocale;

  return (
    <DayPicker
      locale={dateFnsLocale(locale)}
      showOutsideDays={false}
      labels={{
        labelPrevious: () => labels.previousMonth,
        labelNext: () => labels.nextMonth,
        labelNav: () => labels.calendarNavigation,
        labelGrid: (date) => formatMonth(date, locale),
        labelDayButton: (date, modifiers) =>
          [
            formatDate(date, locale),
            modifiers.today ? labels.today : null,
            modifiers.selected ? labels.selected : null,
          ]
            .filter(Boolean)
            .join(", "),
        labelGridcell: (date, modifiers) =>
          [formatDate(date, locale), modifiers?.today ? labels.today : null].filter(Boolean).join(", "),
        ...dpLabels,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? <ChevronLeft size={16} aria-hidden /> : <ChevronRight size={16} aria-hidden />,
      }}
      classNames={{
        root: "sui:relative sui:p-[12px]",
        months: "sui:relative sui:flex sui:flex-col sui:gap-[16px] sui:sm:flex-row",
        month: "sui:flex sui:flex-col sui:gap-[8px]",
        month_caption: "sui:flex sui:h-[32px] sui:items-center sui:justify-center",
        caption_label: "sui:text-sm sui:font-medium sui:text-fg",
        nav: "sui:pointer-events-none sui:absolute sui:inset-x-[12px] sui:top-[12px] sui:z-[1] sui:flex sui:h-[32px] sui:items-center sui:justify-between",
        button_previous:
          "sui-touch-target sui:pointer-events-auto sui:grid sui:size-[32px] sui:place-items-center sui:rounded-md sui:border-0 sui:bg-transparent sui:text-fg-muted sui:cursor-pointer sui:hover:bg-surface-hover sui:hover:text-fg sui:disabled:opacity-40 sui:disabled:cursor-not-allowed",
        button_next:
          "sui-touch-target sui:pointer-events-auto sui:grid sui:size-[32px] sui:place-items-center sui:rounded-md sui:border-0 sui:bg-transparent sui:text-fg-muted sui:cursor-pointer sui:hover:bg-surface-hover sui:hover:text-fg sui:disabled:opacity-40 sui:disabled:cursor-not-allowed",
        chevron: "",
        month_grid: "sui:border-collapse",
        weekdays: "",
        weekday: "sui:size-[36px] sui:p-0 sui:text-2xs sui:font-medium sui:text-fg-subtle",
        weeks: "",
        week: "",
        day: "sui:size-[36px] sui:p-0 sui:text-center",
        day_button: day,
        today: "sui:[&>button]:font-semibold sui:[&>button]:underline sui:[&>button]:underline-offset-4",
        selected:
          "sui:[&>button]:bg-accent sui:[&>button]:text-accent-fg sui:[&>button]:hover:bg-accent-hover sui:[&>button]:no-underline",
        range_start: "sui:[&>button]:bg-accent sui:[&>button]:text-accent-fg",
        range_end: "sui:[&>button]:bg-accent sui:[&>button]:text-accent-fg",
        range_middle:
          "sui:[&>button]:rounded-none sui:[&>button]:bg-accent-soft sui:[&>button]:text-accent-soft-fg sui:[&>button]:hover:bg-accent-soft",
        disabled: "sui:[&>button]:text-fg-subtle sui:[&>button]:line-through",
        outside: "sui:[&>button]:text-fg-subtle",
        hidden: "sui:invisible",
        focused: "",
        ...classNames,
      }}
      {...props}
    />
  );
}

/** Today at midnight, so comparisons against picked dates are day-exact. */
export function startOfToday(): Date {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function sameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate());
}

