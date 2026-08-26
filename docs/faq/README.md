# Recipe portfolio FAQ

## How does Cooking Mode navigation work?

**Short answer:** Tap the left half of the cooking surface to go back and the right half to advance. Hold a method step for 600 ms to jump directly to it. Moving far enough to scroll cancels either gesture.

The weekly controls guide introduces this contract before cooking starts. Keyboard users can activate navigation controls with Enter or Space and jump to a focused method step.

### Sources

- [`Recipe.tsx`](../../src/Recipe.tsx) — interaction, guide, keyboard and accessibility behaviour.
- [`Recipe.test.tsx`](../../src/Recipe.test.tsx) — navigation, hold, movement-cancellation and guide coverage.

_Created: 2026-08-26 · Updated: 2026-08-26 · Verified: 2026-08-26 · Scope/version: `main` at `44c15fb`_

## Will recipes have dependency and schedule views?

**Short answer:** Proposed. A dependency graph would show which steps can happen independently and where they join. A separate optional Gantt-style view would explore how parallel work fits around waits, preheating and cooking time.

### Sources

- [Issue #35](https://github.com/lucharo/recipe-portfolio/issues/35) — recipe dependency graph.
- [Issue #52](https://github.com/lucharo/recipe-portfolio/issues/52) — optional Gantt-style cooking schedule.

_Created: 2026-08-26 · Updated: 2026-08-26 · Verified: 2026-08-26_

## Which units should recipe authors use?

**Short answer:** Prefer the simplest natural measure for the ingredient. “Two medium onions” is usually clearer than cups or grams of onion. Use precise weight where it materially helps the recipe.

Global and per-ingredient unit conversions are proposed, not implemented. Conversions need ingredient-aware equivalences rather than treating every volume as interchangeable with weight.

### Sources

- [Issue #53](https://github.com/lucharo/recipe-portfolio/issues/53) — standardised units and ingredient-aware conversions.

_Created: 2026-08-26 · Updated: 2026-08-26 · Verified: 2026-08-26_

## Can a timed method step start a timer?

**Short answer:** Proposed. A time shown with a method step should be actionable so the cook can start its timer directly, without adding pressure through estimated completion times for every step.

### Sources

- [Issue #11](https://github.com/lucharo/recipe-portfolio/issues/11) — timers started from timed recipe steps.

_Created: 2026-08-26 · Updated: 2026-08-26 · Verified: 2026-08-26_

## When should Cooking Mode cross out an ingredient?

**Short answer:** Proposed. An ingredient should retire only after its final use. If onions are used in two sections, they remain active until the second use is complete. Planning can keep a consolidated total while Cooking Mode shows the portion needed by each section.

### Sources

- [Issue #54](https://github.com/lucharo/recipe-portfolio/issues/54) — retire ingredients after their final use.

_Created: 2026-08-26 · Updated: 2026-08-26 · Verified: 2026-08-26_

## How will steps represent inputs and produced outputs?

**Short answer:** Proposed. A step may consume ingredients or earlier outputs and produce a named preparation for a later step. That model supports clearer ingredient highlighting and provides the material flow behind a recipe dependency graph.

### Sources

- [Issue #55](https://github.com/lucharo/recipe-portfolio/issues/55) — step inputs and produced outputs.
- [Issue #35](https://github.com/lucharo/recipe-portfolio/issues/35) — dependency graph that can consume the same model.

_Created: 2026-08-26 · Updated: 2026-08-26 · Verified: 2026-08-26_
