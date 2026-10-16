export type BriefValues = {
  service: string
  description: string
  budget: string
  start: string
  name: string
  organization: string
  email: string
  country: string
  consent: boolean
  website: string
}
export const emptyBrief: BriefValues = {
  service: '',
  description: '',
  budget: '',
  start: '',
  name: '',
  organization: '',
  email: '',
  country: '',
  consent: false,
  website: '',
}
export const budgetRanges = [
  '$1k–$5k',
  '$5k–$15k',
  '$15k–$30k',
  '$30k–$50k',
  '$50k–$100k',
  'Above $100k',
  'Not sure',
]
export function createBriefMessage(values: BriefValues, serviceTitle: string) {
  const clean = (value: string) => value.trim()
  return [
    'Hello Ark Builders, I’d like to discuss a project.',
    '',
    `Service: ${clean(serviceTitle)}`,
    '',
    clean(values.description),
    '',
    `Budget: ${clean(values.budget)}`,
    `Desired start: ${clean(values.start) || 'Flexible / to discuss'}`,
    '',
    `Name: ${clean(values.name)}`,
    `Organization: ${clean(values.organization)}`,
    `Work email: ${clean(values.email)}`,
    `Country: ${clean(values.country)}`,
  ].join('\n')
}
export function stepError(step: number, values: BriefValues, serviceSlugs: string[]) {
  if (values.website) return 'Please leave the website field empty.'
  if (step === 0 && ![...serviceSlugs, 'not-sure'].includes(values.service))
    return 'Choose a service, or select “Let’s figure it out together”.'
  if (step === 1 && values.description.trim().length < 30)
    return 'Tell us a little more about the challenge—at least 30 characters.'
  if (step === 1 && !budgetRanges.includes(values.budget))
    return 'Choose a budget range. “Not sure” is a useful starting point too.'
  if (
    step === 2 &&
    (!values.name.trim() ||
      !values.organization.trim() ||
      !values.country.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
  )
    return 'Please complete your name, organization, work email and country.'
  if (step === 2 && !values.consent)
    return 'Please confirm that you understand how your brief is shared.'
  return ''
}
