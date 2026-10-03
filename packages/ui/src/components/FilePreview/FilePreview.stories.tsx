import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilePreview, type FilePreviewProps } from "./FilePreview";
import { docsPage } from "../../lib/docs";
import rules from "./FilePreview.md?raw";

// An invented receipt, drawn inline so the story needs no asset and no network.
const lines = [
  ["Galão", "1,80"],
  ["Tosta mista", "3,90"],
  ["Água 0,5 l", "1,20"],
  ["Pastel de nata ×2", "2,60"],
];
const receipt = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="560" viewBox="0 0 360 560" font-family="monospace" font-size="15">
  <rect width="360" height="560" fill="#fffdf7"/>
  <text x="180" y="50" text-anchor="middle" font-size="20" font-weight="bold">Café Miradouro</text>
  <text x="180" y="76" text-anchor="middle">Rua das Gaivotas 14, Lisboa</text>
  <text x="180" y="98" text-anchor="middle">12/06/2026  09:42</text>
  <line x1="24" y1="118" x2="336" y2="118" stroke="#999" stroke-dasharray="4 4"/>
  ${lines.map(([a, b], i) => `<text x="24" y="${150 + i * 28}">${a}</text><text x="336" y="${150 + i * 28}" text-anchor="end">${b}</text>`).join("")}
  <line x1="24" y1="270" x2="336" y2="270" stroke="#999" stroke-dasharray="4 4"/>
  <text x="24" y="302" font-weight="bold">Total EUR</text><text x="336" y="302" text-anchor="end" font-weight="bold">9,50</text>
  <text x="24" y="330">IVA 23% incl.</text><text x="336" y="330" text-anchor="end">1,78</text>
  <text x="180" y="400" text-anchor="middle">Obrigado e volte sempre</text>
</svg>`)}`;

const meta = {
  title: "Containers/FilePreview",
  component: FilePreview,
  parameters: docsPage(rules),
  args: { src: receipt, name: "beleg-cafe-miradouro.jpg", type: "image/jpeg", size: 182_000, height: 420 },
} satisfies Meta<typeof FilePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (a: FilePreviewProps) => (
    <div className="sui:max-w-[480px]">
      <FilePreview {...a} />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="sui:grid sui:gap-[16px] sui:md:grid-cols-2">
      <FilePreview src={receipt} name="beleg-cafe-miradouro.jpg" type="image/jpeg" size={182_000} height={360} />
      <FilePreview src="/missing.jpg" name="beleg-verloren.jpg" type="image/jpeg" size={240_000} height={360} />
      <FilePreview src="/kontoauszug-juni.xlsx" name="kontoauszug-juni.xlsx" size={48_000} height={200} />
      <FilePreview src={receipt} name="beleg-intern.jpg" type="image/jpeg" height={200} downloadable={false} />
    </div>
  ),
};
