---
kind: recipe
screen: a form, or a multi-step flow
components: [Field, Input, Textarea, Select, RadioGroup, Checkbox, Dropzone, Callout, Button, Dialog, Toast]
---

# A form

## Shape

```
Callout       only when a rule applies before they start (locked period, blockers)
Field*        the questions, in the order the user thinks about them
Callout       the summary error, only after a failed submit
actions       ghost Cancel · ONE primary that names the outcome
```

## Validation, exactly

The house pattern, and the only one:

1. Silent while the field is first being typed in.
2. Validate on **blur**.
3. Once it has shown an error, re-validate on **every keystroke**, so the message
   clears the instant it is fixed.

Never scold mid-word; never make someone blur again to learn they got it right.

```tsx
const [touched, setTouched] = useState(false);
const bad = touched && value.length !== 9;

<Input
  label="NIF"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  onBlur={() => setTouched(true)}
  error={bad ? `A NIF is nine digits. This one has ${value.length}.` : undefined}
  hint="Nine digits, no spaces."
/>
```

## Choosing the control

| The answer is | Use |
|---|---|
| Short free text | `Input` |
| More than a line | `Textarea` |
| One of many, stored | `Select` |
| One of ≤5 that deserve reading | `RadioGroup` (`appearance="card"` for fat choices) |
| Independent yes/no | `Checkbox` |
| Files | `Dropzone` |
| Something we do not have | `Field` with your own control |

## Rules

- **Optional is marked; required is not.**
- **The error replaces the hint.** Never both.
- **One primary button**, and it names the outcome: "Convert Petra", not "Submit".
- **Money and dates** — the product formats them; `prefix="€"`, native date input.
- **Submitting is not a toast.** If the result is visible on the page, the page
  says it. A toast is only for a change that happened off-screen.
- **Failure lands in place** — a `Callout` above the actions, plus the field
  errors. Never only a toast.
- **A destructive submit** ("Reject & tell the customer") opens a `Dialog` first,
  and the dialog's description says what happens to other people.

## Multi-step

- Each step is a `PanelSection` in one `Panel`, or one `Dialog` per question —
  never a wizard that is its own component.
- The footer shows **Back** as a ghost and the forward action as the one primary,
  named for what the step does ("Match them", not "Next") where it does something.
- Progress across steps: only if the number of steps is fixed and knowable. If it
  is, `Progress` with `showLabel`; if not, say "Step 2" in the subtitle.
- **Leaving mid-flow loses work → it is a `Dialog`, not a `Panel`.**

## Skeleton

```tsx
<form onSubmit={onSubmit} className="flex max-w-[420px] flex-col gap-[16px]">
  {locked && (
    <Callout tone="neutral" title="May 2026 is closed">
      <p>Ana filed it on 18 June. You can still <TextLink>ask her to reopen it</TextLink>.</p>
    </Callout>
  )}

  <Input label="Company name" value={name} onChange={…} onBlur={…} error={…} />
  <Input label="Trading name" optional hint="Only if it differs from the legal name." />
  <Select label="Bundesland" options={laender} placeholder="Choose one" />
  <RadioGroup label="How was this asset paid for?" options={…} appearance="card" />
  <Textarea label="What should Ana know?" rows={3} />

  {submitFailed && (
    <Callout tone="bad" title="We could not save this">
      <p>The tax number is already on another company. Check it and try again.</p>
    </Callout>
  )}

  <div className="flex gap-[8px]">
    <Button variant="ghost" type="button" onClick={cancel}>Cancel</Button>
    <Button variant="primary" type="submit" loading={saving} className="ml-auto">
      Convert Petra
    </Button>
  </div>
</form>
```
