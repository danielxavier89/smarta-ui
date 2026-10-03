/**
 * Sample data for the mockups. Invented, all of it: the studio, the people,
 * the suppliers and every amount. Storybook is published, so nothing here is
 * anybody's. There are deliberately no tax numbers; card and IBAN numbers are
 * masked to the last four.
 */

export type ChargeStatus = "matched" | "missing" | "waiting";

export interface Charge {
  id: string;
  date: Date;
  supplier: string;
  description: string;
  amount: number;
  category: string;
  account: string;
  status: ChargeStatus;
  receipt?: { name: string; size: number };
}

export const company = {
  name: "Brandt Grafikdesign",
  owner: "Lena Brandt",
  legalForm: "Einzelunternehmen",
  city: "Leipzig",
  address: "Karl-Heine-Straße 41, 04229 Leipzig",
  founded: new Date(2019, 2, 1),
  accountant: "Ana Ribeiro",
  vatFiling: "quarterly",
};

export const categories = [
  { value: "software", label: "Software and subscriptions" },
  { value: "office", label: "Office supplies" },
  { value: "travel", label: "Travel" },
  { value: "meals", label: "Meals and entertainment" },
  { value: "phone", label: "Phone and internet" },
  { value: "advice", label: "Legal and tax advice" },
  { value: "print", label: "Printing" },
  { value: "bank", label: "Bank fees" },
  { value: "rent", label: "Studio rent" },
];

export const categoryLabel = (v: string) => categories.find((c) => c.value === v)?.label ?? v;

const d = (day: number, month = 5) => new Date(2026, month, day);

export const charges: Charge[] = [
  { id: "c01", date: d(2), supplier: "Adobe Systems", description: "Creative Cloud, all apps", amount: 71.39, category: "software", account: "Visa ···· 4417", status: "matched", receipt: { name: "adobe-juni.pdf", size: 84_000 } },
  { id: "c02", date: d(2), supplier: "Druckerei Weidmann", description: "Business cards, 500", amount: 208.01, category: "print", account: "Girokonto ···· 2208", status: "missing" },
  { id: "c03", date: d(3), supplier: "Café Miradouro", description: "Client lunch, Hoffmann", amount: 48.5, category: "meals", account: "Visa ···· 4417", status: "matched", receipt: { name: "beleg-miradouro.jpg", size: 182_000 } },
  { id: "c04", date: d(4), supplier: "Deutsche Bahn", description: "Leipzig – Berlin, return", amount: 119.8, category: "travel", account: "Visa ···· 4417", status: "matched", receipt: { name: "db-ticket-0604.pdf", size: 96_000 } },
  { id: "c05", date: d(5), supplier: "Telekom", description: "Mobile and broadband", amount: 59.95, category: "phone", account: "Girokonto ···· 2208", status: "matched", receipt: { name: "telekom-juni.pdf", size: 120_000 } },
  { id: "c06", date: d(6), supplier: "Bürowelt Hansen", description: "Paper, toner", amount: 164.2, category: "office", account: "Visa ···· 4417", status: "missing" },
  { id: "c07", date: d(8), supplier: "Figma", description: "Professional, 1 seat", amount: 14.28, category: "software", account: "Visa ···· 4417", status: "matched", receipt: { name: "figma-invoice.pdf", size: 41_000 } },
  { id: "c08", date: d(9), supplier: "Hotel Seeblick", description: "Workshop, 1 night", amount: 132.0, category: "travel", account: "Visa ···· 4417", status: "waiting" },
  { id: "c09", date: d(10), supplier: "Kanzlei Vogt & Partner", description: "Contract review", amount: 380.8, category: "advice", account: "Girokonto ···· 2208", status: "matched", receipt: { name: "vogt-rechnung-118.pdf", size: 210_000 } },
  { id: "c10", date: d(11), supplier: "Taxi Krüger", description: "Hauptbahnhof – studio", amount: 18.4, category: "travel", account: "Visa ···· 4417", status: "missing" },
  { id: "c11", date: d(12), supplier: "Papeterie Lindqvist", description: "Sketchbooks", amount: 36.9, category: "office", account: "Visa ···· 4417", status: "matched", receipt: { name: "lindqvist.jpg", size: 160_000 } },
  { id: "c12", date: d(15), supplier: "Atelierhaus Plagwitz", description: "Studio rent, June", amount: 650.0, category: "rent", account: "Girokonto ···· 2208", status: "matched", receipt: { name: "miete-juni.pdf", size: 66_000 } },
  { id: "c13", date: d(16), supplier: "Sparkasse Leipzig", description: "Account fee", amount: 9.9, category: "bank", account: "Girokonto ···· 2208", status: "matched" },
  { id: "c14", date: d(18), supplier: "Restaurant Kuchenbäcker", description: "Team dinner", amount: 186.3, category: "meals", account: "Visa ···· 4417", status: "missing" },
  { id: "c15", date: d(19), supplier: "Google", description: "Workspace, 2 users", amount: 13.8, category: "software", account: "Visa ···· 4417", status: "matched", receipt: { name: "google-workspace.pdf", size: 38_000 } },
  { id: "c16", date: d(22), supplier: "Aral Tankstelle", description: "Fuel", amount: 71.2, category: "travel", account: "Visa ···· 4417", status: "waiting" },
  { id: "c17", date: d(24), supplier: "Druckerei Weidmann", description: "Poster proofs", amount: 94.5, category: "print", account: "Girokonto ···· 2208", status: "matched", receipt: { name: "weidmann-proofs.pdf", size: 102_000 } },
  { id: "c18", date: d(27), supplier: "Bürowelt Hansen", description: "Desk lamp", amount: 49.99, category: "office", account: "Visa ···· 4417", status: "missing" },
];

