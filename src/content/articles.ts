export type Article = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingMinutes: number;
  tags: string[];
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "fine-fragrance-vs-industrial-fragrance",
    title: "Fine Fragrance vs Industrial Fragrance",
    description:
      "A practical overview of how fine fragrance concentrates differ from industrial fragrance used in functional products.",
    publishedAt: "2026-03-01",
    readingMinutes: 6,
    tags: ["Fragrance", "Sourcing"],
    body: [
      "Fragrance buyers often use the same word — “fragrance” — for very different materials. Understanding the distinction between fine fragrance and industrial fragrance helps teams brief suppliers more clearly and evaluate samples against the right criteria.",
      "Fine fragrance concentrates are typically developed for perfume and related alcoholic fragrance products. Evaluation focuses on character, longevity, diffusion, and how the scent evolves over time on skin or in spray formats.",
      "Industrial fragrance concentrates are selected for functional products such as detergents, cleaners, and certain personal or home care formats. Performance under processing conditions, cost-in-use, and compatibility with the base formula often matter as much as olfactory character.",
      "Neither category is inherently “better.” The right choice depends on the end product, regulatory context for your market, dosage expectations, and commercial constraints. Clear briefs that state application, dosage range, and evaluation method reduce sample cycles.",
      "When requesting samples from a trading partner, specify whether you need fine fragrance or industrial fragrance direction, the product format, and any known constraints. That context allows more relevant options to be shortlisted.",
    ],
  },
  {
    slug: "understanding-fragrance-concentration",
    title: "Understanding Fragrance Concentration",
    description:
      "How fragrance dosage and finished-product concentration levels relate to sampling, costing, and manufacturing.",
    publishedAt: "2026-03-08",
    readingMinutes: 5,
    tags: ["Manufacturing", "Development"],
    body: [
      "“Concentration” can refer to two related ideas: the dosage of fragrance concentrate in a finished formula, and the marketing classification of perfume products (such as eau de parfum versus eau de toilette).",
      "For B2B development, the practical question is usually dosage: how much fragrance oil or concentrate will be used in the finished product, and whether that dosage is compatible with the base, process, and cost target.",
      "Higher dosage does not automatically mean a better product. Stability, clarity, skin feel, burn performance (for candles), and regulatory limits can all constrain how much fragrance a formula can carry.",
      "During sampling, ask suppliers to recommend a starting dosage for your application and to note whether the material is intended for alcoholic fine fragrance, emulsion systems, surfactants, or wax. Matching dosage guidance to application avoids misleading evaluations.",
      "When moving from sample approval to commercial supply, confirm that the quoted material, dosage assumptions, and packaging units align with your production plan. Misaligned assumptions are a common source of quotation rework.",
    ],
  },
  {
    slug: "private-label-perfume-manufacturing",
    title: "Private-Label Perfume Manufacturing",
    description:
      "What brands should prepare before starting a private-label perfume project with a manufacturing partner.",
    publishedAt: "2026-03-15",
    readingMinutes: 7,
    tags: ["Private Label", "Process"],
    body: [
      "Private-label perfume projects succeed when commercial and creative expectations are documented early. A manufacturing partner can support fragrance selection, sampling, packaging coordination, and production — but clarity on scope prevents delays.",
      "Start with the product concept: target customer, scent direction, bottle size, fill volume, and expected launch timeline. Even preliminary answers help prioritize sampling and packaging options.",
      "Decide what you will supply and what you need the partner to source. Some brands provide fragrance compounds and packaging; others need support across fragrance, bottles, closures, labels, and cartons. Approved materials and alternatives should be listed explicitly.",
      "Sampling and evaluation should follow a defined path: shortlist, sample review, revision if needed, and written approval before commercial quotation and production planning. Verbal approvals are easy to misunderstand across teams.",
      "Not every capability may sit under one roof. Blending, filling, and specialized packaging steps can involve coordinated partners. Ask which steps are performed in-house and which require external collaboration so timelines and responsibilities stay transparent.",
      "A strong brief plus realistic volume and timeline expectations is the fastest path from concept to a manufacturable finished product.",
    ],
  },
  {
    slug: "fragrance-selection-for-detergents",
    title: "Fragrance Selection for Detergents",
    description:
      "Key considerations when selecting industrial fragrance for laundry and home-care detergent products.",
    publishedAt: "2026-03-22",
    readingMinutes: 6,
    tags: ["Industrial", "Home Care"],
    body: [
      "Detergent fragrance selection is an application problem as much as a creative one. Surfactant systems, pH, processing temperatures, and storage conditions can all affect how a fragrance performs.",
      "Define the product format early: powder, liquid, capsule, fabric softener, or surface cleaner. Each format can favor different olfactory and technical profiles.",
      "Cost-in-use matters. A fragrance that smells excellent at high dosage may be commercially unviable. Share target dosage and cost bands when requesting recommendations so samples reflect realistic use levels.",
      "Evaluate samples in the actual base whenever possible. Smelling concentrate on a blotter is useful for character screening, but in-product evaluation reveals bloom, persistence after wash, and unwanted interactions.",
      "Regulatory and market labeling requirements vary by region. Confirm with your compliance team which constraints apply before finalizing a commercial fragrance selection.",
      "A clear technical brief — format, dosage, cost band, and evaluation method — shortens the path from first sample to approved supply.",
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
