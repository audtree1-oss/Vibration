// Resonance — app shell: hash router, screens, practice player, starfield.

(() => {
  const screenEl = document.getElementById('screen');
  const soundToggle = document.getElementById('sound-toggle');

  // ---------- Sound toggle ----------
  const savedMute = localStorage.getItem('resonance.muted') === 'true';
  AudioEngine.setMuted(savedMute);
  updateSoundToggle();

  soundToggle.addEventListener('click', () => {
    AudioEngine.unlock();
    AudioEngine.setMuted(!AudioEngine.muted);
    localStorage.setItem('resonance.muted', String(AudioEngine.muted));
    updateSoundToggle();
  });

  function updateSoundToggle() {
    soundToggle.setAttribute('aria-pressed', String(!AudioEngine.muted));
    document.body.classList.toggle('is-muted', AudioEngine.muted);
  }

  // ---------- Router ----------
  let player = null; // active practice player, so we can cancel it

  function route() {
    if (player) { player.cancel(); player = null; }
    AudioEngine.stopAll();
    window.scrollTo(0, 0);

    const hash = location.hash.replace(/^#\/?/, '');
    const parts = hash.split('/').filter(Boolean);

    if (parts[0] === 'about') return renderAbout();
    if (parts[0] === 'library' && parts[1]) {
      const entry = LIBRARY.find((e) => e.id === parts[1]);
      if (entry) return renderLibraryEntry(entry);
    }
    if (parts[0] === 'library') return renderLibrary();
    if (parts[0] === 'translate') return renderTranslator();
    if (parts[0] === 'check') return renderCheck(parts[1] === 'retune');
    if (parts[0] === 'field-guide') return renderFieldGuide();
    if (parts[0] === 'tuning') return renderTuningRoom();
    if (parts[0] === 'state' && parts[1]) {
      const state = STATES.find((s) => s.id === parts[1]);
      if (state) return renderStateScreen(state);
    }
    if (parts[0] === 'practice' && parts[1] && parts[2]) {
      const state = STATES.find((s) => s.id === parts[1]);
      const practice = state && state.practices.find((p) => p.id === parts[2]);
      if (state && practice) return renderPracticeIntro(state, practice);
    }
    renderThreshold();
  }

  window.addEventListener('hashchange', route);

  // ---------- Screens ----------

  function renderThreshold() {
    const todays = Store.todaysCheck();
    const todaysSignal = todays && SIGNALS.find((s) => s.id === todays.signalId);
    const checkBanner = todaysSignal
      ? `<a class="check-banner" href="#/check" style="--hue:${todaysSignal.hue}">
           <span class="check-banner-glyph" aria-hidden="true">${todaysSignal.glyph}</span>
           <span>today’s signal: <em>${todaysSignal.name}</em></span>
           <span class="check-banner-arrow">→</span>
         </a>`
      : `<a class="check-banner" href="#/check">
           <span class="check-banner-glyph" aria-hidden="true">◌</span>
           <span>What kind of signal are you carrying today?</span>
           <span class="check-banner-arrow">→</span>
         </a>`;

    screenEl.innerHTML = `
      <section class="threshold">
        <div class="threshold-head">
          <h1 class="threshold-title">Resonance</h1>
          <p class="threshold-philosophy">You are not broken. You are responsive.<br>And because you are responsive, you can be gently retuned.</p>
        </div>
        ${checkBanner}
        <div class="doors">
          <a class="door" href="#/tuning" style="--hue:262">
            <span class="door-glyph" aria-hidden="true">✳</span>
            <span class="door-name">The Tuning Room</span>
            <span class="door-sub">what state are you in? pick it, tune it</span>
          </a>
          <a class="door" href="#/check" style="--hue:200">
            <span class="door-glyph" aria-hidden="true">◌</span>
            <span class="door-name">Daily Resonance Check</span>
            <span class="door-sub">what signal are you carrying today?</span>
          </a>
          <a class="door" href="#/library" style="--hue:160">
            <span class="door-glyph" aria-hidden="true">◎</span>
            <span class="door-name">The Frequency Library</span>
            <span class="door-sub">real phenomena, poetic &amp; scientific</span>
          </a>
          <a class="door" href="#/translate" style="--hue:322">
            <span class="door-glyph" aria-hidden="true">⇄</span>
            <span class="door-name">The Vibe Translator</span>
            <span class="door-sub">mystical in, grounded out</span>
          </a>
          <a class="door" href="#/field-guide" style="--hue:45">
            <span class="door-glyph" aria-hidden="true">✎</span>
            <span class="door-name">The Field Guide</span>
            <span class="door-sub">write the sentence under the sentence</span>
          </a>
        </div>
        <a class="threshold-about" href="#/about">what we mean · what we don’t</a>
      </section>`;
  }

  function renderTuningRoom() {
    const cards = STATES.map(
      (s) => `
      <a class="state-card" href="#/state/${s.id}" style="--hue:${s.hue}">
        <span class="state-glyph" aria-hidden="true">${s.glyph}</span>
        <span class="state-name">${s.name}</span>
        <span class="state-tagline">${s.tagline}</span>
      </a>`
    ).join('');

    screenEl.innerHTML = `
      <section class="home">
        <a class="back-link" href="#/">← the threshold</a>
        <h1 class="home-title">What state are you in?</h1>
        <p class="home-sub">No wrong answers. States aren’t grades — they’re weather.</p>
        <div class="state-grid">${cards}</div>
        <p class="home-philosophy">Everything responds to input.<br>So choose the input with care.</p>
      </section>`;
  }

  // ---------- Frequency Library ----------

  function renderLibrary() {
    const cards = LIBRARY.map(
      (e) => `
      <a class="library-card" href="#/library/${e.id}" style="--hue:${e.hue}">
        <span class="library-glyph" aria-hidden="true">${e.glyph}</span>
        <span class="library-card-text">
          <span class="library-card-title">${e.title}</span>
          <span class="library-card-hook">${e.hook}</span>
        </span>
      </a>`
    ).join('');

    screenEl.innerHTML = `
      <section class="library">
        <a class="back-link" href="#/">← the threshold</a>
        <h1 class="library-title">The Frequency Library</h1>
        <p class="library-sub">Real phenomena only. Each one told twice — once for the soul, once for the receipts.</p>
        <div class="library-list">${cards}</div>
      </section>`;
  }

  function renderLibraryEntry(entry) {
    const related = entry.related
      ? `<a class="related-link" href="#/practice/${entry.related.stateId}/${entry.related.practiceId}">${entry.related.label} →</a>`
      : '';

    screenEl.innerHTML = `
      <section class="entry" style="--hue:${entry.hue}">
        <a class="back-link" href="#/library">← the library</a>
        <div class="entry-header">
          <span class="library-glyph big" aria-hidden="true">${entry.glyph}</span>
          <h1 class="entry-title">${entry.title}</h1>
        </div>
        <div class="entry-layer">
          <span class="layer-label poetic-label">poetic truth</span>
          <p class="entry-poetic">${entry.poetic}</p>
        </div>
        <div class="entry-layer boxed">
          <span class="layer-label science-layer-label">scientific truth</span>
          <p class="entry-science">${entry.science}</p>
        </div>
        <div class="entry-layer boxed try">
          <span class="layer-label try-label">try it now</span>
          <p class="entry-try">${entry.tryIt}</p>
          ${related}
        </div>
      </section>`;
  }

  // ---------- Vibe Translator ----------

  function renderTranslator() {
    const chips = TRANSLATOR.examples.map(
      (t) => `<button class="example-chip" data-phrase="${t.replace(/"/g, '&quot;')}">${t}</button>`
    ).join('');

    screenEl.innerHTML = `
      <section class="translator">
        <a class="back-link" href="#/">← the threshold</a>
        <h1 class="translator-title">The Vibe Translator</h1>
        <p class="translator-sub">Say it however it comes out. We’ll find what it’s saying underneath.</p>
        <div class="translator-input-wrap">
          <textarea id="vibe-input" class="vibe-input" rows="2" placeholder="e.g. I need to raise my vibration…" aria-label="Phrase to translate"></textarea>
          <button id="translate-btn" class="translate-btn">translate</button>
        </div>
        <div class="example-chips">${chips}</div>
        <div id="translation" class="translation" hidden>
          <span class="layer-label translation-label">the translation</span>
          <p id="translation-text" class="translation-text"></p>
          <div id="translation-state"></div>
          <p class="translation-outro">${TRANSLATOR.outro}</p>
        </div>
      </section>`;

    const input = document.getElementById('vibe-input');
    const resultBox = document.getElementById('translation');
    const resultText = document.getElementById('translation-text');
    const resultState = document.getElementById('translation-state');

    function runTranslation() {
      const phrase = input.value.trim();
      if (!phrase) return;
      const result = TRANSLATOR.translate(phrase);
      resultText.textContent = result.text;
      const state = result.state && STATES.find((s) => s.id === result.state);
      resultState.innerHTML = state
        ? `<a class="state-pointer" href="#/state/${state.id}" style="--hue:${state.hue}">
             sounds a little like <em>${state.name}</em> — want to tune it? →</a>`
        : '';
      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    document.getElementById('translate-btn').addEventListener('click', runTranslation);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); runTranslation(); }
    });
    screenEl.querySelectorAll('.example-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        input.value = chip.dataset.phrase;
        runTranslation();
      });
    });
  }

  function renderStateScreen(state) {
    // Single practice: go straight to its intro.
    if (state.practices.length === 1) {
      location.replace(`#/practice/${state.id}/${state.practices[0].id}`);
      return;
    }
    const items = state.practices.map(
      (p) => `
      <a class="practice-card" href="#/practice/${state.id}/${p.id}" style="--hue:${state.hue}">
        <span class="practice-card-title">${p.title}</span>
        <span class="practice-card-meta">~${p.minutes} min${p.sound ? ' · with sound' : ''}</span>
      </a>`
    ).join('');

    screenEl.innerHTML = `
      <section class="state-screen" style="--hue:${state.hue}">
        <a class="back-link" href="#/tuning">← the tuning room</a>
        <div class="state-header">
          <span class="state-glyph big" aria-hidden="true">${state.glyph}</span>
          <h1 class="state-title">${state.name}</h1>
          <p class="state-sub">${state.tagline}</p>
        </div>
        <div class="practice-list">${items}</div>
      </section>`;
  }

  function renderPracticeIntro(state, practice) {
    screenEl.innerHTML = `
      <section class="intro" style="--hue:${state.hue}">
        <a class="back-link" href="#/tuning">← the tuning room</a>
        <div class="intro-body">
          <p class="intro-state">${state.glyph} &nbsp;${state.name}</p>
          <h1 class="intro-title">${practice.title}</h1>
          <p class="intro-opening">${practice.opening}</p>
          <p class="intro-meta">~${practice.minutes} minutes${practice.sound ? ' · gentle sound' : ''}</p>
          <button class="begin-btn" id="begin">Begin</button>
        </div>
      </section>`;

    document.getElementById('begin').addEventListener('click', () => {
      AudioEngine.unlock(); // user gesture unlocks audio
      player = new Player(state, practice);
      player.start();
    });
  }

  function renderAbout() {
    const pairs = ABOUT.pairs.map(
      (p) => `
      <div class="pair">
        <p class="pair-mean"><span class="pair-label">We mean</span>${p.mean}</p>
        <p class="pair-dont"><span class="pair-label">We don’t mean</span>${p.dont}</p>
      </div>`
    ).join('');

    screenEl.innerHTML = `
      <section class="about">
        <a class="back-link" href="#/">← the threshold</a>
        <h1 class="about-title">${ABOUT.title}</h1>
        <p class="about-intro">${ABOUT.intro}</p>
        <div class="pairs">${pairs}</div>
        <div class="about-philosophy">
          ${ABOUT.philosophy.map((l) => `<p>${l}</p>`).join('')}
        </div>
        <p class="about-thesis">${ABOUT.thesis}</p>
      </section>`;
  }

  // ---------- Daily Resonance Check ----------

  function weatherStrip() {
    const checks = Store.loadChecks();
    const byDate = Object.fromEntries(checks.map((c) => [c.date, c.signalId]));
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const pad = (n) => String(n).padStart(2, '0');
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const signal = byDate[key] && SIGNALS.find((s) => s.id === byDate[key]);
      days.push(
        signal
          ? `<span class="weather-day" style="--hue:${signal.hue}" title="${key}: ${signal.name}">${signal.glyph}</span>`
          : `<span class="weather-day empty" title="${key}">·</span>`
      );
    }
    return `
      <div class="weather">
        <span class="weather-label">your recent weather</span>
        <div class="weather-strip">${days.join('')}</div>
      </div>`;
  }

  function renderCheck(retune) {
    const todays = Store.todaysCheck();
    if (todays && !retune) {
      const signal = SIGNALS.find((s) => s.id === todays.signalId);
      if (signal) return renderCheckReading(signal, true);
    }

    const cards = SIGNALS.map(
      (s) => `
      <button class="signal-card" data-signal="${s.id}" style="--hue:${s.hue}">
        <span class="signal-glyph" aria-hidden="true">${s.glyph}</span>
        <span class="signal-name">${s.name}</span>
        <span class="signal-sense">${s.sense}</span>
      </button>`
    ).join('');

    screenEl.innerHTML = `
      <section class="check">
        <a class="back-link" href="#/">← the threshold</a>
        <h1 class="check-title">What kind of signal are you carrying today?</h1>
        <p class="check-sub">Weather, not grades. Missed days are just quiet sky.</p>
        <div class="signal-grid">${cards}</div>
        ${weatherStrip()}
      </section>`;

    screenEl.querySelectorAll('.signal-card').forEach((card) => {
      card.addEventListener('click', () => {
        const signal = SIGNALS.find((s) => s.id === card.dataset.signal);
        Store.saveCheck(signal.id);
        renderCheckReading(signal, false);
      });
    });
  }

  function renderCheckReading(signal, alreadyChecked) {
    const state = STATES.find((s) => s.id === signal.stateId);
    screenEl.innerHTML = `
      <section class="check-reading" style="--hue:${signal.hue}">
        <a class="back-link" href="#/">← the threshold</a>
        <div class="reading-card">
          <span class="signal-glyph big" aria-hidden="true">${signal.glyph}</span>
          <h1 class="reading-name">${signal.name}</h1>
          <p class="reading-text">${signal.reading}</p>
          ${state ? `<a class="state-pointer" href="#/practice/${signal.stateId}/${signal.practiceId}">tune it with <em>${state.name}</em> →</a>` : ''}
        </div>
        ${weatherStrip()}
        <a class="retune-link" href="#/check/retune">${alreadyChecked ? 'actually, the signal changed — re-check' : 'pick a different signal'}</a>
      </section>`;
  }

  // ---------- The Field Guide ----------

  function renderFieldGuide() {
    let prompt = FIELD_GUIDE.randomPrompt();

    function entriesHTML() {
      const entries = Store.loadEntries().slice().reverse();
      if (!entries.length) {
        return '<p class="no-entries">No readings yet. The first page of a field guide is always blank.</p>';
      }
      return entries.map((e) => {
        const d = new Date(e.date);
        const when = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        return `
          <details class="journal-entry">
            <summary>
              <span class="entry-date">${when}</span>
              <span class="entry-prompt">${e.prompt}</span>
            </summary>
            <p class="entry-text"></p>
            <button class="entry-delete" data-id="${e.id}">delete</button>
          </details>`;
      }).join('');
    }

    screenEl.innerHTML = `
      <section class="fieldguide">
        <a class="back-link" href="#/">← the threshold</a>
        <h1 class="fieldguide-title">The Field Guide</h1>
        <p class="fieldguide-sub">Notes from the field — the field being you.</p>
        <div class="prompt-card">
          <span class="layer-label prompt-label">today’s prompt</span>
          <p class="prompt-text" id="prompt-text">${prompt}</p>
          <button class="shuffle-btn" id="shuffle">another prompt ↻</button>
        </div>
        <textarea id="journal-input" class="vibe-input journal-input" rows="5" placeholder="Write what’s true. No one is grading the weather." aria-label="Journal entry"></textarea>
        <div class="journal-actions">
          <span class="privacy-note">Entries live only on this device.</span>
          <button class="translate-btn" id="save-entry">save</button>
        </div>
        <h2 class="entries-title">past readings</h2>
        <div id="entries">${entriesHTML()}</div>
      </section>`;

    const input = document.getElementById('journal-input');
    const entriesBox = document.getElementById('entries');

    // Entry text is user-written — always set it as text, never as HTML.
    function fillEntryTexts() {
      const entries = Store.loadEntries().slice().reverse();
      entriesBox.querySelectorAll('.journal-entry').forEach((el, i) => {
        el.querySelector('.entry-text').textContent = entries[i] ? entries[i].text : '';
      });
    }

    function bindDeletes() {
      entriesBox.querySelectorAll('.entry-delete').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (btn.dataset.armed) {
            Store.deleteEntry(btn.dataset.id);
            entriesBox.innerHTML = entriesHTML();
            fillEntryTexts();
            bindDeletes();
          } else {
            btn.dataset.armed = '1';
            btn.textContent = 'tap again to really delete';
          }
        });
      });
    }
    fillEntryTexts();
    bindDeletes();

    document.getElementById('shuffle').addEventListener('click', () => {
      prompt = FIELD_GUIDE.randomPrompt(prompt);
      document.getElementById('prompt-text').textContent = prompt;
    });

    document.getElementById('save-entry').addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      Store.saveEntry(prompt, text);
      input.value = '';
      entriesBox.innerHTML = entriesHTML();
      fillEntryTexts();
      bindDeletes();
      AudioEngine.unlock();
      AudioEngine.chime();
    });
  }

  // ---------- Practice player ----------

  class Player {
    constructor(state, practice) {
      this.state = state;
      this.practice = practice;
      this.index = 0;
      this.cancelled = false;
      this.timers = [];
    }

    start() {
      if (this.practice.sound) AudioEngine.startAmbient(this.practice.sound);
      this.renderShell();
      this.runStep();
    }

    cancel() {
      this.cancelled = true;
      this.timers.forEach(clearTimeout);
      this.timers = [];
      AudioEngine.stopAll();
    }

    wait(ms) {
      return new Promise((resolve) => {
        const t = setTimeout(resolve, ms);
        this.timers.push(t);
      });
    }

    renderShell() {
      const dots = this.practice.steps
        .map((_, i) => `<span class="dot${i === 0 ? ' active' : ''}" data-dot="${i}"></span>`)
        .join('');
      screenEl.innerHTML = `
        <section class="player" style="--hue:${this.state.hue}">
          <div class="player-top">
            <span class="player-title">${this.practice.title}</span>
            <a class="player-exit" href="#/tuning" aria-label="Leave practice">✕</a>
          </div>
          <div class="player-stage" id="stage"></div>
          <div class="player-bottom">
            <div class="dots">${dots}</div>
            <button class="next-btn" id="next">continue →</button>
          </div>
        </section>`;
      this.stage = document.getElementById('stage');
      this.nextBtn = document.getElementById('next');
      this.nextBtn.addEventListener('click', () => this.advance());
    }

    setDot(i) {
      screenEl.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('active', j <= i));
    }

    advance() {
      if (this.cancelled) return;
      this.timers.forEach(clearTimeout);
      this.timers = [];
      AudioEngine.stopBreath();
      this.index += 1;
      if (this.index >= this.practice.steps.length) {
        this.renderClosing();
      } else {
        AudioEngine.chime();
        this.setDot(this.index);
        this.runStep();
      }
    }

    async runStep() {
      const step = this.practice.steps[this.index];
      if (!step || this.cancelled) return;
      if (step.type === 'breath') {
        await this.runBreathStep(step);
      } else {
        await this.runTextStep(step);
      }
    }

    async runTextStep(step) {
      this.stage.innerHTML = `
        <p class="step-text">${step.text}</p>
        <div class="step-progress"><div class="step-progress-fill" style="animation-duration:${step.seconds}s"></div></div>`;
      await this.wait(step.seconds * 1000);
      if (!this.cancelled) this.advance();
    }

    async runBreathStep(step) {
      const hold = step.hold || 0;
      this.stage.innerHTML = `
        <p class="step-text breath-text">${step.text}</p>
        <div class="orb-wrap">
          <div class="orb" id="orb"></div>
          <p class="orb-label" id="orb-label"></p>
        </div>
        <p class="cycle-count" id="cycle-count"></p>`;
      const orb = document.getElementById('orb');
      const label = document.getElementById('orb-label');
      const count = document.getElementById('cycle-count');

      for (let c = 0; c < step.cycles; c++) {
        if (this.cancelled) return;
        count.textContent = `${step.cycles - c} breath${step.cycles - c === 1 ? '' : 's'} left`;

        label.textContent = 'inhale';
        orb.style.transitionDuration = `${step.inhale}s`;
        orb.classList.add('grow');
        AudioEngine.breathPhase('in', step.inhale);
        await this.wait(step.inhale * 1000);
        if (this.cancelled) return;

        if (hold > 0) {
          label.textContent = 'hold, softly';
          AudioEngine.breathPhase('hold', hold);
          await this.wait(hold * 1000);
          if (this.cancelled) return;
        }

        label.textContent = step.hum ? 'exhale — and hum' : 'exhale, long and slow';
        orb.style.transitionDuration = `${step.exhale}s`;
        orb.classList.remove('grow');
        AudioEngine.breathPhase('out', step.exhale);
        await this.wait(step.exhale * 1000);
      }
      AudioEngine.stopBreath();
      if (!this.cancelled) this.advance();
    }

    renderClosing() {
      AudioEngine.chime();
      const p = this.practice;
      screenEl.innerHTML = `
        <section class="closing" style="--hue:${this.state.hue}">
          <p class="closing-line">${p.closing}</p>
          <div class="science-note">
            <span class="science-label">the science</span>
            <p>${p.science}</p>
          </div>
          <p class="signal-check">How’s the signal now?</p>
          <div class="signal-answers">
            <button class="signal-btn" data-answer="softer">softer</button>
            <button class="signal-btn" data-answer="same">about the same</button>
            <button class="signal-btn" data-answer="louder">louder</button>
          </div>
          <p class="signal-response" id="signal-response"></p>
          <a class="return-btn" href="#/tuning">return to the room</a>
        </section>`;

      const responses = {
        softer: 'Good. Small shifts count. They’re how systems learn.',
        same: 'That’s honest, and honest is tuning too. Some states need more than one input — or just time.',
        louder: 'Okay — that’s real information, not failure. Try a different channel (movement? quiet? warmth?), or let this one be a day that just needs riding out.',
      };
      screenEl.querySelectorAll('.signal-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          screenEl.querySelectorAll('.signal-btn').forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
          document.getElementById('signal-response').textContent = responses[btn.dataset.answer];
        });
      });

      // Ambient fades out gently after the closing chime.
      setTimeout(() => AudioEngine.stopAmbient(), 4000);
      player = null;
    }
  }

  // ---------- Starfield ----------
  (function starfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars = [];
    let w, h;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.min(140, Math.floor((w * h) / 9000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.3,
        base: Math.random() * 0.5 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.1,
        drift: Math.random() * 0.02 + 0.004,
      }));
      if (reduceMotion) draw(0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(s.phase + t * 0.001 * s.speed);
        ctx.globalAlpha = s.base * twinkle;
        ctx.fillStyle = '#cdd6ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (!reduceMotion) {
          s.y -= s.drift;
          if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
        }
      }
      ctx.globalAlpha = 1;
    }

    function loop(t) {
      draw(t);
      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize);
    resize();
    if (!reduceMotion) requestAnimationFrame(loop);
  })();

  // Boot
  route();
})();
