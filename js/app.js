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
    if (parts[0] === 'state' && parts[1]) {
      const state = STATES.find((s) => s.id === parts[1]);
      if (state) return renderStateScreen(state);
    }
    if (parts[0] === 'practice' && parts[1] && parts[2]) {
      const state = STATES.find((s) => s.id === parts[1]);
      const practice = state && state.practices.find((p) => p.id === parts[2]);
      if (state && practice) return renderPracticeIntro(state, practice);
    }
    renderHome();
  }

  window.addEventListener('hashchange', route);

  // ---------- Screens ----------

  function renderHome() {
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
        <h1 class="home-title">What state are you in?</h1>
        <p class="home-sub">No wrong answers. States aren’t grades — they’re weather.</p>
        <div class="state-grid">${cards}</div>
        <p class="home-philosophy">You are not broken. You are responsive.<br>And because you are responsive, you can be gently retuned.</p>
      </section>`;
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
        <a class="back-link" href="#/">← the tuning room</a>
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
        <a class="back-link" href="#/">← the tuning room</a>
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
        <a class="back-link" href="#/">← the tuning room</a>
        <h1 class="about-title">${ABOUT.title}</h1>
        <p class="about-intro">${ABOUT.intro}</p>
        <div class="pairs">${pairs}</div>
        <div class="about-philosophy">
          ${ABOUT.philosophy.map((l) => `<p>${l}</p>`).join('')}
        </div>
        <p class="about-thesis">${ABOUT.thesis}</p>
      </section>`;
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
            <a class="player-exit" href="#/" aria-label="Leave practice">✕</a>
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
          <a class="return-btn" href="#/">return to the room</a>
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
