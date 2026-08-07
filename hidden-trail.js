(function () {
  if (new URLSearchParams(location.search).get('game') !== 'trail') return;

  const arena = document.querySelector('#arena');
  const action = document.querySelector('#action');
  const score = document.querySelector('#score');
  const progress = document.querySelector('#progress');
  const music = document.querySelector('#hidden-trail-music');
  const audioControls = document.querySelector('#audio-controls');
  const soundToggle = document.querySelector('#sound-toggle');
  const volume = document.querySelector('#volume');
  const stages = ['transport', 'place', 'activity', 'emotion', 'memory'];
  const labels = ['Transport', 'Place', 'Activity', 'Emotion', 'Memorable Moment'];
  const state = { difficulty: null, stageIndex: 0, route: [], blocked: new Set(), speaking: false };

  document.body.classList.add('hidden-trail-page');
  document.querySelector('#title').textContent = 'Hidden Trail';
  document.querySelector('#kicker').textContent = 'The Path of Clues';
  document.querySelector('#instructions').textContent = 'Follow the language clues. Wrong paths disappear into the fog.';
  document.body.style.setProperty('--bg', 'url(assets/waterfall.jpg)');
  document.title = 'Hidden Trail — Expedition Vault';

  function configureAudio() {
    audioControls.hidden = false;
    const saved = Number(localStorage.getItem('hiddenTrailMusicVolume') ?? 32);
    music.volume = saved / 100;
    music.muted = localStorage.getItem('hiddenTrailMusicMuted') === 'true';
    volume.value = String(saved);
    soundToggle.textContent = music.muted ? 'Sound off' : 'Sound on';
    soundToggle.onclick = () => {
      music.muted = !music.muted;
      localStorage.setItem('hiddenTrailMusicMuted', String(music.muted));
      soundToggle.textContent = music.muted ? 'Sound off' : 'Sound on';
      if (!music.muted) music.play().catch(() => {});
    };
    volume.oninput = () => {
      music.volume = Number(volume.value) / 100;
      localStorage.setItem('hiddenTrailMusicVolume', volume.value);
    };
  }

  function startMusic() { if (!music.muted) music.play().catch(() => {}); }
  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  function progressMarks() {
    return stages.map((_, index) => `<span class="trail-mark ${index < state.stageIndex ? 'complete' : index === state.stageIndex ? 'current' : ''}">${index < state.stageIndex ? '●' : '○'}</span>`).join('');
  }
  function createRoute(level) {
    state.route = stages.map(stage => {
      const pool = window.hiddenTrailTasks[level][stage];
      const task = pool[Math.floor(Math.random() * pool.length)];
      return { ...task, options: shuffle(task.options) };
    });
  }

  function renderStart() {
    arena.innerHTML = `<div class="trail-start"><div class="fog-bank"></div><span class="trail-compass">✦</span><h2>The Hidden Trail</h2><p>Only one path leads to the portal.<br>Follow the clues and choose carefully.<br>A wrong path will be swallowed by the fog.</p></div>`;
    score.textContent = 'START → PORTAL';
    progress.textContent = 'THE PATH OF CLUES';
    action.hidden = false;
    action.disabled = false;
    action.textContent = 'Enter the trail';
    action.onclick = () => { startMusic(); renderDifficulty(); };
  }

  function renderDifficulty() {
    arena.innerHTML = `<div class="trail-difficulty"><span class="trail-compass">⌖</span><h2>Choose your path</h2><p>The jungle changes its language for every traveler.</p><div class="trail-levels"><button data-level="easy"><b>Easy</b><small>A2–B1</small></button><button data-level="medium"><b>Medium</b><small>B1–B2</small></button><button data-level="hard"><b>Hard</b><small>B2–C1</small></button></div></div>`;
    action.hidden = true;
    arena.querySelectorAll('[data-level]').forEach(button => button.onclick = () => {
      state.difficulty = button.dataset.level;
      state.stageIndex = 0;
      state.blocked.clear();
      createRoute(state.difficulty);
      renderFork();
    });
  }

  function renderFork(message = 'Choose the path that completes the clue.') {
    const task = state.route[state.stageIndex];
    const paths = task.options.map((option, index) => {
      const blocked = state.blocked.has(option);
      return `<button class="jungle-path stone-road path-${index + 1} ${blocked ? 'fogged' : ''}" data-option="${encodeURIComponent(option)}" ${blocked ? 'disabled' : ''}><span class="path-sign">${option}</span><span class="road-stones" aria-hidden="true"></span><span class="road-vines" aria-hidden="true"></span><em>${blocked ? 'LOST IN FOG' : 'ENTER PATH'}</em></button>`;
    }).join('');
    arena.innerHTML = `<div class="trail-scene"><div class="trail-top"><div><small>MY SUMMER TRAIL</small><strong>STEP ${state.stageIndex + 1} — ${labels[state.stageIndex].toUpperCase()}</strong></div><div class="trail-progress">${progressMarks()}</div></div><div class="trail-clue"><small>${task.type.toUpperCase()} CLUE</small><h2>${task.prompt}</h2></div><div class="path-fork">${paths}</div><p class="trail-feedback" aria-live="polite">${message}</p></div>`;
    score.textContent = `${state.stageIndex} / 5 paths cleared`;
    progress.textContent = `HIDDEN TRAIL · ${labels[state.stageIndex].toUpperCase()}`;
    action.hidden = true;
    arena.querySelectorAll('[data-option]').forEach(path => path.onclick = () => choosePath(decodeURIComponent(path.dataset.option), path));
  }

  function choosePath(option, element) {
    const task = state.route[state.stageIndex];
    arena.querySelectorAll('.jungle-path').forEach(path => { path.disabled = true; });
    if (option !== task.correctAnswer) {
      state.blocked.add(option);
      element.classList.add('being-fogged');
      setTimeout(() => renderFork('The fog has swallowed this path. Choose another trail.'), 850);
      return;
    }
    element.classList.add('clear-path');
    setTimeout(renderSpeaking, 750);
  }

  function renderSpeaking() {
    const task = state.route[state.stageIndex];
    arena.innerHTML = `<div class="speaking-clearing"><div class="cleared-path"></div><span class="kicker">THE PATH IS CLEAR</span><h2>${task.speakingPrompt}</h2><p>Answer aloud. The jungle listens, but it does not judge your words.</p></div>`;
    score.textContent = `${state.stageIndex + 1} / 5 paths cleared`;
    action.hidden = false;
    action.disabled = false;
    action.textContent = 'Continue the trail';
    action.onclick = () => {
      state.stageIndex += 1;
      state.blocked.clear();
      if (state.stageIndex >= stages.length) renderPortal(); else renderFork();
    };
  }

  function saveCompletion() {
    localStorage.setItem('hiddenTrailCompleted', 'true');
    let achievements = [];
    try { achievements = JSON.parse(localStorage.getItem('expeditionAchievements') || '[]'); } catch (_) {}
    if (!achievements.includes('trail')) achievements.push('trail');
    localStorage.setItem('expeditionAchievements', JSON.stringify(achievements));
  }

  function renderPortal() {
    saveCompletion();
    arena.innerHTML = `<div class="portal-scene"><img class="hidden-trail-portal" src="3.png" alt="Ancient jungle portal"><p class="kicker">THE HIDDEN TRAIL HAS BEEN REVEALED</p><h2>You found the path through the jungle.</h2></div>`;
    score.textContent = '5 / 5 paths cleared';
    progress.textContent = 'PORTAL REVEALED';
    action.hidden = false;
    action.disabled = false;
    action.textContent = 'Enter the portal';
    action.onclick = () => { music.pause(); music.currentTime = 0; location.href = 'index.html'; };
  }

  configureAudio();
  renderStart();
  document.querySelector('#back-link').addEventListener('click', () => { music.pause(); music.currentTime = 0; });
  window.addEventListener('pagehide', () => music.pause());
})();
