import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import source from './content/site.json'
import type { Content } from './content/types'
const node = document.getElementById('site-content')
const content = node?.textContent ? (JSON.parse(node.textContent) as Content) : (source as Content)
const path = location.pathname.replace(/\/$/, '') || '/'
const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App path={path} content={content} />
  </StrictMode>
)
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
