// The Field Guide — journaling prompts + on-device storage.
// Everything lives in localStorage. Nothing ever leaves the device.

const FIELD_GUIDE = {
  prompts: [
    'Where is the static living in your body?',
    'What input would change the room inside you?',
    'What rhythm are you moving at today?',
    'What are you absorbing that isn’t yours?',
    'What would make your system feel 5% safer?',
    'What needs less force and more resonance?',
    'What is your body saying that your schedule keeps interrupting?',
    'What sound, place, or person tunes you without even trying?',
    'What signal have you been ignoring because it’s inconvenient?',
    'If today had a texture, what would it be — and what texture do you want tomorrow to have?',
    'Write the sentence under the sentence.',
    'What did you resonate with today, even for a second?',
  ],

  randomPrompt(except) {
    const pool = this.prompts.filter((p) => p !== except);
    return pool[Math.floor(Math.random() * pool.length)];
  },
};

const Store = {
  _load(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
      return [];
    }
  },
  _save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { /* storage full or unavailable — degrade silently */ }
  },

  // --- Daily checks: [{ date: 'YYYY-MM-DD', signalId }] — one per day ---
  today() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  },
  loadChecks() {
    return this._load('resonance.checks');
  },
  saveCheck(signalId) {
    const checks = this.loadChecks().filter((c) => c.date !== this.today());
    checks.push({ date: this.today(), signalId });
    checks.sort((a, b) => a.date.localeCompare(b.date));
    this._save('resonance.checks', checks.slice(-90)); // keep ~3 months
  },
  todaysCheck() {
    return this.loadChecks().find((c) => c.date === this.today()) || null;
  },

  // --- Journal: [{ id, date: ISO string, prompt, text }] ---
  loadEntries() {
    return this._load('resonance.journal');
  },
  saveEntry(prompt, text) {
    const entries = this.loadEntries();
    entries.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: new Date().toISOString(),
      prompt,
      text,
    });
    this._save('resonance.journal', entries);
  },
  deleteEntry(id) {
    this._save('resonance.journal', this.loadEntries().filter((e) => e.id !== id));
  },
};
