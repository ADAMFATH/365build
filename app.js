const STORAGE_KEYS = {
    DAYS: 'accountability_days',
    WEEKLY_REVIEWS: 'accountability_weekly',
    HEALTH: 'accountability_health',
    FAITH: 'accountability_faith',
    ACHIEVEMENTS: 'accountability_achievements',
    FAILURES: 'accountability_failures',
    CLOSURE: 'accountability_closure',
    START_DATE: 'accountability_start_date'
  };
  
  class StorageManager {
    static get(key) {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
  
    static set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  
    static getArray(key) {
      return this.get(key) || [];
    }
  
    static getObject(key) {
      return this.get(key) || {};
    }
  }
  
  class Router {
    constructor() {
      this.routes = {};
      this.currentRoute = null;
      window.addEventListener('hashchange', () => this.handleRoute());
      window.addEventListener('load', () => this.handleRoute());
    }
  
    register(path, handler) {
      this.routes[path] = handler;
    }
  
    handleRoute() {
      const hash = window.location.hash.slice(1) || 'home';
      this.currentRoute = hash;
  
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${hash}`);
      });
  
      const handler = this.routes[hash] || this.routes['home'];
      handler();
    }
  }
  
  class App {
    constructor() {
      this.router = new Router();
      this.initRoutes();
      this.initStartDate();
    }
  
    initStartDate() {
      if (!StorageManager.get(STORAGE_KEYS.START_DATE)) {
        StorageManager.set(STORAGE_KEYS.START_DATE, new Date().toISOString());
      }
    }
  
    initRoutes() {
      this.router.register('home', () => this.renderHome());
      this.router.register('rules', () => this.renderRules());
      this.router.register('tracker', () => this.renderTracker());
      this.router.register('weekly', () => this.renderWeekly());
      this.router.register('health', () => this.renderHealth());
      this.router.register('faith', () => this.renderFaith());
      this.router.register('achievements', () => this.renderAchievements());
      this.router.register('failures', () => this.renderFailures());
      this.router.register('closure', () => this.renderClosure());
      this.router.register('about', () => this.renderAbout());
    }
  
    renderHome() {
      const startDate = new Date(StorageManager.get(STORAGE_KEYS.START_DATE));
      const today = new Date();
      const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  
      document.getElementById('main').innerHTML = `
        <div class="page-title">Intention</div>
  
        <div class="mission-statement">
          This is a year of action, not excuses.
        </div>
  
        <div class="section">
          <div class="section-title">Niyyah</div>
          <p style="margin-bottom: 1rem;">
            This is a contract with myself. A commitment to discipline, faith, and transformation.
          </p>
          <p style="margin-bottom: 1rem;">
            Every day is measured. Every action recorded. Not for perfection, but for accountability.
          </p>
          <p>
            This is not about motivation. This is about consistency in the face of resistance.
          </p>
        </div>
  
        <div class="section">
          <div class="section-title">Progress</div>
          <div class="stats">
            <div class="stat-card">
              <div class="stat-value">${daysPassed}</div>
              <div class="stat-label">Days In</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${365 - daysPassed}</div>
              <div class="stat-label">Days Remaining</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${Math.floor((daysPassed / 365) * 100)}%</div>
              <div class="stat-label">Complete</div>
            </div>
          </div>
        </div>
      `;
    }
  
    renderRules() {
      document.getElementById('main').innerHTML = `
        <div class="page-title">Rules of the Year</div>
  
        <p style="margin-bottom: 2rem;">These are laws, not suggestions.</p>
  
        <ul class="rules-list">
          <li class="rule-item">No sugar</li>
          <li class="rule-item">Gym or movement every day</li>
          <li class="rule-item">Five daily prayers minimum</li>
          <li class="rule-item">No pornography or masturbation</li>
          <li class="rule-item">Sleep before midnight</li>
          <li class="rule-item">Bad days are logged, never deleted</li>
          <li class="rule-item">No excuses, only execution</li>
        </ul>
  
        <div class="section" style="margin-top: 3rem;">
          <p style="font-style: italic; color: var(--gray-600);">
            Breaking a rule does not mean failure. It means acknowledgment and correction.
          </p>
        </div>
      `;
    }
  
    renderTracker() {
      const days = StorageManager.getArray(STORAGE_KEYS.DAYS);
      const startDate = new Date(StorageManager.get(STORAGE_KEYS.START_DATE));
  
      const stats = this.calculateStats(days);
  
      document.getElementById('main').innerHTML = `
        <div class="page-title">365-Day Tracker</div>
  
        <div class="stats">
          <div class="stat-card">
            <div class="stat-value">${stats.totalDays}</div>
            <div class="stat-label">Days Logged</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.prayerRate}%</div>
            <div class="stat-label">Prayer</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.gymRate}%</div>
            <div class="stat-label">Gym</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.sugarRate}%</div>
            <div class="stat-label">No Sugar</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.purityRate}%</div>
            <div class="stat-label">Purity</div>
          </div>
        </div>
  
        <div class="tracker-controls">
          <button class="btn" onclick="app.openDayModal()">Log Today</button>
          <button class="btn btn-secondary" onclick="app.openDayModal(true)">Log Past Day</button>
        </div>
  
        <div class="tracker-grid" id="daysList">
          ${this.renderDaysList(days)}
        </div>
  
        <div id="dayModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title" id="modalTitle">Log Day</div>
              <button class="modal-close" onclick="app.closeDayModal()">×</button>
            </div>
            <form id="dayForm" onsubmit="app.saveDay(event)">
              <input type="hidden" id="dayId" />
  
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" id="dayDate" class="form-input" required />
              </div>
  
              <div class="form-group">
                <label class="form-label">Prayer (5 daily prayers)</label>
                <div class="checkbox-group">
                  <label><input type="radio" name="prayer" value="yes" required /> Yes</label>
                  <label><input type="radio" name="prayer" value="no" /> No</label>
                </div>
              </div>
  
              <div class="form-group">
                <label class="form-label">Gym / Movement</label>
                <div class="checkbox-group">
                  <label><input type="radio" name="gym" value="yes" required /> Yes</label>
                  <label><input type="radio" name="gym" value="no" /> No</label>
                </div>
              </div>
  
              <div class="form-group">
                <label class="form-label">No Sugar</label>
                <div class="checkbox-group">
                  <label><input type="radio" name="sugar" value="yes" required /> Yes</label>
                  <label><input type="radio" name="sugar" value="no" /> No</label>
                </div>
              </div>
  
              <div class="form-group">
                <label class="form-label">No Porn / Masturbation</label>
                <div class="checkbox-group">
                  <label><input type="radio" name="purity" value="yes" required /> Yes</label>
                  <label><input type="radio" name="purity" value="no" /> No</label>
                </div>
              </div>
  
              <div class="form-group">
                <label class="form-label">Mood (1-5)</label>
                <div class="mood-selector">
                  <button type="button" class="mood-btn" data-mood="1" onclick="app.selectMood(1)">1</button>
                  <button type="button" class="mood-btn" data-mood="2" onclick="app.selectMood(2)">2</button>
                  <button type="button" class="mood-btn" data-mood="3" onclick="app.selectMood(3)">3</button>
                  <button type="button" class="mood-btn" data-mood="4" onclick="app.selectMood(4)">4</button>
                  <button type="button" class="mood-btn" data-mood="5" onclick="app.selectMood(5)">5</button>
                </div>
                <input type="hidden" id="dayMood" required />
              </div>
  
              <div class="form-group">
                <label class="form-label">One honest sentence</label>
                <input type="text" id="dayNote" class="form-input" maxlength="200" required placeholder="No paragraphs, just truth" />
              </div>
  
              <div class="form-actions">
                <button type="submit" class="btn">Save</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeDayModal()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  
    renderDaysList(days) {
      if (days.length === 0) {
        return '<div class="empty-state">No days logged yet. Start your journey.</div>';
      }
  
      return days
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(day => {
          const date = new Date(day.date);
          const dayNum = this.getDayNumber(day.date);
          return `
            <div class="day-card">
              <div class="day-header">
                <div class="day-number">Day ${dayNum}</div>
                <div class="day-date">${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <div class="day-metrics">
                <div class="metric">
                  <span class="metric-label">Prayer</span>
                  <span class="metric-status">${day.prayer === 'yes' ? '✓' : '✗'}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Gym</span>
                  <span class="metric-status">${day.gym === 'yes' ? '✓' : '✗'}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">No Sugar</span>
                  <span class="metric-status">${day.sugar === 'yes' ? '✓' : '✗'}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Purity</span>
                  <span class="metric-status">${day.purity === 'yes' ? '✓' : '✗'}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Mood</span>
                  <span class="metric-status">${day.mood}/5</span>
                </div>
              </div>
              ${day.note ? `<div class="day-note">"${day.note}"</div>` : ''}
            </div>
          `;
        })
        .join('');
    }
  
    getDayNumber(dateStr) {
      const startDate = new Date(StorageManager.get(STORAGE_KEYS.START_DATE));
      const currentDate = new Date(dateStr);
      return Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    }
  
    calculateStats(days) {
      if (days.length === 0) {
        return { totalDays: 0, prayerRate: 0, gymRate: 0, sugarRate: 0, purityRate: 0 };
      }
  
      return {
        totalDays: days.length,
        prayerRate: Math.round((days.filter(d => d.prayer === 'yes').length / days.length) * 100),
        gymRate: Math.round((days.filter(d => d.gym === 'yes').length / days.length) * 100),
        sugarRate: Math.round((days.filter(d => d.sugar === 'yes').length / days.length) * 100),
        purityRate: Math.round((days.filter(d => d.purity === 'yes').length / days.length) * 100)
      };
    }
  
    openDayModal(isPastDay = false) {
      const modal = document.getElementById('dayModal');
      const dateInput = document.getElementById('dayDate');
  
      if (!isPastDay) {
        dateInput.value = new Date().toISOString().split('T')[0];
        dateInput.readOnly = true;
      } else {
        dateInput.readOnly = false;
      }
  
      modal.classList.add('active');
    }
  
    closeDayModal() {
      document.getElementById('dayModal').classList.remove('active');
      document.getElementById('dayForm').reset();
    }
  
    selectMood(mood) {
      document.getElementById('dayMood').value = mood;
      document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('selected', parseInt(btn.dataset.mood) === mood);
      });
    }
  
    saveDay(event) {
      event.preventDefault();
  
      const form = event.target;
      const days = StorageManager.getArray(STORAGE_KEYS.DAYS);
  
      const dayData = {
        id: Date.now().toString(),
        date: form.dayDate.value,
        prayer: form.prayer.value,
        gym: form.gym.value,
        sugar: form.sugar.value,
        purity: form.purity.value,
        mood: form.dayMood.value,
        note: form.dayNote.value
      };
  
      const existingIndex = days.findIndex(d => d.date === dayData.date);
      if (existingIndex >= 0) {
        days[existingIndex] = dayData;
      } else {
        days.push(dayData);
      }
  
      StorageManager.set(STORAGE_KEYS.DAYS, days);
      this.closeDayModal();
      this.renderTracker();
    }
  
    renderWeekly() {
      const reviews = StorageManager.getArray(STORAGE_KEYS.WEEKLY_REVIEWS);
  
      document.getElementById('main').innerHTML = `
        <div class="page-title">Weekly Review</div>
  
        <button class="btn" style="margin-bottom: 2rem;" onclick="app.openWeeklyModal()">Add Weekly Review</button>
  
        <div class="entry-list">
          ${reviews.length === 0 ? '<div class="empty-state">No weekly reviews yet.</div>' :
            reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map(review => `
              <div class="entry-card">
                <div class="entry-date">${new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="entry-content">
                  <p style="margin-bottom: 1rem;"><strong>What Worked:</strong><br/>${review.worked}</p>
                  <p style="margin-bottom: 1rem;"><strong>What Failed:</strong><br/>${review.failed}</p>
                  <p><strong>Next Week:</strong><br/>${review.adjust}</p>
                </div>
              </div>
            `).join('')
          }
        </div>
  
        <div id="weeklyModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title">Weekly Review</div>
              <button class="modal-close" onclick="app.closeWeeklyModal()">×</button>
            </div>
            <form id="weeklyForm" onsubmit="app.saveWeekly(event)">
              <div class="form-group">
                <label class="form-label">What worked</label>
                <textarea id="weeklyWorked" class="form-textarea" required></textarea>
              </div>
  
              <div class="form-group">
                <label class="form-label">What failed</label>
                <textarea id="weeklyFailed" class="form-textarea" required></textarea>
              </div>
  
              <div class="form-group">
                <label class="form-label">What to adjust next week</label>
                <textarea id="weeklyAdjust" class="form-textarea" required></textarea>
              </div>
  
              <div class="form-actions">
                <button type="submit" class="btn">Save</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeWeeklyModal()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  
    openWeeklyModal() {
      document.getElementById('weeklyModal').classList.add('active');
    }
  
    closeWeeklyModal() {
      document.getElementById('weeklyModal').classList.remove('active');
      document.getElementById('weeklyForm').reset();
    }
  
    saveWeekly(event) {
      event.preventDefault();
  
      const form = event.target;
      const reviews = StorageManager.getArray(STORAGE_KEYS.WEEKLY_REVIEWS);
  
      reviews.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        worked: form.weeklyWorked.value,
        failed: form.weeklyFailed.value,
        adjust: form.weeklyAdjust.value
      });
  
      StorageManager.set(STORAGE_KEYS.WEEKLY_REVIEWS, reviews);
      this.closeWeeklyModal();
      this.renderWeekly();
    }
  
    renderHealth() {
      const entries = StorageManager.getArray(STORAGE_KEYS.HEALTH);
  
      document.getElementById('main').innerHTML = `
        <div class="page-title">Body & Health</div>
  
        <p style="margin-bottom: 2rem;">Track trends only. No obsession.</p>
  
        <button class="btn" style="margin-bottom: 2rem;" onclick="app.openHealthModal()">Log Health Entry</button>
  
        <div class="entry-list">
          ${entries.length === 0 ? '<div class="empty-state">No health entries yet.</div>' :
            entries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => `
              <div class="entry-card">
                <div class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="entry-content">
                  ${entry.weight ? `<p><strong>Weight:</strong> ${entry.weight} kg</p>` : ''}
                  ${entry.strength ? `<p><strong>Strength:</strong> ${entry.strength}</p>` : ''}
                  ${entry.sleep ? `<p><strong>Sleep:</strong> ${entry.sleep}</p>` : ''}
                  ${entry.notes ? `<p style="margin-top: 0.5rem;">${entry.notes}</p>` : ''}
                </div>
              </div>
            `).join('')
          }
        </div>
  
        <div id="healthModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title">Health Entry</div>
              <button class="modal-close" onclick="app.closeHealthModal()">×</button>
            </div>
            <form id="healthForm" onsubmit="app.saveHealth(event)">
              <div class="form-group">
                <label class="form-label">Weight (kg, optional)</label>
                <input type="number" id="healthWeight" class="form-input" step="0.1" />
              </div>
  
              <div class="form-group">
                <label class="form-label">Strength progress (optional)</label>
                <input type="text" id="healthStrength" class="form-input" placeholder="e.g., Bench press 80kg" />
              </div>
  
              <div class="form-group">
                <label class="form-label">Sleep quality (optional)</label>
                <input type="text" id="healthSleep" class="form-input" placeholder="e.g., 7 hours, quality good" />
              </div>
  
              <div class="form-group">
                <label class="form-label">Notes (optional)</label>
                <textarea id="healthNotes" class="form-textarea"></textarea>
              </div>
  
              <div class="form-actions">
                <button type="submit" class="btn">Save</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeHealthModal()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  
    openHealthModal() {
      document.getElementById('healthModal').classList.add('active');
    }
  
    closeHealthModal() {
      document.getElementById('healthModal').classList.remove('active');
      document.getElementById('healthForm').reset();
    }
  
    saveHealth(event) {
      event.preventDefault();
  
      const form = event.target;
      const entries = StorageManager.getArray(STORAGE_KEYS.HEALTH);
  
      entries.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        weight: form.healthWeight.value,
        strength: form.healthStrength.value,
        sleep: form.healthSleep.value,
        notes: form.healthNotes.value
      });
  
      StorageManager.set(STORAGE_KEYS.HEALTH, entries);
      this.closeHealthModal();
      this.renderHealth();
    }
  
    renderFaith() {
      const entries = StorageManager.getArray(STORAGE_KEYS.FAITH);
  
      document.getElementById('main').innerHTML = `
        <div class="page-title">Faith & Character</div>
  
        <button class="btn" style="margin-bottom: 2rem;" onclick="app.openFaithModal()">Add Faith Entry</button>
  
        <div class="entry-list">
          ${entries.length === 0 ? '<div class="empty-state">No faith entries yet.</div>' :
            entries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => `
              <div class="entry-card">
                <div class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="entry-content">
                  ${entry.ayah ? `<p style="margin-bottom: 0.75rem; font-style: italic;">"${entry.ayah}"</p>` : ''}
                  ${entry.trait ? `<p><strong>Character Focus:</strong> ${entry.trait}</p>` : ''}
                  ${entry.reflection ? `<p style="margin-top: 0.5rem;">${entry.reflection}</p>` : ''}
                </div>
              </div>
            `).join('')
          }
        </div>
  
        <div id="faithModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title">Faith Entry</div>
              <button class="modal-close" onclick="app.closeFaithModal()">×</button>
            </div>
            <form id="faithForm" onsubmit="app.saveFaith(event)">
              <div class="form-group">
                <label class="form-label">Ayah or reminder (optional)</label>
                <textarea id="faithAyah" class="form-textarea"></textarea>
              </div>
  
              <div class="form-group">
                <label class="form-label">Character trait focus</label>
                <input type="text" id="faithTrait" class="form-input" placeholder="e.g., Sabr, Haya, Discipline" required />
              </div>
  
              <div class="form-group">
                <label class="form-label">Reflection</label>
                <textarea id="faithReflection" class="form-textarea" required></textarea>
              </div>
  
              <div class="form-actions">
                <button type="submit" class="btn">Save</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeFaithModal()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  
    openFaithModal() {
      document.getElementById('faithModal').classList.add('active');
    }
  
    closeFaithModal() {
      document.getElementById('faithModal').classList.remove('active');
      document.getElementById('faithForm').reset();
    }
  
    saveFaith(event) {
      event.preventDefault();
  
      const form = event.target;
      const entries = StorageManager.getArray(STORAGE_KEYS.FAITH);
  
      entries.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ayah: form.faithAyah.value,
        trait: form.faithTrait.value,
        reflection: form.faithReflection.value
      });
  
      StorageManager.set(STORAGE_KEYS.FAITH, entries);
      this.closeFaithModal();
      this.renderFaith();
    }
  
    renderAchievements() {
      const entries = StorageManager.getArray(STORAGE_KEYS.ACHIEVEMENTS);
  
      document.getElementById('main').innerHTML = `
        <div class="page-title">Achievements</div>
  
        <p style="margin-bottom: 2rem;">Small wins count.</p>
  
        <button class="btn" style="margin-bottom: 2rem;" onclick="app.openAchievementModal()">Add Achievement</button>
  
        <div class="entry-list">
          ${entries.length === 0 ? '<div class="empty-state">No achievements logged yet.</div>' :
            entries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => `
              <div class="entry-card">
                <div class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="entry-content">
                  <p style="font-weight: 600; margin-bottom: 0.5rem;">${entry.title}</p>
                  ${entry.description ? `<p>${entry.description}</p>` : ''}
                </div>
              </div>
            `).join('')
          }
        </div>
  
        <div id="achievementModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title">Achievement</div>
              <button class="modal-close" onclick="app.closeAchievementModal()">×</button>
            </div>
            <form id="achievementForm" onsubmit="app.saveAchievement(event)">
              <div class="form-group">
                <label class="form-label">What did you achieve?</label>
                <input type="text" id="achievementTitle" class="form-input" required />
              </div>
  
              <div class="form-group">
                <label class="form-label">Details (optional)</label>
                <textarea id="achievementDescription" class="form-textarea"></textarea>
              </div>
  
              <div class="form-actions">
                <button type="submit" class="btn">Save</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeAchievementModal()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  
    openAchievementModal() {
      document.getElementById('achievementModal').classList.add('active');
    }
  
    closeAchievementModal() {
      document.getElementById('achievementModal').classList.remove('active');
      document.getElementById('achievementForm').reset();
    }
  
    saveAchievement(event) {
      event.preventDefault();
  
      const form = event.target;
      const entries = StorageManager.getArray(STORAGE_KEYS.ACHIEVEMENTS);
  
      entries.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title: form.achievementTitle.value,
        description: form.achievementDescription.value
      });
  
      StorageManager.set(STORAGE_KEYS.ACHIEVEMENTS, entries);
      this.closeAchievementModal();
      this.renderAchievements();
    }
  
    renderFailures() {
      const entries = StorageManager.getArray(STORAGE_KEYS.FAILURES);
  
      document.getElementById('main').innerHTML = `
        <div class="page-title">Failures & Lessons</div>
  
        <p style="margin-bottom: 2rem;">Shame-free logging. Learn and move forward.</p>
  
        <button class="btn" style="margin-bottom: 2rem;" onclick="app.openFailureModal()">Log Failure</button>
  
        <div class="entry-list">
          ${entries.length === 0 ? '<div class="empty-state">No failures logged yet.</div>' :
            entries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => `
              <div class="entry-card">
                <div class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="entry-content">
                  <p style="margin-bottom: 0.75rem;"><strong>What Failed:</strong><br/>${entry.what}</p>
                  <p style="margin-bottom: 0.75rem;"><strong>Why:</strong><br/>${entry.why}</p>
                  <p><strong>What Will Change:</strong><br/>${entry.change}</p>
                </div>
              </div>
            `).join('')
          }
        </div>
  
        <div id="failureModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title">Failure & Lesson</div>
              <button class="modal-close" onclick="app.closeFailureModal()">×</button>
            </div>
            <form id="failureForm" onsubmit="app.saveFailure(event)">
              <div class="form-group">
                <label class="form-label">What failed</label>
                <textarea id="failureWhat" class="form-textarea" required></textarea>
              </div>
  
              <div class="form-group">
                <label class="form-label">Why it failed</label>
                <textarea id="failureWhy" class="form-textarea" required></textarea>
              </div>
  
              <div class="form-group">
                <label class="form-label">What will be done differently</label>
                <textarea id="failureChange" class="form-textarea" required></textarea>
              </div>
  
              <div class="form-actions">
                <button type="submit" class="btn">Save</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeFailureModal()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  
    openFailureModal() {
      document.getElementById('failureModal').classList.add('active');
    }
  
    closeFailureModal() {
      document.getElementById('failureModal').classList.remove('active');
      document.getElementById('failureForm').reset();
    }
  
    saveFailure(event) {
      event.preventDefault();
  
      const form = event.target;
      const entries = StorageManager.getArray(STORAGE_KEYS.FAILURES);
  
      entries.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        what: form.failureWhat.value,
        why: form.failureWhy.value,
        change: form.failureChange.value
      });
  
      StorageManager.set(STORAGE_KEYS.FAILURES, entries);
      this.closeFailureModal();
      this.renderFailures();
    }
  
    renderClosure() {
      const entries = StorageManager.getArray(STORAGE_KEYS.CLOSURE);
  
      document.getElementById('main').innerHTML = `
        <div class="page-title">Apologies & Closure</div>
  
        <p style="margin-bottom: 2rem;">Let go. Move forward.</p>
  
        <button class="btn" style="margin-bottom: 2rem;" onclick="app.openClosureModal()">Add Entry</button>
  
        <div class="entry-list">
          ${entries.length === 0 ? '<div class="empty-state">No entries yet.</div>' :
            entries.sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => `
              <div class="entry-card">
                <div class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="entry-content">
                  <p style="font-weight: 600; margin-bottom: 0.5rem;">${entry.title}</p>
                  <p>${entry.content}</p>
                  ${entry.sent ? '<p style="margin-top: 0.5rem; color: var(--gray-600); font-size: 0.9rem;">Sent</p>' : ''}
                </div>
              </div>
            `).join('')
          }
        </div>
  
        <div id="closureModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-title">Closure Entry</div>
              <button class="modal-close" onclick="app.closeClosureModal()">×</button>
            </div>
            <form id="closureForm" onsubmit="app.saveClosure(event)">
              <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" id="closureTitle" class="form-input" required placeholder="e.g., Apology to..." />
              </div>
  
              <div class="form-group">
                <label class="form-label">Content</label>
                <textarea id="closureContent" class="form-textarea" required></textarea>
              </div>
  
              <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                  <input type="checkbox" id="closureSent" />
                  <span>Sent or delivered</span>
                </label>
              </div>
  
              <div class="form-actions">
                <button type="submit" class="btn">Save</button>
                <button type="button" class="btn btn-secondary" onclick="app.closeClosureModal()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      `;
    }
  
    openClosureModal() {
      document.getElementById('closureModal').classList.add('active');
    }
  
    closeClosureModal() {
      document.getElementById('closureModal').classList.remove('active');
      document.getElementById('closureForm').reset();
    }
  
    saveClosure(event) {
      event.preventDefault();
  
      const form = event.target;
      const entries = StorageManager.getArray(STORAGE_KEYS.CLOSURE);
  
      entries.push({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        title: form.closureTitle.value,
        content: form.closureContent.value,
        sent: form.closureSent.checked
      });
  
      StorageManager.set(STORAGE_KEYS.CLOSURE, entries);
      this.closeClosureModal();
      this.renderClosure();
    }
  
    renderAbout() {
      document.getElementById('main').innerHTML = `
        <div class="page-title">About / Why Public</div>
  
        <div class="section">
          <div class="section-title">Why This Exists</div>
          <p style="margin-bottom: 1rem;">
            This is not a blog. This is not motivational content. This is not social media.
          </p>
          <p style="margin-bottom: 1rem;">
            This is a contract. A year of transformation through discipline, faith, and honest accountability.
          </p>
          <p>
            It is public to remove the option of hiding. Public to force honesty. Public to eliminate excuses.
          </p>
        </div>
  
        <div class="section">
          <div class="section-title">What This Year Represents</div>
          <p style="margin-bottom: 1rem;">
            A year of deliberate action over empty words.
          </p>
          <p style="margin-bottom: 1rem;">
            A year of building character through consistent, measured choices.
          </p>
          <p>
            A year of becoming the person I committed to be.
          </p>
        </div>
  
        <div class="section">
          <div class="section-title">Non-Negotiable Values</div>
          <ul class="rules-list">
            <li class="rule-item">Discipline over motivation</li>
            <li class="rule-item">Action over perfection</li>
            <li class="rule-item">Honesty over image</li>
            <li class="rule-item">Faith as foundation</li>
            <li class="rule-item">Consistency over intensity</li>
            <li class="rule-item">Progress over comfort</li>
          </ul>
        </div>
  
        <div class="section">
          <p style="font-style: italic; color: var(--gray-600);">
            No ads. No monetization. No comments. No likes. No comparison.
            <br/><br/>
            Just one person, 365 days, and a commitment to change.
          </p>
        </div>
      `;
    }
  }
  
  const app = new App();
  