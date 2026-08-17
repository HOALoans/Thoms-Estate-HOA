export const SITE = {
  name: "Thoms Estate Homeowners Association",
  shortName: "Thoms Estate HOA",
  legalName: "The Thoms Estate Homeowner's Association, Inc.",
  domain: "www.thomsestatehoa.com",
  url: "https://www.thomsestatehoa.com",
  tagline: "The official association site for homeowners of Thoms Estate.",
  location: "North Asheville, North Carolina",
  physicalAddress: {
    street: "5 French Willow Drive",
    city: "Asheville",
    state: "NC",
    zip: "28804",
  },
  mailingAddress: {
    street: "PO Box 18709",
    city: "Asheville",
    state: "NC",
    zip: "28814",
  },
  phone: "(828) 348-8014",
  email: "board@thomsestatehoa.com",
  arcEmail: "arc@thomsestatehoa.com",
  salesSite: "https://thomsestate.com",
  description:
    "Official website of The Thoms Estate Homeowner's Association, Inc. in Asheville, North Carolina. Documents, architectural review, meetings, amenities, and resident resources.",
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/association", label: "The Association" },
  { href: "/board", label: "Board" },
  { href: "/budget", label: "Budget" },
  { href: "/documents", label: "Documents" },
  { href: "/architectural-review", label: "Architectural Review" },
  { href: "/amenities", label: "Amenities" },
  { href: "/calendar", label: "Calendar" },
  { href: "/news", label: "Notices" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export const DOCUMENTS = [
  {
    title: "Declaration of Covenants",
    group: "Governing documents",
    description:
      "The recorded covenants that bind every lot in The Thoms Estate and define association membership, common areas, and use restrictions.",
    href: "https://thomsestate.com/wp-content/uploads/2021/08/Covenants-Searchable-1.pdf",
  },
  {
    title: "Design Guidelines",
    group: "Governing documents",
    description:
      "Architectural and landscape standards used by the Architectural Review Committee when reviewing new construction and exterior changes.",
    href: "https://thomsestate.com/wp-content/uploads/2021/08/Thoms-Design-Guidelines-Compressed-1.pdf",
  },
  {
    title: "ARC Fee, Deposit, Fine & Penalty Schedule",
    group: "Architectural review",
    description:
      "Current application fees, construction deposits, inspection deductions, and penalty schedule. Checks are payable to The Thom’s Estate HOA, Inc.",
    href: "https://thomsestate.com/wp-content/uploads/2024/07/The-Thoms-Estate-ARC-Fee-Deposit-Fine-and-Penalty-Schedule-Revised-2024.pdf",
  },
  {
    title: "Preliminary Design Review Application",
    group: "Architectural review",
    description:
      "Submit this form with the non-refundable application fee to begin ARC review of a new home or major improvement.",
    href: "https://thomsestate.com/wp-content/uploads/2021/08/The-Thoms-Estate-Preliminary-Design-Review-Application-1.pdf",
  },
  {
    title: "Final Design Review Application",
    group: "Architectural review",
    description:
      "Final plan package for ARC approval. A construction deposit is required when work begins.",
    href: "https://thomsestate.com/wp-content/uploads/2021/08/The-Thoms-Estate-Final-Design-Review-Application-1.pdf",
  },
  {
    title: "Changes to Approvals",
    group: "Architectural review",
    description:
      "Use this form when a previously approved plan needs a material change before or during construction.",
    href: "https://thomsestate.com/wp-content/uploads/2021/08/The-Thoms-Estate-Changes-To-Approvals-1.pdf",
  },
  {
    title: "Covenants (alternate copy)",
    group: "Governing documents",
    description:
      "Additional published copy of the community covenants.",
    href: "http://thomsestateavl.com/wp-content/uploads/2025/03/Covenants-Thoms-Estate.pdf",
  },
] as const;

export const AMENITIES = [
  {
    title: "Open-air pavilion",
    body: "The community’s gathering place, with fire pits, a grill area, and room for neighborhood events.",
  },
  {
    title: "Playground & recreation lawn",
    body: "Open space for children and adults — soccer, horseshoes, croquet, kites, and casual neighborhood play.",
  },
  {
    title: "Pickleball & basketball court",
    body: "Resident court for pickleball, basketball, and informal league play among neighbors.",
  },
  {
    title: "Community gardens",
    body: "Shared garden plots for vegetables and fruit, connected to the pavilion by trails and sidewalks.",
  },
  {
    title: "Walking trails & 32 acres of open space",
    body: "Miles of walking and jogging trails through greenspace, with an overlook toward the mountains of Western North Carolina.",
  },
  {
    title: "Beaver Creek & wooded setting",
    body: "A nature-first community a few minutes from downtown Asheville and Pack Square, with Beaver Creek running through the property.",
  },
  {
    title: "Gated entries",
    body: "Entries at French Willow Drive and Wild Cherry Road, with a guard house at the French Willow gate.",
  },
] as const;

export const FAQ = [
  {
    q: "Who belongs to the association?",
    a: "Every lot owner in The Thoms Estate is automatically a member of The Thoms Estate Homeowner's Association, Inc. Membership runs with the land.",
  },
  {
    q: "How is this site different from thomsestate.com?",
    a: "thomsestate.com is the developer and sales website. thomsestatehoa.com is the association site for owners: governing documents, architectural review, meetings, notices, and resident services.",
  },
  {
    q: "How do I submit an architectural request?",
    a: "Download the preliminary and final design review applications from the Documents or Architectural Review pages, include the required fee, and send the package to the Architectural Review Committee. Alex Brittian currently chairs the ARC.",
  },
  {
    q: "Who do I pay for ARC fees and deposits?",
    a: "Make checks payable to The Thom’s Estate HOA, Inc. Current amounts are listed in the ARC fee and deposit schedule.",
  },
  {
    q: "Does The Village / Phase 2 have extra rules?",
    a: "Yes. The Village at the Thoms Estate (Phase 2, the Chateaux) has additional neighborhood covenants and the association handles lawn care and certain exterior maintenance there.",
  },
  {
    q: "Where are board meetings posted?",
    a: "Upcoming meetings and notices will appear on the Calendar and Notices pages. Until a date is posted, contact the board at board@thomsestatehoa.com.",
  },
  {
    q: "How do I reach the board?",
    a: "Use the Contact page, email board@thomsestatehoa.com, or write to the published mailing address. For construction and design questions, copy the ARC.",
  },
] as const;
