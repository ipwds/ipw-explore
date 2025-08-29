'use client';

/**
 * Clare & Ben – Online Checklist & Fact Finder
 * Brand: Integral Private Wealth (IPW)
 * Styling: TailwindCSS (no import required)
 * Usage:
 *  1) Save as app/clare-ben/page.tsx
 *  2) Place /public/ipw-logo.png
 *  3) (Optional) Set NEXT_PUBLIC_WEBHOOK_URL for POSTed JSON submissions
 */

import React, { useMemo, useState, useEffect } from 'react';

// ---- Brand Palette ----
const IPW = {
  navy: '#003366',
  white: '#FFFFFF',
  grey: '#666666',
  beige1: '#B4A597',
  beige2: '#B3A496',
  beige3: '#B2A395',
  beige4: '#BDAEA5',
};

// ---- Small helpers ----
const Section: React.FC<{ title: string; children: React.ReactNode; subtitle?: string }> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-slate-100">
    <h2 className="text-xl font-semibold" style={{ color: IPW.navy }}>
      {title}
    </h2>
    {subtitle && (
      <p className="mt-1 text-sm" style={{ color: IPW.grey }}>
        {subtitle}
      </p>
    )}
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </section>
);

const Label: React.FC<{ label: string; required?: boolean }> = ({ label, required }) => (
  <label className="text-sm font-medium" style={{ color: IPW.navy }}>
    {label}
    {required && <span className="text-red-600"> *</span>}
  </label>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }> = ({
  label,
  required,
  ...props
}) => (
  <div className="flex flex-col">
    <Label label={label} required={required} />
    <input
      {...props}
      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-4 focus:ring-slate-200"
    />
  </div>
);

