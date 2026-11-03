# Alfath Portfolio

A flat, typography-led portfolio built from `Portfolio_PRD_Flat_Bold.md` with the Next.js App Router, Tailwind CSS, Motion, GSAP ScrollTrigger, and Lenis. It includes a details-first Education and Credentials area with an embedded PDF viewer.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Before publishing

Contact links are centralized in `lib/content.ts`. Project screenshots and destination links can be added later without changing the section structure.

Document metadata and viewer paths are centralized in `lib/content.ts`. Credential PDF assets live in `public/documents`; the diploma is presented as metadata only, while identity-bearing credential copies are redacted for portfolio use.

The bundled Fontshare families are free for personal and commercial use under Fontshare's published font licenses. Fragment Mono is distributed under the SIL Open Font License 1.1.

The PRD named Next.js 14. The implementation uses the maintained Next.js 16 line because npm's current audit marks the full Next.js 14 line with a high-severity advisory.
