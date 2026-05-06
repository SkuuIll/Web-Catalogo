import { z } from "zod";

const optionalText = z.string().trim().max(5000).optional().nullable();
const optionalShortText = z.string().trim().max(500).optional().nullable();
const optionalUrl = z.string().trim().max(1000).optional().nullable();
const nullableDate = z
  .union([z.string().trim().min(1), z.null(), z.literal("")])
  .optional()
  .transform((value) => (value ? new Date(value) : null));

export const productStatusSchema = z.enum(["PUBLISHED", "PAUSED", "DRAFT", "SOLD_OUT"]);

export const productCreateSchema = z.object({
  name: z.string().trim().min(1, "Nombre requerido").max(180),
  slug: z.string().trim().max(220).optional().nullable(),
  description: optionalText,
  shortDescription: optionalShortText,
  brand: optionalShortText,
  model: optionalShortText,
  sizes: optionalShortText,
  colors: optionalShortText,
  specs: optionalText,
  price: z.coerce.number().finite().min(0),
  compareAtPrice: z.coerce.number().finite().min(0).optional().nullable(),
  deliveryMode: z.string().trim().optional().nullable(),
  status: productStatusSchema.optional(),
  categoryId: z.string().trim().min(1, "Categoría requerida"),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  whatsappMessageOverride: optionalText,
  metaTitle: optionalShortText,
  metaDescription: optionalShortText,
  metaKeywords: optionalShortText,
  ogImageUrl: optionalUrl,
});

export const productUpdateSchema = productCreateSchema.partial();

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(160),
  description: optionalText,
  imageUrl: optionalUrl,
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export const categoryUpdateSchema = categorySchema.partial();

export const bannerSchema = z.object({
  title: z.string().trim().min(1).max(180),
  imageUrl: z.string().trim().min(1).max(1000),
  linkUrl: optionalUrl,
  linkText: optionalShortText,
  position: z.string().trim().max(60).optional(),
  active: z.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
  startDate: nullableDate,
  endDate: nullableDate,
});

export const bannerUpdateSchema = bannerSchema.partial();

export const siteConfigSchema = z
  .object({
    siteName: optionalShortText,
    siteSlogan: optionalShortText,
    logoUrl: optionalUrl,
    faviconUrl: optionalUrl,
    appIconUrl: optionalUrl,
    primaryColor: optionalShortText,
    secondaryColor: optionalShortText,
    whatsappNumber: optionalShortText,
    whatsappMessage: optionalText,
    whatsappButtonText: optionalShortText,
    whatsappButtonEnabled: z.boolean().optional(),
    heroTitle: optionalShortText,
    heroSubtitle: optionalText,
    heroImageUrl: optionalUrl,
    bannerImageUrl: optionalUrl,
    twitterHandle: optionalShortText,
    instagramHandle: optionalShortText,
    facebookUrl: optionalUrl,
    metaTitle: optionalShortText,
    metaDescription: optionalText,
    metaKeywords: optionalText,
    footerText: optionalText,
    termsTitle: optionalShortText,
    termsContent: optionalText,
    privacyTitle: optionalShortText,
    privacyContent: optionalText,
    faqTitle: optionalShortText,
    faqContent: optionalText,
    aboutTitle: optionalShortText,
    aboutContent: optionalText,
    contactTitle: optionalShortText,
    contactContent: optionalText,
    showProductCount: z.boolean().optional(),
    showCategoryCount: z.boolean().optional(),
    shippingBadge: optionalShortText,
    warrantyBadge: optionalShortText,
    returnsBadge: optionalShortText,
    supportBadge: optionalShortText,
    currencySymbol: optionalShortText,
    currencyCode: optionalShortText,
    maintenanceMode: z.boolean().optional(),
    maintenanceTitle: optionalShortText,
    maintenanceMessage: optionalText,
    aiProvider: z.enum(["GEMINI", "OPENAI", "ANTHROPIC", "GROQ", "MISTRAL", "OPENROUTER"]).optional(),
    aiApiKey: optionalShortText,
  })
  .strip();

export function zodErrorMessage(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(". ");
}
