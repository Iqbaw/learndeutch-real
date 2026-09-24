# Deutsch 30 — a small daily ritual

## Requirement and direction
Mobile is an application, with first-visit onboarding, a login/guest choice, then a compact learning home. Returning guest profiles retain their progress. Desktop keeps a public landing page and receives the same warmer, more deliberate application system. No fabricated progress or account functionality.

The existing Next.js application already supplies Manrope, Atkinson Hyperlegible, Lucide, Framer Motion, accessible CTA primitives, real lessons and Zustand persistence. Preserve those resources and the yellow/red brand. The missing service is remote authentication. The repository skills' referenced `references/` directories are absent; use their available entrypoints and inspect live references directly.

## Design read
Warm, confident, lightly playful. Moderate visual variance, low motion intensity, low mobile information density, distinctive learning object. Use butter yellow, charcoal and warm paper, with a pale sage speaking surface. The signature object is a language postcard: `Hallo!`, a translation, and a small German tricolor. Real learning content is the visual material; no decorative stock photography or 3D dependency is needed.

Type: retain Manrope headings and readable Atkinson body. App headings 24–30px, body 15–16px, labels 12px. Only the greeting on the onboarding postcard is display size; it is the actual German word being introduced. Form controls and key mobile targets are at least 44px. Forms use 16px inputs to avoid mobile browser zoom. Panels 20–28px, controls 14–16px, navigation active states pill-shaped. Avoid rendering every metric as a separate card.

## Reference evidence and translation
- Existing Logo, CTAButton and MissionCard: preserve yellow/red identity, consistent focus/press states; replace sprawling dashboard composition with one lesson and grouped secondary actions.
- Radix Tabs, https://www.radix-ui.com/primitives/docs/components/tabs : inspected live demo and keyboard behavior specification. Borrow explicit selected states and one-panel-at-a-time disclosure. Use native links for route navigation and local CTA primitives for actions.
- Apple onboarding and Material navigation pages were fetched, but returned JavaScript-only shells; no visual conclusions drawn from those fetches.

## Implementation contract
- Short onboarding with explicit next/back and persisted goal/time, finishing at login.
- Guest creates a real local profile; login never pretends to authenticate without a provider.
- All app routes share a persistent bottom dock on mobile; a compact library hub keeps every existing feature reachable.
- Home shows real day, lesson, streak, XP and progress. Detailed analytics live on their existing route.
- Safe areas and dynamic viewport height; allow vertical overflow for keyboard, zoom and short screens rather than clipping content.
- 160ms press feedback and 250ms directional step transitions; reduced-motion setting disables spatial transitions.
- Validate first visit, returning visit, guest persistence, navigation, small phone and desktop, and production build.

## Vocabulary learning surface

Vocabulary is a focused daily study flow. Show six clear level choices (A1–C2), one word and original contextual sentence at a time, a deliberate meaning reveal, then Previous/Next. Keep the next-word control reachable above the mobile dock. Search and topic filters narrow the active level; the optional list shows twelve words per page. Progress counts refer to words actually added to Review or mastered there, never to cards merely viewed. Preserve existing word IDs so saved review progress remains intact.

The bank is an internally curated selection of useful words and expressions, not a complete or official exam list and not a measured frequency ranking. Select A1–B1 topics from everyday communication and B2–C2 material from argumentation, specialist and idiomatic language, reflecting the [CEFR vocabulary range descriptors](https://rm.coe.int/cefr-companion-volume-with-new-descriptors-2020/16809ea0d4). The [Goethe A1 word-list introduction](https://www.goethe.de/pro/relaunch/prf/de/A1_SD1_Wortliste_02.pdf) distinguishes passive recognition from active use and recommends didactically structured materials for retention; keep example, reveal, and Review as distinct steps. Continue to use warm paper, yellow for the active level and reveal, restrained card motion, and reduced-motion support.
