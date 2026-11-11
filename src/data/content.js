import {
  FileCheck2,
  FileSignature,
  IndianRupee,
  LayoutTemplate,
  PenLine,
  UsersRound,
} from 'lucide-react'

// All copy lives here so the section components only deal with layout.

export const sectionIds = ['home', 'features', 'how-it-works', 'pricing', 'contact']

export const navLinks = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
]

export const hero = {
  title: 'From proposal to signed contract, without the email chase.',
  description:
    'Inkline turns the proposal your client approved into a contract, sends it for online signature, and shows you who still needs to sign.',
  note: 'Free plan available. No card needed.',
}

// `size` controls how much room a feature gets in the grid: lead, side, third or wide.
export const features = [
  {
    title: 'Proposals drafted for you',
    text: 'Describe the project in a few lines. Inkline drafts the scope, timeline and price, and you edit everything before it goes out.',
    icon: PenLine,
    size: 'lead',
  },
  {
    title: 'Contract in one click',
    text: 'Convert an approved proposal into a contract. Scope, price and dates carry over, so nothing is typed twice.',
    icon: FileCheck2,
    size: 'side',
  },
  {
    title: 'Sign from any device',
    text: 'Clients open a link, read the contract and sign on a phone or laptop. They do not need an account.',
    icon: FileSignature,
    size: 'third',
  },
  {
    title: 'Payment milestones',
    text: 'Split the fee into milestones inside the contract and see which ones are due.',
    icon: IndianRupee,
    size: 'third',
  },
  {
    title: 'One place for the client',
    text: 'Clients see the proposal, the contract and its status together, instead of searching old emails.',
    icon: UsersRound,
    size: 'third',
  },
  {
    title: 'Templates that remember your terms',
    text: 'Save your best proposals and contracts as templates, with your payment terms and clauses already in them.',
    icon: LayoutTemplate,
    size: 'wide',
  },
]

export const steps = [
  {
    title: 'Draft the proposal',
    text: 'Describe the work. Inkline writes the first draft of scope, timeline and price for you to edit and send.',
    status: 'Draft',
    tone: 'neutral',
  },
  {
    title: 'Turn it into a contract',
    text: 'When the client approves, convert the proposal in one click. Everything agreed carries over.',
    status: 'Ready to sign',
    tone: 'pen',
  },
  {
    title: 'Your client signs online',
    text: 'The client gets a link, reads the contract and signs on any device. You receive the signed copy as a PDF.',
    status: 'Signed',
    tone: 'signed',
  },
]

export const plans = [
  {
    id: 'free',
    name: 'Free',
    blurb: 'For sending your first few contracts.',
    monthly: 0,
    yearly: 0,
    cta: 'Start free',
    features: [
      '3 contracts a month',
      'Proposal and contract templates',
      'Online signature for your client',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    blurb: 'For freelancers who close work every week.',
    monthly: 799,
    yearly: 639,
    cta: 'Choose Pro',
    highlight: true,
    features: [
      'Unlimited contracts',
      'Proposals drafted for you',
      'Payment milestones and reminders',
      'Your logo on the client page',
      'Priority email support',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    blurb: 'For teams that share clients and templates.',
    monthly: 2499,
    yearly: 1999,
    cta: 'Choose Agency',
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared template library',
      'Approval step before sending',
    ],
  },
]

export const teamSizes = ['Just me', '2 to 10 people', '11 to 50 people', 'More than 50 people']

export const contactDetails = {
  email: 'hello@inkline.example',
  phone: '+91 00000 00000',
  phoneHref: 'tel:+910000000000',
  address: 'Mumbai, Maharashtra, India',
  hours: 'Monday to Friday, 10:00 to 18:00 IST',
}

export const footerNote = 'Inkline is a fictional product made for a front-end assignment.'
