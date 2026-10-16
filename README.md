# Ark Builders website

React 19 + TypeScript + Vite, with prerendered public pages, WhatsApp project briefs, and optional Node.js 24 content administration/aggregate analytics. The existing GitHub Pages custom domain is retained.

```sh
npm ci
npm run dev
```

For a built-site staging check, run `npm run build` then `npm run server`. The public site needs no email credentials: visitors review and send enquiries directly in WhatsApp. Nothing is automatically submitted by the project form.

- [Audit and phased implementation](docs/UPGRADE.md)
- [Development, CMS, staging and deployment](docs/DEPLOYMENT.md)
- [Validation, page inventory and outstanding approvals](docs/VALIDATION.md)
- [Premium motion, imagery and dark mode](docs/PREMIUM-MOTION.md)
- [Screenshots](docs/screenshots/)

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` and `npm run test:e2e`. No production deployment is authorized by these commands. The existing Pages workflow deploys on pushes to main; obtain explicit approval before merging/pushing to main.