export const statusWord: Record<ChargeStatus, { tone: "ok" | "bad" | "warn"; label: string }> = {
  matched: { tone: "ok", label: "Receipt matched" },
  missing: { tone: "bad", label: "No receipt" },
  waiting: { tone: "warn", label: "Waiting on Ana" },
};

export const bankAccounts = [
  { id: "b1", bank: "Sparkasse Leipzig", name: "Girokonto", masked: "DE•• •••• •••• •••• 2208", status: "connected" as const, synced: "Today, 07:12" },
  { id: "b2", bank: "Visa (Sparkasse)", name: "Business card", masked: "···· 4417", status: "connected" as const, synced: "Today, 07:12" },
  { id: "b3", bank: "N26", name: "Tagesgeld", masked: "DE•• •••• •••• •••• 9031", status: "expired" as const, synced: "12 May 2026" },
];

export const team = [
  { id: "t1", name: "Lena Brandt", email: "lena@brandt-grafik.example", role: "Owner", lastSeen: "Online now" },
  { id: "t2", name: "Jonas Weber", email: "jonas@brandt-grafik.example", role: "Can upload receipts", lastSeen: "Yesterday" },
  { id: "t3", name: "Ana Ribeiro", email: "ana@smarta.example", role: "Accountant (smarta)", lastSeen: "2 hours ago" },
];

export const returnChecklist = [
  { id: "r1", title: "Income for 2025", description: "Taken from your invoices and bank accounts.", done: true },
  { id: "r2", title: "Business expenses", description: "214 charges, all with a receipt.", done: true },
  { id: "r3", title: "Home office", description: "Tell Ana how many days you worked from home.", done: false },
  { id: "r4", title: "Health insurance", description: "Upload the certificate from your insurer.", done: false },
  { id: "r5", title: "Review and sign", description: "Ana prepares it once the two above are in.", done: false },
];

/* ---- Backoffice ---------------------------------------------------------- */

export type ReviewStatus = "to-review" | "waiting" | "done";

export interface Client {
  id: string;
  company: string;
  owner: string;
  legalForm: string;
  period: string;
  open: number;
  assignee: string;
  due: Date;
  status: ReviewStatus;
  flag?: string;
}

