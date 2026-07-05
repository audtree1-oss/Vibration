// The Tuning Room — states and practices.
// Every practice has two layers: the poetic layer (opening/steps/closing)
// and the science layer (science note). Mechanisms are real; language is honest.
//
// Step types:
//   { type: 'text',   text, seconds }                          — timed instruction
//   { type: 'breath', text, inhale, hold, exhale, cycles, hum } — breathing orb
//
// sound: 'brown' (soft brown noise) | 'drone' (low warm drone) | null

const STATES = [
  {
    id: 'scattered',
    name: 'Scattered',
    glyph: '✳',
    hue: 195,
    tagline: 'pieces of you in every room',
    practices: [
      {
        id: 'gather-the-signal',
        title: 'Gather the Signal',
        minutes: 3,
        sound: 'brown',
        opening: 'You are not everywhere. You only feel that way. Let’s call the pieces home.',
        steps: [
          { type: 'text', text: 'Put both feet flat on the floor. Feel the exact shape of the ground under them.', seconds: 20 },
          { type: 'text', text: 'Let your eyes rest on one unmoving thing. Not the phone. Something that has been still all day.', seconds: 20 },
          { type: 'breath', text: 'Breathe with the orb. In through the nose, out slow like fogging a window.', inhale: 4, hold: 0, exhale: 7, cycles: 5 },
          { type: 'text', text: 'Ask quietly: what is the one thing that actually needs me next? Just one. The rest can wait in the hallway.', seconds: 25 },
          { type: 'text', text: 'Say it once, out loud or in your head. That is the signal. Everything else is weather.', seconds: 15 },
        ],
        science: 'Attention is a limited resource, and slow exhale-weighted breathing reduces physiological arousal — together they make it easier for the brain’s executive systems to pick one thing instead of juggling fragments.',
        closing: 'One signal, carried gently, goes further than ten carried at once.',
      },
      {
        id: 'one-channel',
        title: 'One Channel',
        minutes: 2,
        sound: null,
        opening: 'Too many stations playing at once. We’re going to tune to a single channel.',
        steps: [
          { type: 'text', text: 'Pick one sense. Just hearing. Close your eyes if that feels okay.', seconds: 15 },
          { type: 'text', text: 'Find the farthest sound you can hear. Stay with it.', seconds: 25 },
          { type: 'text', text: 'Now the closest sound. Maybe your own breath.', seconds: 25 },
          { type: 'text', text: 'Let the two sounds exist at once — far and near — and rest in the space between them.', seconds: 30 },
        ],
        science: 'Deliberately narrowing attention to a single sensory channel gives an overloaded working memory less to track, which many people experience as the mental noise settling.',
        closing: 'You didn’t force the static to stop. You just stopped feeding it.',
      },
    ],
  },
  {
    id: 'heavy',
    name: 'Heavy',
    glyph: '◍',
    hue: 252,
    tagline: 'gravity turned up on the inside',
    practices: [
      {
        id: 'let-the-ground-hold-it',
        title: 'Let the Ground Hold It',
        minutes: 4,
        sound: 'drone',
        opening: 'You have been carrying this with your muscles. The ground is stronger than you. Let it take a shift.',
        steps: [
          { type: 'text', text: 'Sit or lie down. Notice every place your body touches something — chair, floor, bed.', seconds: 25 },
          { type: 'text', text: 'Stop holding yourself up at those places. Let the surface press back. It will not drop you.', seconds: 30 },
          { type: 'breath', text: 'Long, slow exhales. Imagine the weight draining downward, out through the points of contact.', inhale: 4, hold: 0, exhale: 8, cycles: 6 },
          { type: 'text', text: 'Unclench one hidden place: jaw, shoulders, belly, hands. Just one is enough.', seconds: 25 },
          { type: 'text', text: 'You don’t have to lift anything right now. Being held is also a state.', seconds: 20 },
        ],
        science: 'Extended exhales engage the parasympathetic nervous system and slow the heart, while consciously releasing muscle tension interrupts the body’s bracing pattern — heaviness often eases when the body stops working against itself.',
        closing: 'Heavy is not broken. Heavy is a body asking to be held.',
      },
    ],
  },
  {
    id: 'overstimulated',
    name: 'Overstimulated',
    glyph: '⌁',
    hue: 322,
    tagline: 'too much charge in the wire',
    practices: [
      {
        id: 'lower-the-signal',
        title: 'Lower the Signal',
        minutes: 3,
        sound: null,
        opening: 'Your system is holding too much charge. Let’s soften the static.',
        steps: [
          { type: 'text', text: 'Dim what you can — the screen, the lights, your shoulders.', seconds: 15 },
          { type: 'text', text: 'Put both feet on the floor. Let them be boring and solid.', seconds: 15 },
          { type: 'breath', text: 'Six slow breaths. On each exhale, hum — low and lazy, like a fridge in another room.', inhale: 4, hold: 0, exhale: 8, cycles: 6, hum: true },
          { type: 'text', text: 'Name three unmoving things you can see. Slowly. Let each one be fully boring.', seconds: 30 },
          { type: 'text', text: 'Notice: the world got quieter, or you did. Either counts.', seconds: 15 },
        ],
        science: 'Humming and extended exhales stimulate the vagus nerve and reduce arousal, while anchoring attention on still objects gives an overloaded sensory system fewer inputs to process.',
        closing: 'You turned the volume down without leaving the room. That’s a skill.',
      },
      {
        id: 'the-dim-room',
        title: 'The Dim Room',
        minutes: 2,
        sound: 'brown',
        opening: 'Every light and ping is a hook in your attention. We’re going to unhook a few.',
        steps: [
          { type: 'text', text: 'Cup your palms gently over your closed eyes. Real darkness, warm and close.', seconds: 30 },
          { type: 'text', text: 'Let the brown noise be the only thing. One texture instead of a hundred edges.', seconds: 40 },
          { type: 'text', text: 'Lower your hands. Let the light come back in slowly, like a room at dusk in reverse.', seconds: 20 },
        ],
        science: 'Briefly reducing visual input gives the nervous system a genuine break from processing load, and steady broadband noise can mask the unpredictable sounds that keep an alert system on guard.',
        closing: 'Less input, less charge. Physics, not magic.',
      },
    ],
  },
  {
    id: 'numb',
    name: 'Numb',
    glyph: '◌',
    hue: 210,
    tagline: 'the dial turned all the way down',
    practices: [
      {
        id: 'warm-static',
        title: 'Warm Static',
        minutes: 3,
        sound: null,
        opening: 'Numb isn’t empty. It’s a dial turned down for protection. We’ll turn it up gently — sensation first, feelings later.',
        steps: [
          { type: 'text', text: 'Rub your palms together until they’re warm. Really warm. Notice the exact moment heat arrives.', seconds: 25 },
          { type: 'text', text: 'Press your warm palms against your cheeks, or the back of your neck. Just feel the heat move.', seconds: 25 },
          { type: 'text', text: 'Press each fingertip against your thumb, one at a time, like counting coins.', seconds: 25 },
          { type: 'text', text: 'Find one texture near you — fabric, wood, your own sleeve. Explore it like it’s new.', seconds: 30 },
          { type: 'text', text: 'That’s enough. You made contact. The rest can come at its own speed.', seconds: 15 },
        ],
        science: 'Numbness often involves the brain dampening interoception — its sense of the body’s signals. Simple, vivid physical sensations like warmth, pressure, and texture are a low-risk way to invite that sense back online.',
        closing: 'You don’t have to feel everything. You just proved the wire still carries signal.',
      },
    ],
  },
  {
    id: 'tender',
    name: 'Tender',
    glyph: '❀',
    hue: 350,
    tagline: 'soft-shelled today',
    practices: [
      {
        id: 'hand-on-the-hull',
        title: 'Hand on the Hull',
        minutes: 3,
        sound: 'drone',
        opening: 'Something in you is soft-shelled today. That’s not weakness — that’s a system asking for gentler handling.',
        steps: [
          { type: 'text', text: 'Place one hand flat on your chest, over your heart. Let it be heavy and warm.', seconds: 25 },
          { type: 'breath', text: 'Breathe under your own hand. Feel it rise and fall, like a small boat on calm water.', inhale: 4, hold: 0, exhale: 6, cycles: 6 },
          { type: 'text', text: 'If words help, offer yourself one quiet sentence: “Of course this is tender.”', seconds: 25 },
          { type: 'text', text: 'Stay one more moment. You’re allowed to be handled with care, including by you.', seconds: 20 },
        ],
        science: 'Warm, steady touch — even your own — activates pressure receptors and soothing pathways associated with calming, and slow breathing under the hand gives the nervous system a rhythmic signal of safety.',
        closing: 'Tender means the sensors work. Guard the soft thing; don’t shame it.',
      },
    ],
  },
  {
    id: 'angry',
    name: 'Angry',
    glyph: '△',
    hue: 14,
    tagline: 'a fire looking for a fireplace',
    practices: [
      {
        id: 'burn-clean',
        title: 'Burn Clean',
        minutes: 3,
        sound: null,
        opening: 'Anger is fuel with nowhere to go. We’re not going to put it out — we’re going to give it a fireplace.',
        steps: [
          { type: 'text', text: 'Stand up if you can. Push your palms hard against a wall, like you’re moving the building. Ten slow seconds.', seconds: 20 },
          { type: 'text', text: 'Release. Shake out your arms and hands like you’re flicking water off them.', seconds: 15 },
          { type: 'text', text: 'Again: push the wall. Let your whole body mean it.', seconds: 20 },
          { type: 'breath', text: 'Now breathe: in through the nose, out through the mouth with sound — a sigh, a growl, whatever’s honest.', inhale: 4, hold: 0, exhale: 7, cycles: 5 },
          { type: 'text', text: 'Ask once, without judgment: what boundary got crossed? Anger usually knows.', seconds: 25 },
        ],
        science: 'Anger mobilizes the body for action — raised heart rate, tensed muscles. Brief intense muscle effort followed by release gives that activation somewhere to go, and audible exhales help discharge the rest.',
        closing: 'The fire wasn’t the problem. It just needed a place to burn that wasn’t you.',
      },
    ],
  },
  {
    id: 'low-energy',
    name: 'Low-energy',
    glyph: '☽',
    hue: 45,
    tagline: 'running on the pilot light',
    practices: [
      {
        id: 'kindle',
        title: 'Kindle',
        minutes: 3,
        sound: null,
        opening: 'The pilot light is on; the burners are off. We’ll add air and light — gently, not violently.',
        steps: [
          { type: 'text', text: 'Sit tall. Roll your shoulders back once. Let your ribcage have room.', seconds: 15 },
          { type: 'breath', text: 'Brisker breaths with the orb: full inhale through the nose, easy exhale. Like fanning an ember.', inhale: 3, hold: 0, exhale: 4, cycles: 8 },
          { type: 'text', text: 'Stand up and reach both arms overhead. Stretch until something wakes up. Yawn if a yawn arrives.', seconds: 20 },
          { type: 'text', text: 'Go toward light — a window, outside if you can. Let your eyes drink some daylight.', seconds: 25 },
          { type: 'text', text: 'Pick one small thing to do in the next ten minutes. Ember-sized. Not the whole fire.', seconds: 20 },
        ],
        science: 'Upright posture, fuller breathing, big movement, and bright light — especially daylight — all nudge arousal and alertness upward through real physiological channels. Small wins then keep the momentum honest.',
        closing: 'You don’t need a bonfire today. One well-fed ember runs a whole engine.',
      },
    ],
  },
  {
    id: 'restless',
    name: 'Restless',
    glyph: '〜',
    hue: 160,
    tagline: 'engine revving in park',
    practices: [
      {
        id: 'give-it-somewhere-to-go',
        title: 'Give It Somewhere to Go',
        minutes: 3,
        sound: null,
        opening: 'The engine is revving in park. Nothing’s wrong with the engine. Let’s put it in gear for a minute.',
        steps: [
          { type: 'text', text: 'Stand and march in place, or walk the room. Let your arms swing. Slightly ridiculous is fine.', seconds: 30 },
          { type: 'text', text: 'Add rhythm: tap your thighs left-right-left-right as you move, like a slow drumbeat.', seconds: 30 },
          { type: 'text', text: 'Gradually slow the beat down. Let the rhythm get lazier and lazier.', seconds: 25 },
          { type: 'breath', text: 'Come to stillness and breathe with the orb — the last of the rev leaving through long exhales.', inhale: 4, hold: 0, exhale: 7, cycles: 4 },
        ],
        science: 'Restlessness is unspent physical activation. Rhythmic bilateral movement gives it an outlet, and gradually slowing an external rhythm is an easy way to let the body’s tempo downshift with it.',
        closing: 'You didn’t fight the rev. You drove it around the block and parked it yourself.',
      },
    ],
  },
  {
    id: 'blocked',
    name: 'Creative, but blocked',
    glyph: '✧',
    hue: 275,
    tagline: 'the well is full, the pump is stuck',
    practices: [
      {
        id: 'change-the-weather',
        title: 'Change the Weather',
        minutes: 3,
        sound: 'brown',
        opening: 'The well isn’t dry — the pump is stuck. Forcing it jams it harder. We’re going to change the weather instead.',
        steps: [
          { type: 'text', text: 'Physically turn away from the work. Different chair, different wall, different window.', seconds: 15 },
          { type: 'text', text: 'Let your eyes go soft and wander. No searching. You’re off duty.', seconds: 30 },
          { type: 'breath', text: 'Slow breaths, nowhere to be. Boredom is allowed. Boredom is fertile.', inhale: 4, hold: 0, exhale: 6, cycles: 5 },
          { type: 'text', text: 'Ask the smallest possible question about the work — not “how do I finish” but “what’s one true thing about it?”', seconds: 30 },
          { type: 'text', text: 'Whatever surfaced, or didn’t — return casually, like you’re just passing by the desk anyway.', seconds: 15 },
        ],
        science: 'Stepping back from effortful focus lets the brain’s associative, wandering mode work on the problem in the background — which is why answers famously arrive in showers and on walks, not while glaring at the page.',
        closing: 'You can’t command the weather. But you can open a window and let it change.',
      },
    ],
  },
  {
    id: 'grief-static',
    name: 'Grief-static',
    glyph: '☾',
    hue: 225,
    tagline: 'a signal from someone loved',
    practices: [
      {
        id: 'let-it-move-through',
        title: 'Let It Move Through',
        minutes: 4,
        sound: 'drone',
        opening: 'Grief comes in waves because love did. Nothing here needs fixing. We’re just going to keep you company while a wave passes.',
        steps: [
          { type: 'text', text: 'Find somewhere your body can be supported. Let yourself be held by it.', seconds: 20 },
          { type: 'text', text: 'Place a hand wherever the grief lives today — chest, throat, belly. Just rest it there.', seconds: 25 },
          { type: 'breath', text: 'Breathe slow and low. If tears come, they’re part of the breathing. Let everything move.', inhale: 4, hold: 0, exhale: 8, cycles: 6 },
          { type: 'text', text: 'If it helps, say the name, or the thing, quietly. Naming is not reopening. It’s honoring.', seconds: 30 },
          { type: 'text', text: 'The wave is already passing. You stayed. That was the whole task.', seconds: 20 },
        ],
        science: 'Grief arrives in waves of real physiological activation, and waves pass. Slow breathing, supportive touch, and putting words to what’s present help the body move through a wave rather than brace against it — and none of it means you’re doing grief wrong.',
        closing: 'Grief is not low vibration. It’s love with nowhere obvious to go — so it moves through you instead.',
      },
    ],
  },
  {
    id: 'weird',
    name: 'I don’t know, just weird',
    glyph: '❋',
    hue: 185,
    tagline: 'unlabeled signal detected',
    practices: [
      {
        id: 'take-a-reading',
        title: 'Take a Reading',
        minutes: 3,
        sound: 'brown',
        opening: 'Unlabeled signal detected. That’s fine. We don’t have to name it to meet it. Let’s just take a reading.',
        steps: [
          { type: 'text', text: 'Scan slowly from head to feet. Where is the weird loudest? Chest? Stomach? Behind the eyes?', seconds: 30 },
          { type: 'text', text: 'Describe it like a scientist of yourself: buzzy, hollow, tight, fizzy, flat, staticky?', seconds: 25 },
          { type: 'breath', text: 'Breathe near it — not to fix it, just to visit. Curiosity, not repair.', inhale: 4, hold: 0, exhale: 6, cycles: 5 },
          { type: 'text', text: 'Ask: is this weird asking for something simple? Water, food, rest, warmth, motion, quiet?', seconds: 25 },
          { type: 'text', text: 'Whatever the reading said, you listened. Systems calm down when someone reads the gauges.', seconds: 15 },
        ],
        science: 'Putting rough words to an unclear internal state — even just “buzzy” or “flat” — measurably reduces the intensity of the brain’s alarm response. Naming it doesn’t fix everything, but it turns an unknown signal into information.',
        closing: 'Weird is just data that hasn’t been translated yet. You’re the translator.',
      },
    ],
  },
];

