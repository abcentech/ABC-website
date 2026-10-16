import type { Content } from './content/types'
export function routes(content: Content) {
  return [
    '/',
    '/services',
    ...content.services.map((s) => `/services/${s.slug}`),
    '/work',
    ...content.projects.map((p) => `/work/${p.slug}`),
    '/industries',
    '/capabilities',
    '/contact',
    '/start-project',
    '/insights',
    ...content.insights.map((p) => `/insights/${p.slug}`),
    '/privacy',
  ]
}
export function pageMeta(path: string, content: Content) {
  const service = content.services.find((s) => path === `/services/${s.slug}`)
  const project = content.projects.find((p) => path === `/work/${p.slug}`)
  const post = content.insights.find((p) => path === `/insights/${p.slug}`)
  const pages: Record<string, [string, string]> = {
    '/': [
      'Technology That Moves Businesses Forward',
      'Ark Builders connects consulting, software and hardware to help organizations grow. Explore our work and discuss your next technology project.',
    ],
    '/services': [
      'Technology Services',
      'Websites, custom software, mobile applications, AI automation, consulting and hardware infrastructure. Explore Ark Builders services.',
    ],
    '/work': [
      'Selected Work',
      'Explore Ark Builders’ software contribution to BASE / Coldtivate and the Church Times Nigeria publishing platform in development.',
    ],
    '/industries': [
      'Industries',
      'Technology for education, agriculture, financial services, media, nonprofits, public institutions and enterprise operations.',
    ],
    '/capabilities': [
      'Capabilities & Procurement',
      'Explore Ark Builders’ delivery approach and download our company capability statement for project planning and procurement.',
    ],
    '/contact': [
      'Contact Ark Builders',
      'Speak with Ark Builders in Lagos, Nigeria. Connect on WhatsApp, email or telephone about your technology requirements.',
    ],
    '/start-project': [
      'Start a Project',
      'Prepare a project brief and discuss your goals, scope, budget and timeline directly with Ark Builders on WhatsApp.',
    ],
    '/insights': [
      'Insights',
      'Practical thinking on technology decisions, digital delivery and better business systems from Ark Builders.',
    ],
    '/privacy': [
      'Privacy & Cookies',
      'How Ark Builders handles WhatsApp enquiries, optional first-party analytics and essential administration sessions.',
    ],
    '/admin': ['Administration', 'Authorized Ark Builders administrators only.'],
  }
  const [title, description] = service
    ? [service.title, service.intro]
    : project
      ? [project.name, project.summary]
      : post
        ? [post.title, post.summary]
        : pages[path] || ['Page Not Found', 'Find your way back to Ark Builders.']
  return {
    title: `${title} | Ark Builders`,
    description,
    noindex: path === '/admin' || !routes(content).includes(path),
  }
}
