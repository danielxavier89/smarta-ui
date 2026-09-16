import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarStack } from "./Avatar";
import { docsPage } from "@/lib/docs";
import rules from "./Avatar.md?raw";

const meta = {
  title: "Status/Avatar",
  component: Avatar,
  parameters: docsPage(rules),
  args: { name: "Ana Ribeiro" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-[12px]">
      <Avatar size="xs" name="Erik Braun" />
      <Avatar size="sm" name="Michael Lang" />
      <Avatar size="md" name="Annekatrin Vogt" />
      <Avatar size="lg" name="Ana Ribeiro" />
      <Avatar size="xl" name="Stella Weiss" />
    </div>
  ),
};

export const InitialsAndStatus: Story = {
  render: () => (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-[12px]">
        <Avatar name="Ana Ribeiro" />
        <Avatar name="Autoridade Tributária" />
        <Avatar name="Revolut" />
        <Avatar name="Contabilis, Lda" status="ok" />
        <Avatar name="Lena Hoffmann" status="warn" />
      </div>
      <p className="m-0 max-w-[62ch] text-sm text-fg-subtle">
        A photograph is for someone the user has to recognise; initials for everyone else.
        The accountant gets a face. The tax authority and the banks get letters — and so
        does the person holding the screen, who knows who they are.
      </p>
    </div>
  ),
};

export const Stack: Story = {
  render: () => (
    <AvatarStack
      people={[
        { name: "Erik Braun" },
        { name: "Michael Lang" },
        { name: "Annekatrin Vogt" },
        { name: "Stella Weiss" },
        { name: "Juri Kern" },
        { name: "Ana Ribeiro" },
      ]}
      max={4}
    />
  ),
};
