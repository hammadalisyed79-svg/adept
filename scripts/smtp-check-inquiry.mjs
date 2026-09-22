/**
 * Submit one clearly marked test inquiry to public site; print reference only.
 */
const base = process.argv[2] || "https://www.adeptfragrances.com";
const stamp = Date.now();
const payload = {
  contactName: "SMTP Check Test",
  companyName: "ADEPT SMTP Test",
  email: `smtp-check-${stamp}@example.com`,
  phone: "+1 555 0100",
  country: "United Arab Emirates",
  industry: "Fine Fragrance",
  inquiryType: "FRAGRANCE_TRADING",
  productCategory: "SMTP delivery check",
  estimatedQuantity: "1",
  quantityUnit: "kg",
  projectDescription:
    "OPERATIONAL SMTP CHECK ONLY — ignore commercially. Confirm email notification to info@adeptfragrances.com.",
  sourcePage: "/request-quote",
  website: "",
};

const res = await fetch(`${base}/api/inquiries`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const text = await res.text();
let json;
try {
  json = JSON.parse(text);
} catch {
  json = { raw: text.slice(0, 300) };
}
console.log(
  JSON.stringify(
    {
      http: res.status,
      ok: Boolean(json.ok),
      reference: json.reference || null,
      message: json.message || json.error || null,
    },
    null,
    2,
  ),
);
