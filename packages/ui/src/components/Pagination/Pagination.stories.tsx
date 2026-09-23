import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";
import { docsPage } from "../../lib/docs";
import rules from "./Pagination.md?raw";

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  parameters: docsPage(rules),
  args: { page: 1, pageCount: 1, onPageChange: () => {} },
} satisfies Meta<typeof Pagination>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Playground() {
    const [page, setPage] = React.useState(6);
    return (
      <div className="max-w-[560px]">
        <Pagination page={page} pageCount={20} onPageChange={setPage} totalItems={398} pageSize={20} />
      </div>
    );
  },
};

export const FewPages: Story = {
  render: function Few() {
    const [page, setPage] = React.useState(2);
    return (
      <div className="max-w-[420px]">
        <Pagination page={page} pageCount={4} onPageChange={setPage} totalItems={68} pageSize={20} />
      </div>
    );
  },
};

export const ArrowsOnly: Story = {
  render: function Arrows() {
    const [page, setPage] = React.useState(3);
    return (
      <div className="max-w-[340px]">
        <Pagination page={page} pageCount={9} onPageChange={setPage} showNumbers={false} totalItems={172} pageSize={20} />
      </div>
    );
  },
};

export const AtTheEnds: Story = {
  name: "At the first and last page",
  render: function AtTheEnds() {
    return (
      <div className="flex max-w-[560px] flex-col gap-[20px]">
        <Pagination page={1} pageCount={9} onPageChange={() => {}} totalItems={172} pageSize={20} />
        <Pagination page={9} pageCount={9} onPageChange={() => {}} totalItems={172} pageSize={20} />
        <p className="m-0 text-sm text-fg-subtle">
          The arrow that has nowhere to go is disabled rather than hidden, so the control
          keeps its shape and the row does not shift under the pointer between the first
          page and the second. This is the one disabled state that needs no written
          reason: "there is no page before the first" is not news to anybody.
        </p>
      </div>
    );
  },
};
