// Resonance audio engine — everything synthesized live with the Web Audio API.
// No samples, no fake healing frequencies. Just honest sound as input:
// brown noise, a low warm drone, a breath-pacing swell, and a soft chime.
// Audio only starts after a user gesture (browser autoplay rules), and
// everything fades — nothing ever cuts abruptly.

const AudioEngine = (() => {
  let ctx = null;
  let master = null;
  let muted = false;
  let ambient = null; // { nodes: [], gain, kind }
  let breathOsc = null;

  const FADE = 1.2;

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 1;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return true;
  }

  function now() {
    return ctx.currentTime;
  }

  // Fade a gain node to a value, then optionally call cb.
  function fadeTo(gain, value, seconds) {
    const t = now();
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.linearRampToValueAtTime(value, t + seconds);
  }

  // --- Brown noise: looping generated buffer through a gentle lowpass ---
  function makeBrownNoise() {
    const seconds = 4;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    src.connect(filter).connect(gain).connect(master);
    src.start();
    return { nodes: [src], gain, level: 0.22 };
  }

  // --- Drone: detuned low sines with a slow, breathing amplitude drift ---
  function makeDrone() {
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(master);

    const freqs = [
      [55, 0.5],
      [110, 0.28],
      [110.7, 0.22], // slight detune -> slow natural beating
      [165, 0.08],
    ];
    const nodes = [];
    for (const [f, level] of freqs) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g).connect(gain);
      osc.start();
      nodes.push(osc);
    }

    // Slow amplitude drift so the drone feels alive, not mechanical.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain).connect(gain.gain);
    lfo.start();
    nodes.push(lfo);

    return { nodes, gain, level: 0.16 };
  }

  // --- Chime: a soft bell from decaying sine partials ---
  function chime() {
    if (!ensureContext() || muted) return;
    const t = now();
    const partials = [
      [523.25, 0.10, 2.8],
      [784.0, 0.05, 2.2],
      [1046.5, 0.03, 1.6],
    ];
    for (const [freq, level, decay] of partials) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(level, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + decay + 0.1);
    }
  }

  // --- Breath swell: a soft tone that rises on inhale, falls on exhale ---
  function breathPhase(phase, seconds) {
    if (!ensureContext() || muted) return;
    if (!breathOsc) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 220;
      const g = ctx.createGain();
      g.gain.value = 0;
      osc.connect(g).connect(master);
      osc.start();
      breathOsc = { osc, gain: g };
    }
    const { osc, gain } = breathOsc;
    const t = now();
    osc.frequency.cancelScheduledValues(t);
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    osc.frequency.setValueAtTime(osc.frequency.value, t);
    if (phase === 'in') {
      gain.gain.linearRampToValueAtTime(0.05, t + seconds);
      osc.frequency.linearRampToValueAtTime(261.6, t + seconds);
    } else if (phase === 'hold') {
      gain.gain.linearRampToValueAtTime(0.045, t + seconds);
    } else {
      gain.gain.linearRampToValueAtTime(0.0, t + seconds);
      osc.frequency.linearRampToValueAtTime(196, t + seconds);
    }
  }

  function stopBreath() {
    if (breathOsc && ctx) {
      fadeTo(breathOsc.gain, 0, 0.6);
      const osc = breathOsc.osc;
      setTimeout(() => { try { osc.stop(); } catch (e) {} }, 800);
      breathOsc = null;
    }
  }

  // --- Ambient control ---
  function startAmbient(kind) {
    if (!kind) return;
    if (!ensureContext()) return;
    if (ambient && ambient.kind === kind) return;
    stopAmbient();
    const a = kind === 'drone' ? makeDrone() : makeBrownNoise();
    a.kind = kind;
    ambient = a;
    fadeTo(a.gain, muted ? 0 : a.level, FADE * 2);
  }

  function stopAmbient() {
    if (!ambient) return;
    const a = ambient;
    ambient = null;
    fadeTo(a.gain, 0, FADE);
    setTimeout(() => {
      for (const n of a.nodes) { try { n.stop(); } catch (e) {} }
    }, FADE * 1000 + 200);
  }

  function stopAll() {
    stopAmbient();
    stopBreath();
  }

  function setMuted(m) {
    muted = m;
    if (ctx && master) fadeTo(master, muted ? 0 : 1, 0.4);
    if (muted) stopBreath();
  }

  return {
    unlock: ensureContext, // call from any user gesture
    startAmbient,
    stopAmbient,
    stopAll,
    chime,
    breathPhase,
    stopBreath,
    setMuted,
    get muted() { return muted; },
  };
})();
