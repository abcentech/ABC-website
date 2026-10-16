import { z } from 'zod'
const text = (max = 2000) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine(
      (s) => ![...s].some((c) => c.charCodeAt(0) < 32 && ![9, 10, 13].includes(c.charCodeAt(0))),
      'Control characters are not allowed',
    )
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(100)
const faq = z.object({ question: text(200), answer: text(2000) }).strict()
const related = slug.nullable()
export const contentSchema = z
  .object({
    services: z
      .array(
        z
          .object({
            slug,
            title: text(100),
            eyebrow: text(150),
            intro: text(500),
            problem: text(),
            solution: text(),
            deliverables: z.array(text(200)).min(1).max(12),
            questions: z.array(faq).max(20),
            related,
          })
          .strict(),
      )
      .min(1)
      .max(20),
    projects: z
      .array(
        z
          .object({
            slug,
            name: text(150),
            title: text(250),
            category: text(200),
            status: text(100),
            summary: text(),
            client: text(200),
            industry: text(200),
            approval: text(),
            visual: z.enum(['cold-chain', 'publishing', 'none']),
            cta: text(150),
            sections: z
              .array(
                z
                  .object({
                    heading: text(200),
                    body: text(5000),
                    items: z.array(text(300)).max(20),
                  })
                  .strict(),
              )
              .min(1)
              .max(20),
          })
          .strict(),
      )
      .max(50),
    industries: z
      .array(z.object({ name: text(150), description: text(), related }).strict())
      .max(30),
    team: z.array(z.object({ name: text(100), role: text(150), bio: text() }).strict()).max(30),
    insights: z
      .array(
        z
          .object({
            slug,
            title: text(200),
            summary: text(500),
            body: text(30000),
            published: z.iso.date(),
          })
          .strict(),
      )
      .max(100),
    testimonials: z.array(z.object({ quote: text(), attribution: text(200) }).strict()).max(30),
    faqs: z.array(faq).max(30),
  })
  .strict()
  .superRefine((value, ctx) => {
    for (const collection of ['services', 'projects', 'insights']) {
      const slugs = value[collection].map((item) => item.slug)
      if (new Set(slugs).size !== slugs.length)
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate ${collection} slug`,
          path: [collection],
        })
    }
    for (const collection of ['services', 'industries'])
      for (const entry of value[collection])
        if (entry.related && !value.projects.some((p) => p.slug === entry.related))
          ctx.addIssue({
            code: 'custom',
            message: 'Related project must exist',
            path: [collection],
          })
  })
export const leadSchema = z
  .object({
    name: text(100),
    organization: text(160),
    email: z.email().max(200).or(z.literal('')),
    notes: text(4000),
    status: z.enum(['New', 'Qualifying', 'Proposal', 'Won', 'Closed']),
    consent: z.literal(true),
  })
  .strict()
export const eventSchema = z
  .object({
    event: z.enum([
      'project_cta',
      'header_cta',
      'footer_whatsapp',
      'contact_whatsapp',
      'brief_whatsapp_open',
    ]),
    path: z
      .string()
      .regex(/^\/[a-z0-9/-]*$/)
      .max(180),
  })
  .strict()
