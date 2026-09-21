"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import {
  industries,
  inquiryTypes,
  packagingCategoryOptions,
  quantityUnits,
  type InquiryInput,
  type PackagingLineItem,
} from "@/lib/validation/inquiry";

type FieldErrors = Partial<Record<keyof InquiryInput | "form", string>>;

const typeLabels: Record<(typeof inquiryTypes)[number], string> = {
  FRAGRANCE_TRADING: "Fragrance Trading",
  TOLL_MANUFACTURING: "Toll Manufacturing",
  PRIVATE_LABEL: "Private Label",
  PACKAGING_COMPONENTS: "Packaging & Components",
};

type Props = {
  defaultType?: (typeof inquiryTypes)[number];
  sourcePage?: string;
};

const emptyLine = (): PackagingLineItem => ({
  category: "",
  quantity: "",
  capacitySize: "",
  material: "",
  colourFinish: "",
  notes: "",
});

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

export function InquiryForm({ defaultType, sourcePage }: Props) {
  const router = useRouter();
  const [inquiryType, setInquiryType] = useState<(typeof inquiryTypes)[number]>(
    defaultType ?? "FRAGRANCE_TRADING",
  );
  const [packagingCats, setPackagingCats] = useState<string[]>([]);
  const [lineItems, setLineItems] = useState<PackagingLineItem[]>([emptyLine()]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ reference: string } | null>(null);

  const isPackaging = inquiryType === "PACKAGING_COMPONENTS";
  const showTradingExtras = inquiryType === "FRAGRANCE_TRADING";
  const showManufacturingExtras = inquiryType === "TOLL_MANUFACTURING";
  const showPrivateLabelExtras = inquiryType === "PRIVATE_LABEL";

  const conditionalHint = useMemo(() => {
    if (isPackaging) {
      return "Select packaging categories and add line items for quantities, sizes, materials, and finishes. Compatibility claims are confirmed separately.";
    }
    if (inquiryType === "FRAGRANCE_TRADING") {
      return "Share fragrance direction, concentration needs, and sample preferences if known.";
    }
    if (inquiryType === "TOLL_MANUFACTURING") {
      return "Describe blending, filling, packaging, and whether materials are client-supplied.";
    }
    return "Include concept direction, bottle size, packaging, and timeline if available.";
  }, [inquiryType, isPackaging]);

  function togglePackagingCat(label: string) {
    setPackagingCats((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);

    const cleanedLines = isPackaging
      ? lineItems
          .map((li) => ({
            category: li.category.trim(),
            quantity: li.quantity.trim(),
            capacitySize: li.capacitySize?.trim() || undefined,
            material: li.material?.trim() || undefined,
            colourFinish: li.colourFinish?.trim() || undefined,
            notes: li.notes?.trim() || undefined,
          }))
          .filter((li) => li.category && li.quantity)
      : undefined;

    const productCategory = isPackaging
      ? packagingCats.length
        ? packagingCats.join(", ")
        : cleanedLines?.map((l) => l.category).join(", ") || "Packaging"
      : String(fd.get("productCategory") ?? "");

    const payload = {
      contactName: String(fd.get("contactName") ?? ""),
      companyName: String(fd.get("companyName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      country: String(fd.get("country") ?? ""),
      industry: String(fd.get("industry") ?? ""),
      inquiryType: String(fd.get("inquiryType") ?? inquiryType),
      productCategory,
      estimatedQuantity: String(fd.get("estimatedQuantity") ?? ""),
      quantityUnit: String(fd.get("quantityUnit") ?? ""),
      projectDescription: String(fd.get("projectDescription") ?? ""),
      targetPrice: String(fd.get("targetPrice") ?? ""),
      fragranceDirection: String(fd.get("fragranceDirection") ?? ""),
      requiredConcentration: String(fd.get("requiredConcentration") ?? ""),
      bottleSize: String(fd.get("bottleSize") ?? ""),
      packagingRequirements: String(fd.get("packagingRequirements") ?? ""),
      expectedTimeline: String(fd.get("expectedTimeline") ?? ""),
      sampleRequirements: String(fd.get("sampleRequirements") ?? ""),
      packagingCategories: isPackaging ? packagingCats : undefined,
      deliveryDestination: String(fd.get("deliveryDestination") ?? ""),
      componentReference: String(fd.get("componentReference") ?? ""),
      matchingRequirements: String(fd.get("matchingRequirements") ?? ""),
      material: String(fd.get("material") ?? ""),
      colourFinish: String(fd.get("colourFinish") ?? ""),
      capacitySize: String(fd.get("capacitySize") ?? ""),
      lineItems: cleanedLines,
      sourcePage:
        sourcePage ?? (typeof window !== "undefined" ? window.location.pathname : ""),
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
        fieldErrors?: Record<string, string[] | undefined>;
      };

      if (!res.ok || !data.ok || !data.reference) {
        const fieldErrors: FieldErrors = {};
        if (data.fieldErrors) {
          for (const [key, msgs] of Object.entries(data.fieldErrors)) {
            if (msgs?.[0]) fieldErrors[key as keyof InquiryInput] = msgs[0];
          }
        }
        fieldErrors.form = data.error ?? "Submission failed. Please review and try again.";
        setErrors(fieldErrors);
        setSubmitting(false);
        return;
      }

      setDone({ reference: data.reference });
      form.reset();
      setInquiryType(defaultType ?? "FRAGRANCE_TRADING");
      setPackagingCats([]);
      setLineItems([emptyLine()]);
      router.refresh();
    } catch {
      setErrors({ form: "Network error. Please check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div
        className="border border-champagne/40 bg-white p-8 md:p-10"
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-medium uppercase tracking-wideish text-champagne-deep">
          Inquiry received
        </p>
        <h2 className="mt-3 font-display text-3xl text-charcoal">Thank you</h2>
        <p className="mt-4 max-w-prose text-charcoal-muted leading-relaxed">
          Your inquiry has been saved. Please keep your reference number for follow-up
          correspondence.
        </p>
        <p className="mt-6 border border-charcoal/10 bg-ivory px-4 py-3 font-mono text-lg text-charcoal">
          {done.reference}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button type="button" onClick={() => setDone(null)}>
            Submit another inquiry
          </Button>
          <Button href="/" variant="secondary">
            Return home
          </Button>
        </div>
      </div>
    );
  }

  const fieldClass =
    "mt-1.5 w-full border border-charcoal/15 bg-white px-3.5 py-3 text-sm text-charcoal outline-none transition duration-soft focus:border-champagne focus:ring-1 focus:ring-champagne";
  const labelClass = "block text-sm font-medium text-charcoal";
  const errorClass = "mt-1 text-xs text-red-700";
  const checkClass =
    "flex cursor-pointer items-start gap-2.5 border border-charcoal/10 bg-ivory px-3 py-2.5 text-sm text-charcoal transition has-[:checked]:border-champagne/60 has-[:checked]:bg-white";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative space-y-2 border border-charcoal/10 bg-white p-6 md:p-10 lg:p-12"
    >
      <div className="mb-6">
        <h2 className="font-display text-2xl text-charcoal md:text-3xl">Project inquiry</h2>
        <p className="mt-2 max-w-prose text-sm text-charcoal-muted">{conditionalHint}</p>
      </div>

      {errors.form && (
        <div
          className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {errors.form}
        </div>
      )}

      <FormSection title="Your Company" description="Who we will quote for.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="companyName">
              Company name *
            </label>
            <input
              id="companyName"
              name="companyName"
              className={fieldClass}
              required
              autoComplete="organization"
            />
            {errors.companyName && <p className={errorClass}>{errors.companyName}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="industry">
              Industry *
            </label>
            <select id="industry" name="industry" className={fieldClass} required defaultValue="">
              <option value="" disabled>
                Select industry
              </option>
              {industries.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
            {errors.industry && <p className={errorClass}>{errors.industry}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="country">
              Country *
            </label>
            <input
              id="country"
              name="country"
              className={fieldClass}
              required
              autoComplete="country-name"
            />
            {errors.country && <p className={errorClass}>{errors.country}</p>}
          </div>
        </div>
      </FormSection>

      <FormSection title="Contact" description="Primary commercial contact.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="contactName">
              Contact person *
            </label>
            <input
              id="contactName"
              name="contactName"
              className={fieldClass}
              required
              autoComplete="name"
            />
            {errors.contactName && <p className={errorClass}>{errors.contactName}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={fieldClass}
              required
              autoComplete="email"
            />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">
              Telephone *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={fieldClass}
              required
              autoComplete="tel"
            />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>
        </div>
      </FormSection>

      <FormSection title="What You Need" description="Service type and commercial scale.">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="inquiryType">
              Requested service *
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              className={fieldClass}
              required
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value as (typeof inquiryTypes)[number])}
            >
              {inquiryTypes.map((t) => (
                <option key={t} value={t}>
                  {typeLabels[t]}
                </option>
              ))}
            </select>
            {errors.inquiryType && <p className={errorClass}>{errors.inquiryType}</p>}
          </div>
          {!isPackaging && (
            <div>
              <label className={labelClass} htmlFor="productCategory">
                Product category *
              </label>
              <input
                id="productCategory"
                name="productCategory"
                className={fieldClass}
                required={!isPackaging}
                placeholder="e.g. EDP, detergent, candle"
              />
              {errors.productCategory && <p className={errorClass}>{errors.productCategory}</p>}
            </div>
          )}
          <div>
            <label className={labelClass} htmlFor="estimatedQuantity">
              {isPackaging ? "Overall estimated quantity *" : "Estimated quantity *"}
            </label>
            <input
              id="estimatedQuantity"
              name="estimatedQuantity"
              className={fieldClass}
              required
              placeholder="e.g. 50"
            />
            {errors.estimatedQuantity && <p className={errorClass}>{errors.estimatedQuantity}</p>}
          </div>
          <div>
            <label className={labelClass} htmlFor="quantityUnit">
              Quantity unit *
            </label>
            <select
              id="quantityUnit"
              name="quantityUnit"
              className={fieldClass}
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select unit
              </option>
              {quantityUnits.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            {errors.quantityUnit && <p className={errorClass}>{errors.quantityUnit}</p>}
          </div>
        </div>
      </FormSection>

      {(isPackaging ||
        showTradingExtras ||
        showManufacturingExtras ||
        showPrivateLabelExtras) && (
        <FormSection
          title="Product / Packaging Requirements"
          description="Optional depth for a stronger quotation brief."
        >
          {isPackaging && (
            <>
              <p className="mb-3 text-sm font-medium text-charcoal">Packaging categories *</p>
              {errors.packagingCategories && (
                <p className={errorClass}>{errors.packagingCategories}</p>
              )}
              <div className="grid gap-2 sm:grid-cols-2">
                {packagingCategoryOptions.map((label) => (
                  <label key={label} className={checkClass}>
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-champagne"
                      checked={packagingCats.includes(label)}
                      onChange={() => togglePackagingCat(label)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="capacitySize">
                    Capacity / size
                  </label>
                  <input id="capacitySize" name="capacitySize" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="material">
                    Material
                  </label>
                  <input id="material" name="material" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="colourFinish">
                    Colour / finish
                  </label>
                  <input id="colourFinish" name="colourFinish" className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="deliveryDestination">
                    Delivery destination
                  </label>
                  <input
                    id="deliveryDestination"
                    name="deliveryDestination"
                    className={fieldClass}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="componentReference">
                    Bottle or component reference (optional)
                  </label>
                  <input id="componentReference" name="componentReference" className={fieldClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="matchingRequirements">
                    Matching / compatibility notes (optional)
                  </label>
                  <textarea
                    id="matchingRequirements"
                    name="matchingRequirements"
                    rows={3}
                    className={fieldClass}
                    placeholder="Describe matching needs. Compatibility is confirmed only after technical review."
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-medium text-charcoal">Line items (optional)</h3>
                  <Button
                    type="button"
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    onClick={() => setLineItems((prev) => [...prev, emptyLine()])}
                  >
                    Add line
                  </Button>
                </div>
                <div className="mt-4 space-y-4">
                  {lineItems.map((li, idx) => (
                    <div
                      key={idx}
                      className="grid gap-3 border border-charcoal/10 bg-ivory/50 p-4 md:grid-cols-2"
                    >
                      <div>
                        <label className={labelClass}>Category</label>
                        <select
                          className={fieldClass}
                          value={li.category}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLineItems((rows) =>
                              rows.map((r, i) => (i === idx ? { ...r, category: v } : r)),
                            );
                          }}
                        >
                          <option value="">Select</option>
                          {packagingCategoryOptions.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Quantity</label>
                        <input
                          className={fieldClass}
                          value={li.quantity}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLineItems((rows) =>
                              rows.map((r, i) => (i === idx ? { ...r, quantity: v } : r)),
                            );
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Capacity / size</label>
                        <input
                          className={fieldClass}
                          value={li.capacitySize ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLineItems((rows) =>
                              rows.map((r, i) => (i === idx ? { ...r, capacitySize: v } : r)),
                            );
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Material</label>
                        <input
                          className={fieldClass}
                          value={li.material ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLineItems((rows) =>
                              rows.map((r, i) => (i === idx ? { ...r, material: v } : r)),
                            );
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Colour / finish</label>
                        <input
                          className={fieldClass}
                          value={li.colourFinish ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLineItems((rows) =>
                              rows.map((r, i) => (i === idx ? { ...r, colourFinish: v } : r)),
                            );
                          }}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Notes</label>
                        <input
                          className={fieldClass}
                          value={li.notes ?? ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            setLineItems((rows) =>
                              rows.map((r, i) => (i === idx ? { ...r, notes: v } : r)),
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {(showTradingExtras || showPrivateLabelExtras) && !isPackaging && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClass} htmlFor="fragranceDirection">
                  Fragrance direction
                </label>
                <textarea
                  id="fragranceDirection"
                  name="fragranceDirection"
                  rows={3}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="requiredConcentration">
                  Required concentration
                </label>
                <input
                  id="requiredConcentration"
                  name="requiredConcentration"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="sampleRequirements">
                  Sample requirements
                </label>
                <input id="sampleRequirements" name="sampleRequirements" className={fieldClass} />
              </div>
            </div>
          )}

          {(showManufacturingExtras || showPrivateLabelExtras) && !isPackaging && (
            <div
              className={`grid gap-5 md:grid-cols-2 ${
                showTradingExtras || showPrivateLabelExtras ? "mt-5" : ""
              }`}
            >
              <div>
                <label className={labelClass} htmlFor="bottleSize">
                  Bottle size
                </label>
                <input id="bottleSize" name="bottleSize" className={fieldClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass} htmlFor="packagingRequirements">
                  Packaging requirements
                </label>
                <textarea
                  id="packagingRequirements"
                  name="packagingRequirements"
                  rows={3}
                  className={fieldClass}
                />
              </div>
            </div>
          )}
        </FormSection>
      )}

      <FormSection title="Project Details" description="Describe the opportunity in your own words.">
        <div>
          <label className={labelClass} htmlFor="projectDescription">
            Project details *
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            rows={5}
            className={fieldClass}
            required
            placeholder="Describe your product, application, and what support you need."
          />
          {errors.projectDescription && <p className={errorClass}>{errors.projectDescription}</p>}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="targetPrice">
              Target price
            </label>
            <input id="targetPrice" name="targetPrice" className={fieldClass} />
          </div>
          <div>
            <label className={labelClass} htmlFor="expectedTimeline">
              Expected project timeline
            </label>
            <input id="expectedTimeline" name="expectedTimeline" className={fieldClass} />
          </div>
        </div>
      </FormSection>

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-charcoal/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs text-charcoal-muted">
          By submitting, you agree to our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </a>
          . Fields marked * are required.
        </p>
        <Button type="submit" disabled={submitting} className="min-w-[10rem]">
          {submitting ? "Submitting…" : "Submit inquiry"}
        </Button>
      </div>
    </form>
  );
}
