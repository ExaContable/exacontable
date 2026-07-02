---
name: design-system-outreachx-ai-agency-landing-page-template
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Clario – Finance Dashboard Template for Framer

## Mission
Create implementation-ready, token-driven UI guidance for Clario – Finance Dashboard Template for Framer that is optimized for consistency, accessibility, and fast delivery across marketing site.

## Brand
- Product/brand: Clario – Finance Dashboard Template for Framer
- URL: https://clario.framer.website/#features
- Audience: authenticated users and operators
- Product surface: marketing site

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=Manrope`, `font.family.stack=Manrope, Manrope Placeholder, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=10px`, `font.size.sm=12px`, `font.size.md=14px`, `font.size.lg=15px`, `font.size.xl=16px`, `font.size.2xl=18px`, `font.size.3xl=20px`, `font.size.4xl=24px`
- Color palette: `color.text.primary=#ffffff`, `color.text.secondary=#0000ee`, `color.text.tertiary=#8cff2e`, `color.surface.base=#000000`, `color.surface.muted=#050505`, `color.surface.strong=#171717`
- Spacing scale: `space.1=8px`, `space.2=11px`, `space.3=12px`, `space.4=16px`, `space.5=20px`, `space.6=22px`, `space.7=30px`, `space.8=40px`
- Radius/shadow/motion tokens: `radius.xs=10px`, `radius.sm=23px`, `radius.md=25px`, `radius.lg=30px` | `shadow.1=rgba(132, 255, 31, 0.32) 0px 8px 20px 0px`, `shadow.2=rgb(23, 23, 23) 0px 0px 0px 4px, rgba(23, 23, 23, 0.15) 0px 1px 0px 0px inset, rgba(23, 23, 23, 0.15) 0px -1px 0px 0px inset, rgba(23, 23, 23, 0.4) 0px 1px 2px 0px, rgba(23, 23, 23, 0.19) 0px 3px 8px 0px, rgba(23, 23, 23, 0.05) 0px 6px 4px 0px, rgba(23, 23, 23, 0.01) 0px 11px 4px 0px, rgba(23, 23, 23, 0) 0px 16px 5px 0px`, `shadow.3=rgba(0, 0, 0, 0.25) 0px 1px 2px 1px`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (42), lists (4), navigation (1).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
