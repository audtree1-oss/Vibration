# Resonance

*A science-backed, mystical-feeling state-shifting app.*

> You are not broken. You are responsive.
> And because you are responsive, you can be gently retuned.

Resonance takes "raise your vibration" and makes it honest: your body responds to
real inputs — sound, breath, movement, light, touch, attention, expression — and
you can use those inputs to shift your state. Every practice has two layers:

- **The poetic layer** — beautiful, sensory, ritual-feeling
- **The science layer** — one honest note about the actual mechanism

Ritual with receipts. No fake healing frequencies, no shame about "low vibration."

## What's inside (v1: The Tuning Room)

Pick the state you're in — Scattered, Heavy, Overstimulated, Numb, Tender, Angry,
Low-energy, Restless, Creative-but-blocked, Grief-static, or "I don't know, just
weird" — and get a 1–5 minute guided practice with a breathing orb, gentle
synthesized sound (brown noise, low drones, breath-pacing tones — all generated
live, no audio files), and a science note at the end.

Also included:

- **The Frequency Library** — real phenomena (resonance, entrainment, HRV,
  circadian rhythm, why humming feels holy, why silence feels loud...), each
  told three ways: poetic truth / scientific truth / try it now
- **The Vibe Translator** — type something mystical ("I need to raise my
  vibration") and get it translated into grounded nervous-system language,
  entirely on-device
- **What We Mean / What We Don't Mean** — the built-in bullshit filter

## Running it

It's a fully static app. No build step, no dependencies.

```
python3 -m http.server 8000
# then open http://localhost:8000
```

Deployed automatically to GitHub Pages via `.github/workflows/deploy.yml`.
On a phone, open the site and use **Share → Add to Home Screen** to install it
as an app (works offline).

## Structure

```
index.html            app shell
css/style.css         celestial dark theme
js/practices.js       states + practices content (edit this to add practices)
js/library.js         Frequency Library entries (poetic/science/try-it)
js/translator.js      Vibe Translator lexicon + matcher
js/audio.js           Web Audio engine (noise, drone, breath swell, chime)
js/app.js             router, screens, practice player, starfield
sw.js                 offline cache
manifest.webmanifest  PWA install metadata
```

## Roadmap

- **Daily Resonance Check** — "What kind of signal are you carrying today?"
  (Static, Ember, Fog, Current, Stone, Spark, River, Bell, Storm, Moonwater)
  with on-device history
- **Field Guide** — journaling prompts ("Where is the static living in your body?")

## Philosophy

Everything responds to input. So choose the input with care.
