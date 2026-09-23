import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarStack } from "./Avatar";
import { docsPage } from "../../lib/docs";
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

export const PeopleAndInstitutions: Story = {
  name: "People and institutions",
  render: () => (
    <div className="flex flex-col gap-[16px]">
      <div className="flex items-center gap-[12px]">
        <Avatar name="Ana Ribeiro" />
        <Avatar name="Stella Weiss" />
        <Avatar name="Lena Hoffmann" status="warn" />
      </div>
      <div className="flex items-center gap-[12px]">
        <Avatar kind="institution" name="Autoridade Tributária" />
        <Avatar kind="institution" name="Millennium BCP" />
        <Avatar kind="institution" name="Revolut" />
        <Avatar kind="institution" name="Finanzamt Berlin" status="ok" />
      </div>
      <p className="m-0 max-w-[64ch] text-sm text-fg-subtle">
        Shape carries the distinction, not colour: a circle is a person, a rounded square is
        an organisation. It reads at a glance, survives greyscale, and costs no new token —
        which matters, because the backoffice has no hue to spend on it. Switch Compare to
        &ldquo;Webapp + backoffice&rdquo; and both still separate cleanly.
      </p>
    </div>
  ),
};

export const WithImages: Story = {
  name: "With a photograph or a logo",
  render: () => (
    <div className="flex flex-col gap-[14px]">
      <div className="flex items-center gap-[12px]">
        <Avatar size="lg" name="Ana Ribeiro" />
        <Avatar size="lg" kind="institution" name="Revolut" />
      </div>
      <p className="m-0 max-w-[64ch] text-sm text-fg-subtle">
        A face is cropped to fill the circle; a logo is fitted inside the square, because
        cropping a wordmark cuts letters off it. Both fall back to initials, with no flash
        of an empty shape. Bundle the file — never point <code className="text-fg">src</code>{" "}
        at a third-party logo service, because the request tells whoever hosts it which
        banks this client deals with.
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
