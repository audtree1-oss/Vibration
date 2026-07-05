// The Vibe Translator — mystical language in, grounded language out.
// Philosophy: mystical phrasing is not wrong, it's compressed. Underneath,
// it's usually saying something real about the nervous system, the senses,
// the environment, or a need. We honor the phrase and X-ray it.
//
// Matching is on-device keyword/phrase patterns. Each pattern contributes a
// grounded fragment; matched fragments are stitched into the translation.
// `state` optionally points the user to a matching Tuning Room state.

const TRANSLATOR = {
  examples: [
    'I need to raise my vibration',
    'This room has bad energy',
    'That person drains my energy',
    'My chakras feel blocked',
    'I need to cleanse my aura',
    'I feel so ungrounded today',
    'The vibes are off',
    'I’m trying to manifest something better',
  ],

  patterns: [
    {
      match: /raise\s+(my|your|the)?\s*vibrat|high(er)?\s*vibrat|low\s*vibrat|vibrating\s+(higher|low)/i,
      fragment: 'I want to shift my nervous system, mood, attention, and body state toward more clarity, steadiness, and openness.',
      state: null,
    },
    {
      match: /bad\s+energy|heavy\s+energy|dark\s+energy|energy\s+(in|of)\s+(this|the|that)\s+(room|place|house|space)|bad\s+vibes|vibes\s+(are|feel|seem)\s+(off|weird|bad)|weird\s+vibes/i,
      fragment: 'Something about the sensory, emotional, or social environment here feels unsafe, tense, overstimulating, or misaligned — my body is picking up real cues even if I can’t name them yet.',
      state: 'overstimulated',
    },
    {
      match: /\bdrain(s|ing|ed)?\b|energy\s+vampire|suck(s|ing)?\s+the\s+(life|energy)/i,
      fragment: 'Being around this person or situation costs me effort — masking, bracing, managing their feelings, or staying on guard — and I leave with less capacity than I arrived with.',
      state: 'heavy',
    },
    {
      match: /chakra|blocked\s+energy|energy\s+(is\s+)?blocked|energet(ic|ically)\s+(stuck|blocked)/i,
      fragment: 'Somewhere in my body there’s tension, numbness, or a feeling that isn’t moving — held breath, a tight chest, a stuck emotion that wants expression or release.',
      state: 'blocked',
    },
    {
      match: /cleanse|clear\s+(my|the|this)?\s*(aura|energy|space)|smudg|purif|energy\s+reset/i,
      fragment: 'I want a real reset: to mark an ending, clear sensory clutter, and give my nervous system a clean transition — fresh air, changed light, a washed face, a reset room.',
      state: null,
    },
    {
      match: /aura/i,
      fragment: 'The overall impression my state gives off — my posture, energy level, expression, and mood — feels like it needs tending.',
      state: null,
    },
    {
      match: /ungrounded|not\s+grounded|need\s+to\s+ground|grounding/i,
      fragment: 'I feel scattered, floaty, or disconnected from my body, and I need steadying sensory contact — feet on floor, weight, pressure, slow breath, something solid.',
      state: 'scattered',
    },
    {
      match: /manifest|the\s+universe\s+(will|to)?\s*provide|attract(ing)?\s+(abundance|good)/i,
      fragment: 'I have a real want, and I’m trying to keep my attention, hope, and behavior pointed at it. Attention genuinely shapes what I notice and act on — the honest version of manifesting is clarity plus repeated small action.',
      state: null,
    },
    {
      match: /cursed|hexed|bad\s+luck\s+(streak|lately)|universe\s+is\s+(against|punishing)/i,
      fragment: 'I’ve taken several hits in a row, and my pattern-seeking brain is stitching them into a story of doom. Streaks of misfortune are real; curses are not — and I’m allowed to be tired without it meaning something about my worth.',
      state: 'heavy',
    },
    {
      match: /toxic\s+(energy|person|environment|vibes)|negative\s+energy|negativity\s+(around|everywhere)/i,
      fragment: 'Repeated interactions here leave me tense, small, or braced. That’s my threat-detection system reporting a pattern worth taking seriously — with boundaries, distance, or support.',
      state: 'tender',
    },
    {
      match: /out\s+of\s+alignment|not\s+aligned|in\s+alignment|align\s+(my|with)/i,
      fragment: 'My actions, values, and current life shape don’t match, and the mismatch shows up as friction, dread, or exhaustion. Alignment, honestly translated, is congruence.',
      state: null,
    },
    {
      match: /soul\s+(is\s+)?tired|spirit\s+(is\s+)?(broken|tired|heavy)|heavy\s+(heart|soul|spirit)/i,
      fragment: 'This is deep fatigue — emotional, not just physical. Something is grieving, overextended, or long unmet, and it needs rest, expression, and gentleness rather than a productivity fix.',
      state: 'grief-static',
    },
    {
      match: /old\s+soul|kindred\s+spirit|soul\s*mate/i,
      fragment: 'I feel an unusual depth of recognition or resonance with this person — shared sensibilities, pacing, and values that make connection feel effortless.',
      state: null,
    },
    {
      match: /mercury\s+(is\s+)?(in\s+)?retrograde|the\s+stars|written\s+in\s+the\s+stars/i,
      fragment: 'A lot feels chaotic and out of my control right now, and it helps to have a name for the chaos. The planets aren’t doing this — but the overwhelm is real and deserves care either way.',
      state: 'weird',
    },
    {
      match: /protect\s+(my|your)\s+energy|energetic\s+boundar|shield(ing)?\s+myself/i,
      fragment: 'I need boundaries: less exposure to what depletes me, permission to say no, and recovery time after demanding people and places.',
      state: null,
    },
    {
      match: /frequenc|tuned?\s+(in|out)|on\s+(a\s+)?(different|the\s+same)\s+wavelength/i,
      fragment: 'It’s about match and mismatch — between my state and the situation, or between me and another person’s pace, mood, and attention. Mismatch is friction; match feels like flow.',
      state: null,
    },
  ],

  fallback:
    'Here’s the honest translation attempt: something in your state, your body, or your environment feels off in a way that mystical language captures better than plain words. Try describing it one layer down — what does your body feel? What is the room doing? What would need to change for your system to feel 5% safer?',

  outro:
    'Mystical language isn’t wrong. It’s just wearing incense. Underneath, it’s usually saying something very real.',

  translate(input) {
    const seen = new Set();
    const fragments = [];
    let state = null;
    for (const p of this.patterns) {
      if (p.match.test(input) && !seen.has(p.fragment)) {
        seen.add(p.fragment);
        fragments.push(p.fragment);
        if (!state && p.state) state = p.state;
      }
    }
    return {
      text: fragments.length ? fragments.join(' And underneath that: ') : this.fallback,
      matched: fragments.length > 0,
      state,
    };
  },
};
