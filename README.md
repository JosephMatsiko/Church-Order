# Decently and in Order

A study app for Presbyterian church government as the Presbyterian Church in America
holds it, built on the 2026 Book of Church Order. Forty-seven lessons in thirteen units,
141 questions, twelve invented cases, eight process maps, a glossary, a table of every
quorum and deadline, and three working tools.

Next.js 16, React 19, TypeScript. No UI framework, no component library: one hand-written
design system in `src/app/globals.css`.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

## Deploy to Vercel

```bash
npm i -g vercel      # once
vercel               # preview
vercel --prod        # production
```

Or push the repo to GitHub and import it at vercel.com. No configuration is needed:
every page except the API route is prerendered at build time.

### Hosting behaviour

`vercel.json` carries the cache policy (immutable for hashed `/_next/static/`
assets, a week for images) and the security headers, so it stays in version
control and travels with the branch rather than living in the dashboard.

There is deliberately no Content-Security-Policy yet: the app ships an inline
theme script and Next injects its own inline hydration scripts, so a policy
strict enough to be worth having needs nonces, and one loose enough to work
without them (`script-src 'unsafe-inline'`) buys little. Worth adding against a
real deployment, where it can be tested.

### The canonical origin

Open Graph and Twitter card images are absolute URLs, so the build needs to know the
site's origin. Vercel sets `VERCEL_PROJECT_PRODUCTION_URL` to the project's production
domain (the custom domain once one is attached, otherwise the `.vercel.app` one), and
`src/app/layout.tsx` reads it, so there is normally nothing to set. Override it with
the `SITE_URL` environment variable; the literal in that file is only a last resort
when neither is set, and is worth correcting if the Vercel project is named something
other than `church-order`.

### Optional: the Ask box

Each lesson can carry a question box that answers from that lesson's own material.
It appears only when an API key is present.

1. In the Vercel project, add an environment variable `ANTHROPIC_API_KEY`.
2. Optionally set `ANTHROPIC_MODEL` (defaults to `claude-sonnet-5`).
3. Redeploy.

Locally, put the same key in `.env.local`. The key never reaches the browser: the call
is made in `src/app/api/ask/route.ts`, which runs on the server.

## How the content works

`src/content/content.json` is the single source of truth: metadata, units, lessons,
cases, processes, the glossary, the thresholds table, the chapter map, and a map from
every Book of Church Order section to its page in the official 2026 PDF.

`npm run data` regenerates the static files the client fetches (`public/data/*.json`),
and it runs automatically before every build. To change a lesson, edit `content.json`
and rebuild.

Each block in a lesson carries its citations in `c`, and an optional confidence key `k`:

- no key, or `ok`: written from the cited section of the current text
- `int`: a teaching summary, shown in the margin as such
- `unv`: rests on an account that was not checked against a primary source

The counts on the home page and the Reference page are derived from the content at build
time, so they cannot drift from it.

## Structure

```
src/app/            routes: home, lessons/[id], practice, cases/[id], processes, reference, tools
src/components/     shell, command palette, citation sheet, quiz, flashcards, tools
src/lib/            typed content access, citation resolver, progress store
src/content/        content.json
scripts/            build-data.mjs
public/data/        generated; do not edit by hand
```

## What it does

- **Course.** Thirteen units, each lesson with its citations in the margin, Scripture in
  view, terms, and its own questions.
- **Practice.** An exam that draws at random from the whole course or one unit and keeps
  accuracy by unit; a Leitner flashcard deck built from the glossary and the thresholds;
  twelve cases with staged answers.
- **Processes.** Eight sequences, step by step, each step tied to its provision.
- **Tools.** A deadline calculator that counts out every period in the Rules of Discipline
  from the dates you enter; a quorum and threshold calculator; a remedy finder that names
  the right instrument in two or three questions.
- **Reference.** The whole book chapter by chapter with page links, the glossary, the
  thresholds table, and the sources with the method.
- **Command palette.** ⌘K or `/` searches lessons, chapters, terms, numbers, cases and
  processes.

- **Installable.** A web manifest, maskable icons and a service worker: add it to the
  iPhone or Android home screen and it opens full screen and works offline after the
  first visit. Bump `VERSION` in `public/sw.js` to invalidate the cache after a content
  change.
- **Social card.** `/opengraph-image` renders at request time in the app's own typefaces.

Progress lives in the browser under `decently:v2`. Nothing is sent anywhere.

## A note on the text

The 2026 Book of Church Order carries a notice against reproducing its text without
written permission from the Office of the Stated Clerk, and names electronic resources
and AI models in particular. Every provision here is paraphrased and cited, and none of
its wording is reproduced. The Westminster Confession and Catechisms are public domain
and are quoted. Check any provision against the current text before relying on it in a
court of the church.