// The Bullshit Filter — What We Mean / What We Don’t Mean
const ABOUT = {
  title: 'What We Mean / What We Don’t Mean',
  intro:
    'This app borrows mystical language because it’s beautiful and it fits how states actually feel. But every practice here rests on real mechanisms — sound, breath, movement, light, touch, attention, expression. Here’s the honest line between the two.',
  pairs: [
    {
      mean: 'Your body responds to rhythm, sound, breath, light, movement, and attention.',
      dont: 'Your thoughts are radio waves controlling strangers.',
    },
    {
      mean: 'Emotional states can shift through real nervous-system inputs.',
      dont: 'Sadness means you’re “low vibration” and spiritually defective.',
    },
    {
      mean: 'Sound is literal vibration, and humming really does resonate in your body.',
      dont: 'A specific magic frequency heals your liver.',
    },
    {
      mean: 'Grief, anger, numbness, and fear are healthy signals from a responsive system.',
      dont: 'Hard feelings “attract” bad events, or mean you failed at being sparkly enough.',
    },
    {
      mean: 'You can change your state — gently, mechanically, repeatably.',
      dont: 'You can think your way past being a body that needs sleep, food, and care.',
    },
  ],
  philosophy: [
    'You are not broken.',
    'You are responsive.',
    'And because you are responsive, you can be gently retuned.',
  ],
  thesis: 'Everything responds to input. So choose the input with care.',
};
