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

- **The Daily Resonance Check** — "What kind of signal are you carrying
  today?" Ten sensory signals (Static, Ember, Fog, Current, Stone, Spark,
  River, Bell, Storm, Moonwater), each with a reading and a matching practice,
  plus a "recent weather" strip. No streaks, no guilt — missed days are quiet sky.
- **The Field Guide** — journaling with rotating prompts ("Where is the static
  living in your body?"). Entries are stored only on your device.
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
js/signals.js         Daily Resonance Check signals + readings
js/fieldguide.js      Field Guide prompts + on-device storage helpers
js/audio.js           Web Audio engine (noise, drone, breath swell, chime)
js/app.js             router, screens, practice player, starfield
sw.js                 offline cache
manifest.webmanifest  PWA install metadata
```

## Privacy

Check-in history and journal entries are stored in the browser's
`localStorage` on your device. Nothing is sent anywhere. Deleting an entry
really deletes it.

## Roadmap

The original feature set is complete. Ideas for later: gentle reminders,
export/backup of journal entries, an AI-powered conversational Vibe
Translator, more practices and library entries.

## Philosophy

Everything responds to input. So choose the input with care.
