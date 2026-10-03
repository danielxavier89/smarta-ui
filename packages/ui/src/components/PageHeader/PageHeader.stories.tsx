import type { Meta, StoryObj } from "@storybook/react-vite";
import { Upload as UploadIcon } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Button } from "../Button";
import { Chip } from "../Chip";
import { docsPage } from "../../lib/docs";
import rules from "./PageHeader.md?raw";

const meta = {
  title: "Navigation/PageHeader",
  component: PageHeader,
  parameters: docsPage(rules),
  args: {
    title: "June charges",
    description: "53 charges on the statement. 41 have a receipt behind them.",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const nowhere = (e: React.MouseEvent) => e.preventDefault();

export const Playground: Story = {
  args: { actions: <Button variant="primary">Upload a receipt</Button> },
};

/** Only one of these renders an h1 per page in real life; here each is its own header for comparison. */
export const Variants: Story = {
  render: () => (
    <div className="sui:flex sui:flex-col sui:gap-[40px]">
      <PageHeader
        title="June charges"
        meta={<Chip tone="warn">2 days to file</Chip>}
        description="53 charges on the statement. 41 have a receipt behind them."
        breadcrumbs={[
          { label: "Accounting", href: "#accounting", onClick: nowhere },
          { label: "2026", href: "#2026", onClick: nowhere },
        ]}
        actions={
          <>
            <Button>Export</Button>
            <Button variant="primary" iconLeft={<UploadIcon size={14} />}>
              Upload a receipt
            </Button>
          </>
        }
      />
      <PageHeader
        title="Café Miradouro"
        meta={<Chip tone="bad">No receipt</Chip>}
        description="9,50 € on 12 June, Visa ···· 4417."
        back={{ label: "Charges", href: "#charges", onClick: nowhere }}
        actions={<Button variant="primary">Upload the receipt</Button>}
      />
    </div>
  ),
};
