"use client";

import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { company } from "@/lib/company";
import {
  technologyInquiryTypes,
  technologyTypeLabels,
  type TechnologyInquiryInput,
  type TechnologyInquiryType,
} from "@/lib/validation/technology-inquiry";

type FieldErrors = Partial<Record<keyof TechnologyInquiryInput | "form", string>>;

type Props = {
  defaultType?: TechnologyInquiryType;
  sourcePage?: string;
};

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-t border-charcoal/10 pt-8 first:border-t-0 first:pt-0">
      <legend className="font-display text-xl text-charcoal">{title}</legend>
      {description && (
        <p className="mt-1.5 max-w-prose text-xs text-charcoal-muted">{description}</p>
      )}
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-charcoal">
        {label}
        {required ? (
          <span className="text-champagne-deep"> *</span>
        ) : (
          <span className="font-normal text-charcoal-muted"> (optional)</span>
        )}
      </span>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1 text-xs text-red-700" role="alert" id={`${name}-error`}>
          {error}
        </p>
      )}
    </label>
  );
}

const inputClass =
  "w-full border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal outline-none transition focus:border-champagne";

export function TechnologyInquiryForm({ defaultType, sourcePage }: Props) {
  const [inquiryType, setInquiryType] = useState<TechnologyInquiryType>(
    defaultType ?? "TECHNOLOGY_ERP",
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ reference: string } | null>(null);

  const serviceHint = useMemo(() => {
    if (inquiryType === "TECHNOLOGY_ERP") {
      return "Share modules, current systems, and user scale when known.";
    }
    if (inquiryType === "TECHNOLOGY_WEBSITE") {
      return "Share website type, existing URL, and ecommerce needs when known.";
    }
    if (inquiryType === "TECHNOLOGY_AI") {
      return "Share your website, common visitor questions, and how leads should hand off.";
    }
    return "Share channels, audience, and objectives when known.";
  }, [inquiryType]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = {
      contactName: String(fd.get("contactName") ?? ""),
      companyName: String(fd.get("companyName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      country: String(fd.get("country") ?? ""),
      inquiryType,
      projectDescription: String(fd.get("projectDescription") ?? ""),
      estimatedBudget: String(fd.get("estimatedBudget") ?? ""),
      expectedTimeline: String(fd.get("expectedTimeline") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      requiredModules: String(fd.get("requiredModules") ?? ""),
      existingSoftware: String(fd.get("existingSoftware") ?? ""),
      numberOfUsers: String(fd.get("numberOfUsers") ?? ""),
      integrationRequirements: String(fd.get("integrationRequirements") ?? ""),
      websiteType: String(fd.get("websiteType") ?? ""),
      existingWebsiteUrl: String(fd.get("existingWebsiteUrl") ?? ""),
      approximatePageCount: String(fd.get("approximatePageCount") ?? ""),
      ecommerceRequired: String(fd.get("ecommerceRequired") ?? ""),
      currentChannels: String(fd.get("currentChannels") ?? ""),
      marketingObjectives: String(fd.get("marketingObjectives") ?? ""),
      targetAudience: String(fd.get("targetAudience") ?? ""),
      interestedChannels: String(fd.get("interestedChannels") ?? ""),
      monthlyMarketingBudget: String(fd.get("monthlyMarketingBudget") ?? ""),
      chatbotGoals: String(fd.get("chatbotGoals") ?? ""),
      commonQuestions: String(fd.get("commonQuestions") ?? ""),
      handoffPreference: String(fd.get("handoffPreference") ?? ""),
      knowledgeSources: String(fd.get("knowledgeSources") ?? ""),
      sourcePage: sourcePage ?? "/technology/request-quote",
      website: String(fd.get("website") ?? ""),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        fieldErrors?: Record<string, string[]>;
      };

      if (!res.ok || !data.ok) {
        const next: FieldErrors = {};
        if (data.fieldErrors) {
          for (const [key, msgs] of Object.entries(data.fieldErrors)) {
            if (msgs?.[0]) next[key as keyof FieldErrors] = msgs[0];
          }
        }
        next.form = data.error ?? "Unable to submit. Please review the form.";
        setErrors(next);
        return;
      }

      setDone({ reference: data.reference ?? "" });
      e.currentTarget.reset();
      setInquiryType(defaultType ?? "TECHNOLOGY_ERP");
    } catch {
      setErrors({ form: "Network error. Please try again shortly." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border border-charcoal/10 bg-ivory p-6 md:p-8" role="status">
        <p className="text-xs font-medium uppercase tracking-wideish text-champagne-deep">
          Inquiry received
        </p>
        <h2 className="mt-3 font-display text-2xl text-charcoal">Thank you</h2>
        <p className="mt-3 text-sm leading-relaxed text-charcoal-muted">
          Your technology inquiry has been received. Please keep this reference for follow-up —
          our team will respond by email with next steps.
        </p>
        <p className="mt-5 font-medium text-charcoal">
          Reference: <span className="text-champagne-deep">{done.reference}</span>
        </p>
        <p className="mt-4 text-sm text-charcoal-muted">
          You can also email{" "}
          <a
            href={`mailto:${company.email}`}
            className="text-charcoal underline underline-offset-2"
          >
            {company.email}
          </a>
          .
        </p>
        <Button
          type="button"
          className="mt-6"
          variant="secondary"
          onClick={() => setDone(null)}
        >
          Submit another inquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-0" noValidate>
      <FormSection
        title="Service required"
        description="Select the Technology & Growth service. You can change this at any time."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {technologyInquiryTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setInquiryType(type)}
              className={`border px-4 py-3 text-left text-sm transition ${
                inquiryType === type
                  ? "border-champagne bg-ivory text-charcoal"
                  : "border-charcoal/15 bg-white text-charcoal-muted hover:border-charcoal/30"
              }`}
              aria-pressed={inquiryType === type}
            >
              {technologyTypeLabels[type]}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-charcoal-muted">{serviceHint}</p>
      </FormSection>

      <FormSection title="Contact details">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Company or business name" name="companyName" required error={errors.companyName}>
            <input className={inputClass} name="companyName" autoComplete="organization" required />
          </Field>
          <Field label="Contact person" name="contactName" required error={errors.contactName}>
            <input className={inputClass} name="contactName" autoComplete="name" required />
          </Field>
          <Field label="Email address" name="email" required error={errors.email}>
            <input className={inputClass} name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Telephone" name="phone" error={errors.phone}>
            <input className={inputClass} name="phone" type="tel" autoComplete="tel" />
          </Field>
          <Field label="Country" name="country" required error={errors.country}>
            <input className={inputClass} name="country" autoComplete="country-name" required />
          </Field>
          <Field label="Estimated budget" name="estimatedBudget" error={errors.estimatedBudget}>
            <input className={inputClass} name="estimatedBudget" />
          </Field>
          <Field
            label="Expected timeline"
            name="expectedTimeline"
            error={errors.expectedTimeline}
          >
            <input className={inputClass} name="expectedTimeline" />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Project description" description="Required — tell us what you want to achieve.">
        <Field
          label="Project description"
          name="projectDescription"
          required
          error={errors.projectDescription}
        >
          <textarea
            className={`${inputClass} min-h-[140px]`}
            name="projectDescription"
            required
            minLength={20}
          />
        </Field>
      </FormSection>

      {inquiryType === "TECHNOLOGY_ERP" && (
        <FormSection title="ERP details" description="Optional — helps us scope the engagement.">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Industry" name="industry" error={errors.industry}>
              <input className={inputClass} name="industry" />
            </Field>
            <Field label="Number of users" name="numberOfUsers" error={errors.numberOfUsers}>
              <input className={inputClass} name="numberOfUsers" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Required modules" name="requiredModules" error={errors.requiredModules}>
                <textarea className={`${inputClass} min-h-[90px]`} name="requiredModules" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field
                label="Existing software"
                name="existingSoftware"
                error={errors.existingSoftware}
              >
                <textarea className={`${inputClass} min-h-[90px]`} name="existingSoftware" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field
                label="Integration requirements"
                name="integrationRequirements"
                error={errors.integrationRequirements}
              >
                <textarea
                  className={`${inputClass} min-h-[90px]`}
                  name="integrationRequirements"
                />
              </Field>
            </div>
          </div>
        </FormSection>
      )}

      {inquiryType === "TECHNOLOGY_WEBSITE" && (
        <FormSection
          title="Website details"
          description="Optional — helps us understand scope and integrations."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Website type" name="websiteType" error={errors.websiteType}>
              <select className={inputClass} name="websiteType" defaultValue="">
                <option value="">Select if known</option>
                <option value="Corporate">Corporate</option>
                <option value="B2B">B2B</option>
                <option value="Ecommerce">Ecommerce</option>
                <option value="Catalogue">Catalogue</option>
                <option value="Quotation">Quotation</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field
              label="Existing website URL"
              name="existingWebsiteUrl"
              error={errors.existingWebsiteUrl}
            >
              <input className={inputClass} name="existingWebsiteUrl" placeholder="https://" />
            </Field>
            <Field
              label="Approximate product/page count"
              name="approximatePageCount"
              error={errors.approximatePageCount}
            >
              <input className={inputClass} name="approximatePageCount" />
            </Field>
            <Field
              label="Ecommerce required"
              name="ecommerceRequired"
              error={errors.ecommerceRequired}
            >
              <select className={inputClass} name="ecommerceRequired" defaultValue="">
                <option value="">Select if known</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Unsure">Unsure</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field
                label="Integration requirements"
                name="integrationRequirements"
                error={errors.integrationRequirements}
              >
                <textarea
                  className={`${inputClass} min-h-[90px]`}
                  name="integrationRequirements"
                />
              </Field>
            </div>
          </div>
        </FormSection>
      )}

      {inquiryType === "TECHNOLOGY_MARKETING" && (
        <FormSection
          title="Marketing details"
          description="Optional — helps us plan channels and reporting."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field
                label="Current website / social channels"
                name="currentChannels"
                error={errors.currentChannels}
              >
                <textarea className={`${inputClass} min-h-[90px]`} name="currentChannels" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field
                label="Marketing objectives"
                name="marketingObjectives"
                error={errors.marketingObjectives}
              >
                <textarea className={`${inputClass} min-h-[90px]`} name="marketingObjectives" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field
                label="Target audience or markets"
                name="targetAudience"
                error={errors.targetAudience}
              >
                <textarea className={`${inputClass} min-h-[90px]`} name="targetAudience" />
              </Field>
            </div>
            <Field
              label="Interested channels"
              name="interestedChannels"
              error={errors.interestedChannels}
            >
              <input className={inputClass} name="interestedChannels" />
            </Field>
            <Field
              label="Monthly marketing budget"
              name="monthlyMarketingBudget"
              error={errors.monthlyMarketingBudget}
            >
              <input className={inputClass} name="monthlyMarketingBudget" />
            </Field>
          </div>
        </FormSection>
      )}

      {inquiryType === "TECHNOLOGY_AI" && (
        <FormSection
          title="AI / chatbot details"
          description="Optional — helps us scope content, handoff, and embedding."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field
                label="Website URL for the chatbot"
                name="existingWebsiteUrl"
                error={errors.existingWebsiteUrl}
              >
                <input className={inputClass} name="existingWebsiteUrl" placeholder="https://" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Chatbot goals" name="chatbotGoals" error={errors.chatbotGoals}>
                <textarea className={`${inputClass} min-h-[90px]`} name="chatbotGoals" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field
                label="Common visitor questions to cover"
                name="commonQuestions"
                error={errors.commonQuestions}
              >
                <textarea className={`${inputClass} min-h-[90px]`} name="commonQuestions" />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field
                label="Approved knowledge sources"
                name="knowledgeSources"
                error={errors.knowledgeSources}
              >
                <textarea className={`${inputClass} min-h-[90px]`} name="knowledgeSources" />
              </Field>
            </div>
            <Field
              label="Human handoff preference"
              name="handoffPreference"
              error={errors.handoffPreference}
            >
              <input
                className={inputClass}
                name="handoffPreference"
                placeholder="e.g. email sales, CRM ticket"
              />
            </Field>
            <Field
              label="Integration requirements"
              name="integrationRequirements"
              error={errors.integrationRequirements}
            >
              <input className={inputClass} name="integrationRequirements" />
            </Field>
          </div>
        </FormSection>
      )}

      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {errors.form && (
        <p className="mt-6 text-sm text-red-700" role="alert">
          {errors.form}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-charcoal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-charcoal-muted">
          Required fields marked *. Share project context freely — avoid passwords or system
          credentials in this form.
        </p>
        <Button type="submit" disabled={submitting} className="sm:min-w-[12rem]">
          {submitting ? "Submitting…" : "Submit inquiry"}
        </Button>
      </div>
    </form>
  );
}
