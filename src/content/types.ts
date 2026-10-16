import source from './site.json'
export type SiteContent = typeof source
export type Service = SiteContent['services'][number]
export type Project = SiteContent['projects'][number]
export type FAQ = { question: string; answer: string }
export type Insight = {
  slug: string
  title: string
  summary: string
  body: string
  published: string
}
export type TeamMember = { name: string; role: string; bio: string }
export type Testimonial = { quote: string; attribution: string }
export type Content = Omit<SiteContent, 'team' | 'insights' | 'testimonials'> & {
  team: TeamMember[]
  insights: Insight[]
  testimonials: Testimonial[]
}