const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; required?: boolean }
> = ({ label, required, ...props }) => (
  <div className="flex flex-col col-span-1 md:col-span-2">
    <Label label={label} required={required} />
    <textarea
      {...props}
      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 min-h-[100px] focus:outline-none focus:ring-4 focus:ring-slate-200"
    />
  </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({
  label,
  checked,
  onChange,
}) => (
  <label className="inline-flex items-center gap-3 select-none">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full transition-colors ${checked ? 'bg-[#003366]' : 'bg-slate-300'}`}
      aria-pressed={checked}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white transform transition-transform translate-y-[2px] ${
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
    <span style={{ color: IPW.navy }}>{label}</span>
  </label>
);

// ---- Header ----
const Header: React.FC = () => (
  <header className="rounded-2xl p-6 shadow-md" style={{ backgroundColor: IPW.navy }}>
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <img src="/ipw-logo.png" alt="Integral Private Wealth" className="h-12 w-auto" />
        <div>
          <h1 className="text-white text-2xl font-semibold leading-tight">
            Clare &amp; Ben – Online Checklist &amp; Fact Finder
          </h1>
          <p className="text-white/80 text-sm">Integral Private Wealth</p>
        </div>
      </div>
      <div className="hidden md:block text-right">
        <p className="text-white text-sm">Sydney | integralprivatewealth.com.au</p>
      </div>
    </div>
  </header>
);

// ---- Print/HTML helpers ----

// safe escape for HTML injection
function esc(v: unknown): string {
  if (v == null) return '';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fmtList(v?: string) {
  if (!v) return '';
  return v
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => `<li>${esc(s)}</li>`)
    .join('');
}

function todayAUS() {
  const d = new Date();
  return d.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' });
}

function buildHtml(form: any) {
  const concerns = (form?.other?.concerns ?? []) as string[];
  const concernLis = concerns.map((c) => `<li>${esc(c)}</li>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>IPW – Clare & Ben Fact Finder</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root{
    --navy:${IPW.navy}; --grey:${IPW.grey};
    --beige1:${IPW.beige1}; --beige4:${IPW.beige4}; --white:#fff;
  }
  *{box-sizing:border-box;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
  body{margin:0;background:linear-gradient(135deg,var(--beige4),var(--beige1))}
  .wrap{max-width:840px;margin:24px auto;padding:24px}
  .card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,.06);padding:28px}
  header.h{display:flex;gap:16px;align-items:center;background:var(--navy);color:#fff;border-radius:16px;padding:18px 20px;margin-bottom:16px}
  header.h img{height:44px}
  h1{margin:0;font-size:20px}
  .muted{color:#e6e6e6;font-size:12px}
  h2.sec{color:var(--navy);border-bottom:2px solid #eef2f7;padding-bottom:6px;margin-top:24px}
  dl{display:grid;grid-template-columns:220px 1fr;gap:8px 18px;margin:0}
  dt{color:var(--navy);font-weight:600}
  dd{margin:0;color:#1f2937;white-space:pre-wrap}
  ul{margin:4px 0 0 18px}
  .footer{margin-top:18px;color:var(--grey);font-size:12px}
  @media print{
    body{background:#fff}
    .wrap{margin:0;max-width:none}
    header.h{border-radius:0}
    a.print-hide, .print-hide{display:none !important}
  }
</style>
</head>
<body>
  <div class="wrap">
    <header class="h">
      <img src="/ipw-logo.png" alt="IPW">
      <div>
        <h1>Clare &amp; Ben – Checklist &amp; Fact Finder</h1>
        <div class="muted">Integral Private Wealth • ${todayAUS()}</div>
      </div>
    </header>

    <div class="card">
      <h2 class="sec">1. Property Objectives</h2>
      <dl>
        <dt>Budget</dt><dd>${esc(form?.property?.budget)}</dd>
        <dt>Timeframe</dt><dd>${esc(form?.property?.timeframe)}</dd>
        <dt>Preferred suburbs</dt><dd><ul>${fmtList(form?.property?.suburbs)}</ul></dd>
        <dt>Property types</dt><dd><ul>${fmtList(form?.property?.propertyTypes)}</ul></dd>
        <dt>Amy’s apartment?</dt><dd>${form?.property?.amysApartmentOption ? 'Yes' : 'No'}</dd>
        <dt>Focus on family home?</dt><dd>${form?.property?.focusFamilyHome ? 'Yes' : 'No'}</dd>
      </dl>

      <h2 class="sec">2. Funding Position</h2>
      <dl>
        <dt>Savings (AUD)</dt><dd>${esc(form?.funding?.savingsAud)}</dd>
        <dt>Savings (Overseas)</dt><dd>${esc(form?.funding?.savingsOverseas)}</dd>
        <dt>Inheritances / gifts</dt><dd>${esc(form?.funding?.inheritances)}</dd>
        <dt>Mortgages</dt><dd>${esc(form?.funding?.mortgages)}</dd>
        <dt>Shareholdings</dt><dd>${esc(form?.funding?.shares)}</dd>
        <dt>Other liquid</dt><dd>${esc(form?.funding?.otherLiquid)}</dd>
      </dl>

      <h2 class="sec">3. Income &amp; Tax Residency</h2>
      <dl>
        <dt>Employment / benefits</dt><dd>${esc(form?.incomeTax?.salariesBenefits)}</dd>
        <dt>Equity / bonuses</dt><dd>${esc(form?.incomeTax?.equity)}</dd>
        <dt>Residency for purchase</dt><dd>${esc(form?.incomeTax?.residency)}</dd>
        <dt>Tax advice received</dt><dd>${esc(form?.incomeTax?.taxAdvice)}</dd>
      </dl>

      <h2 class="sec">4. Family Planning</h2>
      <dl>
        <dt>Children plan (2–4 yrs)</dt><dd>${esc(form?.family?.childrenPlan)}</dd>
        <dt>Living arrangements</dt><dd>${esc(form?.family?.livingArrangements)}</dd>
        <dt>Schooling / childcare</dt><dd>${esc(form?.family?.schoolingChildcare)}</dd>
      </dl>

      <h2 class="sec">5. Family Support &amp; Potential Conflicts</h2>
      <dl>
        <dt>Receiving family support?</dt><dd>${esc(form?.familySupport?.receivingSupport)}</dd>
        <dt>Support types</dt><dd>${esc(form?.familySupport?.supportTypes)}</dd>
        <dt>Terms / expectations</dt><dd>${esc(form?.familySupport?.termsOrExpectations)}</dd>
        <dt>Independence / relationship risks</dt><dd>${esc(form?.familySupport?.independenceConcerns)}</dd>
      </dl>

      <h2 class="sec">6. Other Considerations</h2>
      <dl>
        <dt>Return to Australia</dt><dd>${esc(form?.other?.returnTimeline)}</dd>
        <dt>Concerns</dt><dd><ul>${concernLis}</ul></dd>
        <dt>Model type</dt><dd>${esc(form?.other?.investmentVsPPR)}</dd>
        <dt>Notes</dt><dd>${esc(form?.other?.notes)}</dd>
      </dl>

      <h2 class="sec">Contact &amp; Consent</h2>
      <dl>
        <dt>Name</dt><dd>${esc(form?.contact?.fullName)}</dd>
        <dt>Email</dt><dd>${esc(form?.contact?.email)}</dd>
        <dt>Phone</dt><dd>${esc(form?.contact?.phone)}</dd>
        <dt>Consent</dt><dd>${form?.contact?.consent ? 'Yes' : 'No'}</dd>
      </dl>

      <div class="footer">
        Prepared for modelling purposes by Integral Private Wealth. This document summarises client‑provided inputs and does not constitute personal advice.
      </div>
    </div>

    <p class="muted print-hide" style="text-align:center;margin-top:12px">Tip: In the print dialog, choose “Save as PDF”.</p>
  </div>

  <script>
    // ensure images (logo) are loaded before printing
    window.addEventListener('load', function(){
      // if opened in print mode window, auto-print
      if (window.name === 'IPW_PRINT') {
        setTimeout(function(){ window.print(); }, 300);
      }
    });
  </script>
</body>
</html>`;
}

function downloadFile(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---- Main Component ----
export default function ClareBenFactFinder() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist to localStorage for safety
  const [form, setForm] = useState<any>({
    property: {
      budget: '',
      suburbs: '',
      propertyTypes: '',
      amysApartmentOption: false,
      focusFamilyHome: true,
      timeframe: '',
    },
    funding: {
      savingsAud: '',
      savingsOverseas: '',
      inheritances: '',
      mortgages: '',
      shares: '',
      otherLiquid: '',
    },
    incomeTax: {
      employment: '',
      salariesBenefits: '',
      equity: '',
      residency: 'Undecided',
      taxAdvice: '',
    },
    family: {
      childrenPlan: 'Undecided',
      livingArrangements: '',
      schoolingChildcare: '',
    },
    // NEW: Captures potential dilemma of receiving a favour from family
    familySupport: {
      receivingSupport: 'Undecided',
      supportTypes: '',
      termsOrExpectations: '',
      independenceConcerns: '',
    },
    other: {
      returnTimeline: '',
      concerns: [] as string[],
      notes: '',
      investmentVsPPR: 'Principal residence only',
    },
    contact: {
      fullName: '',
      email: '',
      phone: '',
      consent: false,
    },
    _hp: '',
  });

  useEffect(() => {
    try {
      const cached = localStorage.getItem('ipw_clareben_ff');
      if (cached) setForm(JSON.parse(cached));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ipw_clareben_ff', JSON.stringify(form));
    } catch {}
  }, [form]);

  const handleConcerns = (value: string) => {
    setForm((f: any) => {
      const exists = f.other.concerns.includes(value);
      return {
        ...f,
        other: {
          ...f.other,
          concerns: exists ? f.other.concerns.filter((x: string) => x !== value) : [...f.other.concerns, value],
        },
      };
    });
  };

  const concernsList = [
    'Foreign purchaser duty',
    'Stamp duty (NSW concessions/thresholds)',
    'Tax implications (non-resident)',
    'Financing while overseas',
    'Accepting a favour from family (and how to structure it)',
  ];

  const valid = useMemo(() => {
    const emailOk = /.+@.+\..+/.test(form.contact.email || '');
    return form.contact.fullName && emailOk && form.contact.consent && !form._hp;
  }, [form]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        meta: {
          createdAt: new Date().toISOString(),
          clientNames: 'Clare & Ben',
          source: 'IPW Online Fact Finder',
        },
        data: form,
      };

      const webhook =
        typeof window !== 'undefined' ? ((process.env.NEXT_PUBLIC_WEBHOOK_URL as string | undefined) || '') : '';

      if (webhook) {
        const res = await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Non‑200 from webhook');
      }

      setSubmitted(true);
    } catch (err: any) {
      setError('Submission failed. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  // ---- NEW: HTML + PDF actions ----
  function handleDownloadHtml() {
    const html = buildHtml(form);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    downloadFile('IPW_ClareBen_FactFinder.html', blob);
  }

  function handleSaveAsPdf() {
    const html = buildHtml(form);
    const printWin = window.open('', 'IPW_PRINT');
    if (!printWin) return;
    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
    // printing is auto-triggered by the inline script once loaded
  }

  if (submitted) {
    return (
      <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${IPW.beige4}, ${IPW.beige1})` }}>
        <div className="max-w-3xl mx-auto p-6">
          <Header />
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
            <h1 className="text-2xl font-semibold" style={{ color: IPW.navy }}>
              Thank you, Clare &amp; Ben
            </h1>
            <p className="mt-2" style={{ color: IPW.grey }}>
              Your checklist and fact finder have been submitted. We will review your information and prepare detailed
              modelling for our next meeting.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 rounded-2xl px-5 py-2 text-white"
              style={{ backgroundColor: IPW.navy }}
            >
              Back to form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${IPW.beige4}, ${IPW.beige1})` }}>
      <div className="max-w-5xl mx-auto p-6">
        <Header />

        <form onSubmit={onSubmit} className="mt-6">
          {/* 1. Property Objectives */}
          <Section title="1. Property Objectives" subtitle="This helps us define the brief and purchase timing.">
            <Input
              label="Preferred budget range (AUD)"
              placeholder="e.g., $1.6m – $2.2m"
              value={form.property.budget}
              onChange={(e) =>
                setForm({ ...form, property: { ...form.property, budget: (e.target as HTMLInputElement).value } })
              }
            />
            <Input
              label="Desired purchase timeframe"
              placeholder="e.g., within 6–12 months"
              value={form.property.timeframe}
              onChange={(e) =>
                setForm({ ...form, property: { ...form.property, timeframe: (e.target as HTMLInputElement).value } })
              }
            />
            <TextArea
              label="Preferred suburbs or locations"
              placeholder="List suburbs/areas and any non-negotiables"
              value={form.property.suburbs}
              onChange={(e) =>
                setForm({ ...form, property: { ...form.property, suburbs: (e.target as HTMLTextAreaElement).value } })
              }
            />
            <TextArea
              label="Preferred property types"
              placeholder="e.g., freestanding house, townhouse, apartment (minimum beds/baths)"
              value={form.property.propertyTypes}
              onChange={(e) =>
                setForm({
                  ...form,
                  property: { ...form.property, propertyTypes: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <div className="col-span-1 md:col-span-2 flex flex-wrap gap-6">
              <Toggle
                label="Consider Amy’s apartment as an option"
                checked={form.property.amysApartmentOption}
                onChange={(v) => setForm({ ...form, property: { ...form.property, amysApartmentOption: v } })}
              />
              <Toggle
                label="Focus on a family home"
                checked={form.property.focusFamilyHome}
                onChange={(v) => setForm({ ...form, property: { ...form.property, focusFamilyHome: v } })}
              />
            </div>
          </Section>

          {/* 2. Funding Position */}
          <Section title="2. Funding Position" subtitle="We’ll map resources for deposit, costs and buffers.">
            <Input
              label="Current savings – AUD"
              placeholder="$"
              value={form.funding.savingsAud}
              onChange={(e) =>
                setForm({ ...form, funding: { ...form.funding, savingsAud: (e.target as HTMLInputElement).value } })
              }
            />
            <Input
              label="Current savings – Overseas"
              placeholder="$ (currency)"
              value={form.funding.savingsOverseas}
              onChange={(e) =>
                setForm({
                  ...form,
                  funding: { ...form.funding, savingsOverseas: (e.target as HTMLInputElement).value },
                })
              }
            />
            <TextArea
              label="Expected inheritances or gifts (timing & amounts)"
              value={form.funding.inheritances}
              onChange={(e) =>
                setForm({
                  ...form,
                  funding: { ...form.funding, inheritances: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <TextArea
              label="Existing mortgages (balances, repayments, rates, offsets/redraws)"
              value={form.funding.mortgages}
              onChange={(e) =>
                setForm({
                  ...form,
                  funding: { ...form.funding, mortgages: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <TextArea
              label="Shareholdings (e.g., Uber – value, vesting)"
              value={form.funding.shares}
              onChange={(e) =>
                setForm({
                  ...form,
                  funding: { ...form.funding, shares: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <Input
              label="Other liquid assets available for deposit"
              placeholder="$"
              value={form.funding.otherLiquid}
              onChange={(e) =>
                setForm({
                  ...form,
                  funding: { ...form.funding, otherLiquid: (e.target as HTMLInputElement).value },
                })
              }
            />
          </Section>

          {/* 3. Income & Tax Residency */}
          <Section title="3. Income & Tax Residency" subtitle="For borrowing capacity and tax structuring.">
            <TextArea
              label="Employment, salaries and benefits"
              value={form.incomeTax.salariesBenefits}
              onChange={(e) =>
                setForm({
                  ...form,
                  incomeTax: { ...form.incomeTax, salariesBenefits: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <TextArea
              label="RSUs, stock options or bonuses"
              value={form.incomeTax.equity}
              onChange={(e) =>
                setForm({
                  ...form,
                  incomeTax: { ...form.incomeTax, equity: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <div className="flex flex-col">
              <Label label="Intended residency status for purchase" />
              <select
                value={form.incomeTax.residency}
                onChange={(e) =>
                  setForm({ ...form, incomeTax: { ...form.incomeTax, residency: (e.target as HTMLSelectElement).value } })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 bg-white"
              >
                <option>Non-resident</option>
                <option>Establish Australian residency</option>
                <option>Undecided</option>
              </select>
            </div>
            <TextArea
              label="Any tax advice already received on a non-resident purchase"
              value={form.incomeTax.taxAdvice}
              onChange={(e) =>
                setForm({
                  ...form,
                  incomeTax: { ...form.incomeTax, taxAdvice: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
          </Section>

          {/* 4. Family Planning */}
          <Section title="4. Family Planning" subtitle="Helps us set timing, location and buffers.">
            <div className="flex flex-col">
              <Label label="Plan to have children in the next 2–4 years?" />
              <select
                value={form.family.childrenPlan}
                onChange={(e) =>
                  setForm({ ...form, family: { ...form.family, childrenPlan: (e.target as HTMLSelectElement).value } })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 bg-white"
              >
                <option>Yes</option>
                <option>No</option>
                <option>Undecided</option>
              </select>
            </div>
            <TextArea
              label="Planned living arrangements during family expansion (overseas or Australia)"
              value={form.family.livingArrangements}
              onChange={(e) =>
                setForm({
                  ...form,
                  family: { ...form.family, livingArrangements: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <TextArea
              label="Schooling/childcare considerations affecting timing or location"
              value={form.family.schoolingChildcare}
              onChange={(e) =>
                setForm({
                  ...form,
                  family: { ...form.family, schoolingChildcare: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
          </Section>

          {/* 5. Family Support & Conflicts (NEW) */}
          <Section
            title="5. Family Support & Potential Conflicts"
            subtitle="If receiving help from family, we will model the structure, risks and independence."
          >
            <div className="flex flex-col">
              <Label label="Are you considering accepting a favour/assistance from family?" />
              <select
                value={form.familySupport.receivingSupport}
                onChange={(e) =>
                  setForm({
                    ...form,
                    familySupport: { ...form.familySupport, receivingSupport: (e.target as HTMLSelectElement).value },
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 bg-white"
              >
                <option>Yes</option>
                <option>No</option>
                <option>Undecided</option>
              </select>
            </div>
            <TextArea
              label="What form could this take? (e.g., gifted equity, interest‑free loan, guarantor, rent discount)"
              value={form.familySupport.supportTypes}
              onChange={(e) =>
                setForm({
                  ...form,
                  familySupport: { ...form.familySupport, supportTypes: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <TextArea
              label="Any terms or expectations attached? (repayment, control, decision rights, time limits)"
              value={form.familySupport.termsOrExpectations}
              onChange={(e) =>
                setForm({
                  ...form,
                  familySupport: { ...form.familySupport, termsOrExpectations: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
            <TextArea
              label="Do you have concerns about independence, influence or relationship risk?"
              value={form.familySupport.independenceConcerns}
              onChange={(e) =>
                setForm({
                  ...form,
                  familySupport: { ...form.familySupport, independenceConcerns: (e.target as HTMLTextAreaElement).value },
                })
              }
            />
          </Section>

          {/* 6. Other Considerations */}
          <Section title="6. Other Considerations" subtitle="Anything else that may shape the strategy.">
            <Input
              label="Expected timeline for returning to Australia"
              placeholder="e.g., mid-2027"
              value={form.other.returnTimeline}
              onChange={(e) =>
                setForm({ ...form, other: { ...form.other, returnTimeline: (e.target as HTMLInputElement).value } })
              }
            />
            <div className="flex flex-col">
              <Label label="Concerns" />
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {concernsList.map((c) => (
                  <label key={c} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.other.concerns.includes(c)}
                      onChange={() => handleConcerns(c)}
                      className="h-4 w-4"
                    />
                    <span style={{ color: IPW.navy }}>{c}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <Label label="Model what type of purchase?" />
              <select
                value={form.other.investmentVsPPR}
                onChange={(e) =>
                  setForm({
                    ...form,
                    other: { ...form.other, investmentVsPPR: (e.target as HTMLSelectElement).value },
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 bg-white"
              >
                <option>Principal residence only</option>
                <option>Compare investment property and principal residence</option>
              </select>
            </div>
            <TextArea
              label="Anything else you would like us to consider"
              value={form.other.notes}
              onChange={(e) =>
                setForm({ ...form, other: { ...form.other, notes: (e.target as HTMLTextAreaElement).value } })
              }
            />
          </Section>

          {/* Contact & Consent */}
          <section className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-slate-100">
            <h2 className="text-xl font-semibold" style={{ color: IPW.navy }}>
              Contact &amp; Consent
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Your full name"
                required
                placeholder="Clare Smith"
                value={form.contact.fullName}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, fullName: (e.target as HTMLInputElement).value } })
                }
              />
              <Input
                label="Email"
                required
                type="email"
                placeholder="clare@example.com"
                value={form.contact.email}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, email: (e.target as HTMLInputElement).value } })
                }
              />
              <Input
                label="Contact number"
                placeholder="+61 ..."
                value={form.contact.phone}
                onChange={(e) =>
                  setForm({ ...form, contact: { ...form.contact, phone: (e.target as HTMLInputElement).value } })
                }
              />

              {/* Honeypot field (hidden) */}
              <div className="hidden">
                <Input
                  label="Leave this field blank"
                  value={form._hp}
                  onChange={(e) => setForm({ ...form, _hp: (e.target as HTMLInputElement).value })}
                />
              </div>

              <div className="flex items-center gap-3 mt-2 md:col-span-2">
                <input
                  id="consent"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={form.contact.consent}
                  onChange={(e) => setForm({ ...form, contact: { ...form.contact, consent: e.currentTarget.checked } })}
                />
                <label htmlFor="consent" className="text-sm" style={{ color: IPW.grey }}>
                  I consent to Integral Private Wealth using this information to prepare modelling and advice.
                </label>
              </div>
            </div>
          </section>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={!valid || submitting}
                className="rounded-2xl px-6 py-3 text-white shadow-md disabled:opacity-60"
                style={{ backgroundColor: IPW.navy }}
              >
                {submitting ? 'Submitting…' : 'Submit fact finder'}
              </button>

              {/* NEW: Save as PDF (print dialog) */}
              <button
                type="button"
                onClick={handleSaveAsPdf}
                className="rounded-2xl px-5 py-3 border"
                style={{ borderColor: IPW.navy, color: IPW.navy }}
              >
                Save as PDF
              </button>

              {/* NEW: Download HTML */}
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="rounded-2xl px-5 py-3 border"
                style={{ borderColor: IPW.navy, color: IPW.navy }}
              >
                Download HTML
              </button>
            </div>

            {/* Existing: Download JSON */}
            <button
              type="button"
              onClick={() => {
                const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(form, null, 2));
                const a = document.createElement('a');
                a.setAttribute('href', dataStr);
                a.setAttribute('download', 'IPW_ClareBen_FactFinder.json');
                a.click();
              }}
              className="rounded-2xl px-5 py-3 border"
              style={{ borderColor: IPW.navy, color: IPW.navy }}
            >
              Download a copy (JSON)
            </button>
          </div>

          <p className="text-xs mt-4" style={{ color: IPW.grey }}>
            Your information is handled confidentially by Integral Private Wealth and used solely to prepare your
            advice. This form does not constitute personal advice.
          </p>
        </form>
      </div>
    </div>
  );
}

