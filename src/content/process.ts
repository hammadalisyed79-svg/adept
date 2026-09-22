export const processSteps = [
  {
    number: "01",
    title: "Brief",
    short: "Define category, volumes, markets, and the support required.",
    description:
      "Establish product category, intended volumes, markets, and whether the engagement calls for trading, manufacturing, or private-label support.",
  },
  {
    number: "02",
    title: "Selection",
    short: "Shortlist fragrance or packaging options against the brief.",
    description:
      "Application requirements are reviewed with care. Fragrance concentrates or packaging components are shortlisted to suit both technical fit and commercial parameters.",
  },
  {
    number: "03",
    title: "Sampling",
    short: "Arrange samples for considered evaluation.",
    description:
      "Where appropriate, fragrance or component samples are arranged so your team may evaluate materials against the agreed brief.",
  },
  {
    number: "04",
    title: "Approval",
    short: "Confirm direction once samples have been assessed.",
    description:
      "Your team assesses samples in context. Feedback informs refinements — or confirms the preferred commercial direction.",
  },
  {
    number: "05",
    title: "Production",
    short: "Plan materials, batching, and production windows.",
    description:
      "Approved work advances into materials planning, batch scheduling, packaging readiness, and agreed production windows.",
  },
  {
    number: "06",
    title: "Quality",
    short: "Apply in-process checks suited to the scope.",
    description:
      "Manufacturing proceeds with in-process checks appropriate to the product type and the scope confirmed in writing.",
  },
  {
    number: "07",
    title: "Packing",
    short: "Prepare primary and secondary presentation as agreed.",
    description:
      "Primary and secondary packaging are prepared to the confirmed order — including presentation standards set for the brand.",
  },
  {
    number: "08",
    title: "Dispatch",
    short: "Release goods against confirmed logistics instructions.",
    description:
      "Finished goods or agreed materials are prepared for dispatch in accordance with the confirmed order and logistics instructions.",
  },
] as const;

/** Four homepage phases (full eight-step detail remains on /process) */
export const homepageProcessPhases = [
  {
    number: "01",
    title: "Brief & Selection",
    text: "Define the brief, then shortlist fragrance or packaging with precision.",
  },
  {
    number: "02",
    title: "Sampling & Approval",
    text: "Evaluate samples and confirm the commercial direction.",
  },
  {
    number: "03",
    title: "Production & Quality",
    text: "Plan production and apply checks suited to the agreed scope.",
  },
  {
    number: "04",
    title: "Packing & Dispatch",
    text: "Complete presentation and release against confirmed logistics.",
  },
] as const;
