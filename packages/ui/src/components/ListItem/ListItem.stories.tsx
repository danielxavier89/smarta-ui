import type { Meta, StoryObj } from "@storybook/react-vite";
import { ListItem, List } from "./ListItem";
import { Avatar } from "../Avatar";
import { Chip } from "../Chip";
import { Button } from "../Button";
import { docsPage } from "../../lib/docs";
import rules from "./ListItem.md?raw";

const meta = {
  title: "Containers/ListItem",
  component: ListItem,
  parameters: docsPage(rules),
  args: { title: "A row" },
} satisfies Meta<typeof ListItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Messages: Story = {
  render: () => (
    <div className="max-w-[560px]">
      <List>
        <ListItem
          clickable
          unread
          leading={<Avatar name="Ana Ribeiro" />}
          title="About the Lisbon Coffee charge"
          description="Could you tell me whether the €12.10 on 5 June was a client meeting?"
          meta="2h ago"
        />
        <ListItem
          clickable
          leading={<Avatar name="Autoridade Tributária" />}
          title="Modelo 22 acknowledgement"
          description="Your submission for 2025 was accepted."
          meta="Yesterday"
        />
        <ListItem
          clickable
          leading={<Avatar name="Millennium BCP" />}
          title="Statement ready"
          description="June statement for ···· 9021."
          meta="3 Jul"
        />
      </List>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div className="max-w-[560px]">
      <List>
        <ListItem
          leading={<Chip tone="warn" dot>Waiting</Chip>}
          title="Revolut ···· 7731 statement"
          description="The only thing still missing for June."
          actions={<Button size="sm" variant="primary">Upload it</Button>}
        />
        <ListItem
          leading={<Chip tone="ok" dot>In</Chip>}
          title="Millennium ···· 9021 statement"
          description="Received on 3 July."
          actions={<Button size="sm" variant="ghost">View</Button>}
        />
      </List>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="max-w-[560px]">
      <List>
        <ListItem clickable title="Normal" description="Hover me." />
        <ListItem clickable selected title="Selected" description="The row a panel is open for." />
        <ListItem clickable unread title="Unread" description="Bolder title, a dot before it." />
        <ListItem disabled title="Locked" description="May 2026 is closed." />
      </List>
    </div>
  ),
};