export const clients: Client[] = [
  { id: "k01", company: "Brandt Grafikdesign", owner: "Lena Brandt", legalForm: "Einzelunternehmen", period: "Q2 2026", open: 12, assignee: "Ana Ribeiro", due: d(10, 6), status: "to-review", flag: "3 receipts over €150 missing" },
  { id: "k02", company: "Sonnenkorn Bäckerei GmbH", owner: "Matthias Korn", legalForm: "GmbH", period: "June 2026", open: 4, assignee: "Erik Braun", due: d(10, 6), status: "to-review" },
  { id: "k03", company: "Studio Lindqvist", owner: "Sofie Lindqvist", legalForm: "Freiberuflerin", period: "Q2 2026", open: 0, assignee: "Ana Ribeiro", due: d(10, 6), status: "done" },
  { id: "k04", company: "Vogt Umzüge", owner: "Daniel Vogt", legalForm: "Einzelunternehmen", period: "June 2026", open: 21, assignee: "Annekatrin Roth", due: d(10, 6), status: "waiting", flag: "Bank connection expired" },
  { id: "k05", company: "Krüger Mobilität UG", owner: "Petra Krüger", legalForm: "UG", period: "June 2026", open: 7, assignee: "Erik Braun", due: d(10, 6), status: "to-review" },
  { id: "k06", company: "Atelier Hoffmann", owner: "Clara Hoffmann", legalForm: "Freiberuflerin", period: "Q2 2026", open: 2, assignee: "Annekatrin Roth", due: d(10, 6), status: "to-review" },
  { id: "k07", company: "Weidmann Druck KG", owner: "Thomas Weidmann", legalForm: "KG", period: "June 2026", open: 9, assignee: "Ana Ribeiro", due: d(10, 6), status: "waiting" },
  { id: "k08", company: "Hansen Büroservice", owner: "Mette Hansen", legalForm: "Einzelunternehmen", period: "June 2026", open: 0, assignee: "Erik Braun", due: d(10, 6), status: "done" },
  { id: "k09", company: "Seeblick Gastronomie GmbH", owner: "Jan Seidel", legalForm: "GmbH", period: "June 2026", open: 15, assignee: "Annekatrin Roth", due: d(10, 6), status: "to-review", flag: "Revenue 40 % below May" },
  { id: "k10", company: "Miradouro Café", owner: "Rui Almeida", legalForm: "Einzelunternehmen", period: "Q2 2026", open: 3, assignee: "Ana Ribeiro", due: d(10, 6), status: "to-review" },
];

export const reviewStatusWord: Record<ReviewStatus, { tone: "info" | "warn" | "ok"; label: string }> = {
  "to-review": { tone: "info", label: "To review" },
  waiting: { tone: "warn", label: "Waiting on client" },
  done: { tone: "ok", label: "Done" },
};

export const staff = ["Ana Ribeiro", "Erik Braun", "Annekatrin Roth"].map((n) => ({ value: n, label: n }));

export const activity = [
  { id: "a1", who: "Lena Brandt", what: "uploaded 4 receipts", when: "Today, 09:41" },
  { id: "a2", who: "Ana Ribeiro", what: "asked for the Druckerei Weidmann receipt", when: "Yesterday, 16:05" },
  { id: "a3", who: "smarta", what: "matched 11 charges to receipts automatically", when: "Yesterday, 07:12" },
  { id: "a4", who: "Lena Brandt", what: "connected the Visa card ···· 4417", when: "28 May 2026" },
];

/* ---- A receipt, drawn inline so the mockups need no image files ---------- */

export function receiptImage(supplier: string, amount: string, date: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="520" viewBox="0 0 360 520" font-family="monospace" font-size="15">
  <rect width="360" height="520" fill="ivory"/>
  <text x="180" y="54" text-anchor="middle" font-size="19" font-weight="bold">${supplier}</text>
  <text x="180" y="80" text-anchor="middle">Leipzig</text>
  <text x="180" y="102" text-anchor="middle">${date}</text>
  <line x1="24" y1="124" x2="336" y2="124" stroke="gray" stroke-dasharray="4 4"/>
  <text x="24" y="160">1 × Leistung</text><text x="336" y="160" text-anchor="end">${amount}</text>
  <line x1="24" y1="190" x2="336" y2="190" stroke="gray" stroke-dasharray="4 4"/>
  <text x="24" y="222" font-weight="bold">Summe EUR</text><text x="336" y="222" text-anchor="end" font-weight="bold">${amount}</text>
  <text x="24" y="250">inkl. 19 % MwSt.</text>
  <text x="180" y="330" text-anchor="middle">Vielen Dank!</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
