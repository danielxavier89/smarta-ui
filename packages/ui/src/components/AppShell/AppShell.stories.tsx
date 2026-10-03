import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard, FileText, Home, Landmark, Receipt, Settings } from "lucide-react";
import { AppShell, NavItem, NavGroup } from "./AppShell";
import { PageHeader } from "../PageHeader";
import { Button } from "../Button";
import { Avatar } from "../Avatar";
import { Card } from "../Card";
import { docsPage } from "../../lib/docs";
import rules from "./AppShell.md?raw";

const meta = {
  title: "Navigation/AppShell",
  component: AppShell,
  parameters: { layout: "fullscreen", ...docsPage(rules) },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const nowhere = (e: React.MouseEvent) => e.preventDefault();
const brand = <span className="sui:text-lg sui:font-semibold sui:tracking-tight sui:text-fg">smarta</span>;

export const TheFrame: Story = {
  name: "The frame",
  args: { nav: null, children: null },
  render: () => (
    <AppShell
      brand={brand}
      nav={
        <>
          <NavGroup>
            <NavItem href="#overview" onClick={nowhere} icon={<Home size={16} />}>
              Overview
            </NavItem>
          </NavGroup>
          <NavGroup label="Accounting">
            <NavItem href="#charges" onClick={nowhere} icon={<CreditCard size={16} />} active count={12}>
              Charges
            </NavItem>
            <NavItem href="#receipts" onClick={nowhere} icon={<Receipt size={16} />}>
              Receipts
            </NavItem>
            <NavItem href="#returns" onClick={nowhere} icon={<FileText size={16} />} count={1}>
              Tax returns
            </NavItem>
            <NavItem href="#banks" onClick={nowhere} icon={<Landmark size={16} />}>
              Bank accounts
            </NavItem>
          </NavGroup>
        </>
      }
      navFooter={
        <NavItem href="#settings" onClick={nowhere} icon={<Settings size={16} />}>
          Settings
        </NavItem>
      }
      topBar={<Avatar name="Lena Brandt" size="sm" />}
    >
      <div className="sui:flex sui:flex-col sui:gap-[20px]">
        <PageHeader
          title="June charges"
          description="53 charges on the statement. 41 have a receipt behind them."
          actions={<Button variant="primary">Upload a receipt</Button>}
        />
        <Card className="sui:p-[20px] sui:text-sm sui:text-fg-muted">
          The page goes here. Press Tab from the top of the frame to see the skip link.
        </Card>
      </div>
    </AppShell>
  ),
};
