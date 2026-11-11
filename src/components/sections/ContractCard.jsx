import StatusChip from '../ui/StatusChip.jsx'
import { formatINR } from '../../utils/format.js'

const milestones = [
  { label: 'On signing', amount: 40000 },
  { label: 'On design approval', amount: 30000 },
  { label: 'On launch', amount: 30000 },
]
const total = milestones.reduce((sum, milestone) => sum + milestone.amount, 0)

// Two hand-drawn signatures. Each path has a flourish underneath the name.
const designerSignature =
  'M6 40 C14 10 26 8 24 30 S16 52 34 34 S52 14 56 34 S64 50 78 30 C84 22 92 24 88 38 S100 46 118 26 S134 20 150 30 M12 54 C50 48 100 56 148 46'
const clientSignature =
  'M8 38 C20 6 32 8 26 32 C24 50 40 50 46 30 L50 22 C54 36 62 40 72 28 S92 12 98 34 C102 48 114 46 124 30 S142 18 152 36 M14 56 C60 50 100 58 146 50'

function Signer({ name, role, path, live = false }) {
  return (
    <div>
      <svg viewBox="0 0 160 64" className="h-14 w-full" fill="none" aria-hidden="true">
        <path
          d={path}
          pathLength="1"
          stroke="var(--color-pen)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={live ? 'signature-live' : undefined}
        />
      </svg>
      <div className="border-t border-ink/40 pt-2 text-sm">
        <p className="font-medium">{name}</p>
        <p className="text-ink-soft">{role}</p>
      </div>
    </div>
  )
}

// A sample contract that gets signed as the page loads. Purely illustrative, all names are made up.
export default function ContractCard() {
  return (
    <div role="group" aria-label="Example of a contract signed in Inkline" className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-0 translate-x-1 -translate-y-2 rotate-1 rounded-md sm:translate-x-2 sm:rotate-2 border border-line bg-white/70"
      />

      <div className="relative rounded-md border border-line bg-white px-6 pt-6 pb-12 shadow-[0_28px_50px_-30px_rgba(15,27,61,0.45)] sm:px-8 sm:pt-8 sm:pb-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-ink-soft">Contract from proposal 014</p>
            <p className="mt-1 font-display text-lead leading-snug font-semibold">
              Website redesign agreement
            </p>
          </div>
          <div className="grid justify-items-start sm:justify-items-end">
            <StatusChip
              tone="pen"
              className="chip-awaiting col-start-1 row-start-1"
              aria-hidden="true"
            >
              Awaiting client
            </StatusChip>
            <StatusChip tone="signed" className="chip-signed col-start-1 row-start-1">
              Signed by client
            </StatusChip>
          </div>
        </div>

        <div className="mt-6 space-y-3 font-display text-base leading-relaxed">
          <p>
            This agreement is between <strong className="font-semibold">Studio Mehta</strong> (the
            designer) and <strong className="font-semibold">Rao Textiles</strong> (the client).
          </p>
          <p>
            <span className="font-semibold">1. Scope.</span> Design and build of a five page
            website, with two rounds of changes.
          </p>
          <p>
            <span className="font-semibold">2. Payment.</span> The fee is paid in three milestones.
          </p>
        </div>

        <table className="mt-4 w-full text-sm">
          <caption className="sr-only">Payment milestones</caption>
          <tbody>
            {milestones.map((milestone) => (
              <tr key={milestone.label} className="border-t border-line">
                <th scope="row" className="py-2 text-left font-normal text-ink-soft">
                  {milestone.label}
                </th>
                <td className="py-2 text-right tabular-nums">{formatINR(milestone.amount)}</td>
              </tr>
            ))}
            <tr className="border-t border-ink">
              <th scope="row" className="py-2 text-left font-semibold">
                Total
              </th>
              <td className="py-2 text-right font-semibold tabular-nums">{formatINR(total)}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <Signer name="Priya Mehta" role="Studio Mehta" path={designerSignature} />
          <Signer name="Rohan Rao" role="Rao Textiles" path={clientSignature} live />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="stamp pointer-events-none absolute right-5 -bottom-9 grid size-20 -rotate-12 place-items-center rounded-full border-2 border-signed bg-white/95 text-center font-display text-signed sm:right-8"
      >
        <span className="leading-tight">
          <span className="block text-lead font-semibold">Signed</span>
          <span className="block text-sm">by client</span>
        </span>
      </div>
    </div>
  )
}
