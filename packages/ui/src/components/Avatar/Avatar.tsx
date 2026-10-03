import * as React from "react";
import { Avatar as RAvatar } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const avatarVariants = cva(
  "sui:relative sui:grid sui:shrink-0 sui:place-items-center sui:overflow-hidden sui:font-semibold sui:select-none",
  {
    variants: {
      /**
       * Shape carries the distinction, not colour: a circle is a person, a
       * rounded square is an organisation. It reads instantly, survives
       * greyscale, and costs no new token — which matters because the
       * backoffice has no hue to spend on it.
       */
      kind: {
        person: "sui:rounded-full sui:bg-accent-soft sui:text-accent-soft-fg",
        institution: "sui:rounded-md sui:bg-surface-sunken sui:text-fg-muted",
      },
      size: {
        xs: "sui:size-[22px] sui:text-[9.5px]",
        sm: "sui:size-[26px] sui:text-[10.5px]",
        md: "sui:size-[30px] sui:text-[11.5px]",
        lg: "sui:size-[40px] sui:text-sm",
        xl: "sui:size-[56px] sui:text-lg",
      },
    },
    defaultVariants: { size: "md", kind: "person" },
  },
);

/** "Ana Ribeiro" -> "AR", "Contabilis" -> "CO". Never more than two letters. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof avatarVariants> {
  /** Always required, even with an image — it is the fallback and the alt. */
  name: string;
  /**
   * A photograph for a person, or a logo for an organisation.
   *
   * Bundle it. Never point this at a third-party logo service: the request
   * tells whoever hosts it which banks and authorities this client deals with,
   * which is exactly the sort of thing a client portal must not leak.
   */
  src?: string;
  /** A status dot on the corner: online, blocked, verified. */
  status?: "ok" | "warn" | "bad";
}

/**
 * A person, as a circle.
 *
 * The rule both prototypes settled on: a photograph is for someone the user has
 * to recognise, initials for everyone else. Ana the accountant gets a face; the
 * tax authority and the banks get letters. The person holding the screen gets
 * letters too — they know who they are.
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { className, size, kind, name, src, status, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(avatarVariants({ size, kind }), className)} {...props}>
      <RAvatar.Root className="sui:contents">
        {src && (
          <RAvatar.Image
            src={src}
            alt={name}
            // A face is cropped to fill; a logo is fitted, because cropping a
            // wordmark cuts letters off it.
            className={cn(
              "sui:size-full",
              kind === "institution" ? "sui:object-contain sui:p-[3px]" : "sui:object-cover",
            )}
          />
        )}
        <RAvatar.Fallback
          // No delay: the initials are the design, not a placeholder waiting
          // for a photograph that in most cases does not exist.
          delayMs={src ? 200 : 0}
          className="sui:grid sui:size-full sui:place-items-center"
        >
          <span aria-hidden>{initialsOf(name)}</span>
          <span className="sui:sr-only">{name}</span>
        </RAvatar.Fallback>
      </RAvatar.Root>
      {status && (
        <span
          aria-hidden
          className={cn(
            "sui:absolute sui:bottom-0 sui:right-0 sui:size-[8px] sui:rounded-full sui:ring-2 sui:ring-surface",
            { ok: "sui:bg-ok", warn: "sui:bg-warn", bad: "sui:bg-bad" }[status],
          )}
        />
      )}
    </span>
  );
});

export interface AvatarStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shown left to right, overlapping. Anything past `max` becomes "+n". */
  people: Array<{ name: string; src?: string }>;
  max?: number;
  size?: AvatarProps["size"];
}

/** Several people in the space of about two. */
export function AvatarStack({ people, max = 4, size = "sm", className, ...props }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <div className={cn("sui:flex sui:items-center", className)} {...props}>
      {shown.map((p, i) => (
        <Avatar
          key={`${p.name}-${i}`}
          name={p.name}
          src={p.src}
          size={size}
          className={cn("sui:ring-2 sui:ring-surface", i > 0 && "sui:-ml-[8px]")}
        />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            avatarVariants({ size, kind: "person" }),
            "sui:-ml-[8px] sui:bg-surface-sunken sui:text-fg-muted sui:ring-2 sui:ring-surface",
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}

export { avatarVariants };
