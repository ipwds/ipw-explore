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
import Image from 'next/image';

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
        <Image src="/ipw-logo.png" alt="Integral Private Wealth" width={160} height={48} />
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

// ---- Main Component ----
export default function ClareBenFactFinder() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Persist to localStorage for safety
  const [form, setForm] = useState<FormState>({
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
    setForm((f: FormState) => {
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
  ];

  const valid = useMemo(() => {
    return form.contact.fullName && form.contact.email && form.contact.consent;
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

      // Optional: forward to webhook if configured at build-time
      const webhook =
        typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_WEBHOOK_URL as string | undefined) || '' : '';
      if (webhook) {
        await fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setSubmitted(true);
    } catch {
      setError('Submission failed. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="min-h-screen"
        style={{ background: `linear-gradient(135deg, ${IPW.beige4}, ${IPW.beige1})` }}
      >
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
    <div
      className="min-h-screen"
      style={{ background: `linear-gradient(135deg, ${IPW.beige4}, ${IPW.beige1})` }}
    >
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

          {/* 5. Other Considerations */}
          <Section title="5. Other Considerations" subtitle="Anything else that may shape the strategy.">
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
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={form.contact.consent}
                  onChange={(e) =>
                    setForm({ ...form, contact: { ...form.contact, consent: e.currentTarget.checked } })
                  }
                />
                <span className="text-sm" style={{ color: IPW.grey }}>
                  I consent to Integral Private Wealth using this information to prepare modelling and advice.
                </span>
              </div>
            </div>
          </section>

          {error && (
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              disabled={!valid || submitting}
              className="rounded-2xl px-6 py-3 text-white shadow-md disabled:opacity-60"
              style={{ backgroundColor: IPW.navy }}
            >
              {submitting ? 'Submitting…' : 'Submit fact finder'}
            </button>

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

