import { renderToString } from 'react-dom/server'
import App from './App'
import source from './content/site.json'
import type { Content } from './content/types'
export { routes, pageMeta } from './routes'
export const defaultContent = source as Content
export function render(path: string, content: Content) {
  return renderToString(<App path={path} content={content} />)
}
