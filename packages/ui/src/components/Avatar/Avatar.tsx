import * as React from "react";
import { Avatar as RAvatar } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-accent-soft text-accent-soft-fg font-semibold select-none",
  {
    variants: {
      size: {
        xs: "size-[22px] text-[9.5px]",
        sm: "size-[26px] text-[10.5px]",
        md: "size-[30px] text-[11.5px]",
        lg: "size-[40px] text-sm",
        xl: "size-[56px] text-lg",
      },
    },
    defaultVariants: { size: "md" },
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
  /** Always required, even with a photograph — it is the fallback and the alt. */
  name: string;
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
  { className, size, name, src, status, ...props },
  ref,
) {
  return (
    <span ref={ref} className={cn(avatarVariants({ size }), className)} {...props}>
      <RAvatar.Root className="contents">
        {src && (
          <RAvatar.Image
            src={src}
            alt={name}
            className="size-full object-cover"
          />
        )}
        <RAvatar.Fallback
          // No delay: the initials are the design, not a placeholder waiting
          // for a photograph that in most cases does not exist.
          delayMs={src ? 200 : 0}
          className="grid size-full place-items-center"
        >
          <span aria-hidden>{initialsOf(name)}</span>
          <span className="sr-only">{name}</span>
        </RAvatar.Fallback>
      </RAvatar.Root>
      {status && (
        <span
          aria-hidden
          className={cn(
            "absolute bottom-0 right-0 size-[8px] rounded-full ring-2 ring-surface",
            { ok: "bg-ok", warn: "bg-warn", bad: "bg-bad" }[status],
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
    <div className={cn("flex items-center", className)} {...props}>
      {shown.map((p, i) => (
        <Avatar
          key={`${p.name}-${i}`}
          name={p.name}
          src={p.src}
          size={size}
          className={cn("ring-2 ring-surface", i > 0 && "-ml-[8px]")}
        />
      ))}
      {rest > 0 && (
        <span
          className={cn(
            avatarVariants({ size }),
            "-ml-[8px] bg-surface-sunken text-fg-muted ring-2 ring-surface",
          )}
        >
          +{rest}
        </span>
      )}
    </div>
  );
}

export { avatarVariants };
