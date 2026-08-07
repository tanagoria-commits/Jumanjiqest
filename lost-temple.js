const scenes = [...document.querySelectorAll('.scene')];
const state = { level: null, trial: 0, used: new Set(), current: null, selectedTerm: null, matched: 0, fragments: new Set(), locked: false, sound: false };
const trialTypes = ['matching', 'meaning', 'sentence', 'matching', 'sentence'];
const labels = { easy: 'Easy · ESL A2–B1', medium: 'Medium · ESL B1–B2', hard: 'Hard · ESL B2–C1' };
const questMusic = document.querySelector('#quest-music');
const volumeInput = document.querySelector('#music-volume');
const volumeLabel = document.querySelector('#volume-label');
const savedVolume = Math.max(0, Math.min(1, Number(localStorage.getItem('questMusicVolume') ?? .55)));
state.sound = localStorage.getItem('questMusicMuted') !== 'true';
questMusic.volume = savedVolume; questMusic.muted = !state.sound; volumeInput.value = savedVolume; volumeLabel.textContent = `${Math.round(savedVolume * 100)}%`;

async function startQuestMusic() {
  if (!state.sound) return;
  try { await questMusic.play(); } catch (_) {}
}

function stopQuestMusic(reset = true) {
  questMusic.pause(); if (reset) questMusic.currentTime = 0;
}

function fadeMusic(duration = 1100) {
  const start = questMusic.volume, steps = 20, stepTime = duration / steps; let step = 0;
  const timer = setInterval(() => { step++; questMusic.volume = Math.max(0, start * (1 - step / steps)); if (step >= steps) { clearInterval(timer); stopQuestMusic(); questMusic.volume = Number(volumeInput.value); } }, stepTime);
}

function showScene(name) {
  scenes.forEach(scene => scene.classList.toggle('active', scene.dataset.scene === name));
  document.body.classList.toggle('puzzle-active', name === 'chamber');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}

function playTone(frequency, duration = .12, delay = 0) {
  if (!state.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = playTone.context || (playTone.context = new AudioContext());
  const oscillator = context.createOscillator(); const gain = context.createGain();
  oscillator.type = 'sine'; oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(.0001, context.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(.12, context.currentTime + delay + .015);
  gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + delay + duration);
  oscillator.connect(gain); gain.connect(context.destination);
  oscillator.start(context.currentTime + delay); oscillator.stop(context.currentTime + delay + duration + .02);
}

function nextQuestion(type) {
  const pool = LOST_TEMPLE_QUESTIONS[state.level][type];
  let available = pool.filter(question => !state.used.has(question.id));
  if (!available.length) {
    pool.forEach(question => state.used.delete(question.id));
    available = pool.filter(question => question.id !== state.current?.id);
  }
  const question = available[Math.floor(Math.random() * available.length)];
  state.used.add(question.id);
  state.current = question;
  return question;
}

function renderProgress() {
  document.querySelector('#trial-stones').innerHTML = Array.from({ length: 5 }, (_, index) => `<span class="${index < state.trial ? 'complete' : index === state.trial ? 'current' : ''}">${index < state.trial ? '◆' : '◇'}</span>`).join('');
  document.querySelector('#trial-title').textContent = `Trial ${state.trial + 1}`;
  document.querySelector('#difficulty-label').textContent = labels[state.level];
}

function renderQuestion(replacement = false) {
  state.locked = false; state.selectedTerm = null; state.matched = 0;
  const type = trialTypes[state.trial];
  const question = nextQuestion(type);
  const content = document.querySelector('#challenge-content');
  const feedback = document.querySelector('#feedback');
  feedback.className = 'feedback'; feedback.textContent = replacement ? 'A new trial rises from the stone…' : '';
  document.querySelector('#challenge-type').textContent = type === 'matching' ? 'Match the Meanings' : type === 'meaning' ? 'Choose the Meaning' : 'Complete the Sentence';
  document.querySelector('#question-count').textContent = `${LOST_TEMPLE_QUESTIONS[state.level][type].length} tasks in this pool`;
  if (type === 'matching') {
    const terms = shuffle(question.pairs);
    const definitions = shuffle(question.pairs);
    content.innerHTML = `<h3>${question.prompt}</h3><div class="matching-board"><div>${terms.map(pair => `<button class="match-item term" data-value="${pair.term}">${pair.term}</button>`).join('')}</div><div>${definitions.map(pair => `<button class="match-item definition" data-term="${pair.term}">${pair.definition}</button>`).join('')}</div></div>`;
    content.querySelectorAll('.term').forEach(button => button.addEventListener('click', () => selectTerm(button)));
    content.querySelectorAll('.definition').forEach(button => button.addEventListener('click', () => selectDefinition(button)));
  } else {
    content.innerHTML = `<h3>${question.prompt}</h3><div class="option-list">${shuffle(question.options).map((option, index) => `<button class="answer-option" data-answer="${option}"><span>${String.fromCharCode(65 + index)}</span>${option}</button>`).join('')}</div>`;
    content.querySelectorAll('.answer-option').forEach(button => button.addEventListener('click', () => answer(button.dataset.answer, button)));
  }
}

function selectTerm(button) {
  if (state.locked || button.classList.contains('matched')) return;
  document.querySelectorAll('.term').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected'); state.selectedTerm = button.dataset.value;
}

function selectDefinition(button) {
  if (state.locked || !state.selectedTerm || button.classList.contains('matched')) return;
  if (button.dataset.term !== state.selectedTerm) return wrongAnswer();
  const term = [...document.querySelectorAll('.term')].find(item => item.dataset.value === state.selectedTerm);
  term.classList.add('matched'); term.classList.remove('selected'); button.classList.add('matched'); state.selectedTerm = null; state.matched++;
  if (state.matched === state.current.pairs.length) correctAnswer();
}

function answer(value, button) {
  if (state.locked) return;
  if (value === state.current.correctAnswer) { button.classList.add('correct'); correctAnswer(); }
  else { button.classList.add('wrong'); wrongAnswer(); }
}

function wrongAnswer() {
  state.locked = true;
  const feedback = document.querySelector('#feedback');
  feedback.className = 'feedback error'; feedback.textContent = 'The temple rejects your answer. A new trial awakens…';
  document.querySelector('.challenge-panel').classList.add('temple-error');
  setTimeout(() => { document.querySelector('.challenge-panel').classList.remove('temple-error'); renderQuestion(true); }, 1200);
}

function correctAnswer() {
  state.locked = true;
  const feedback = document.querySelector('#feedback');
  feedback.className = 'feedback success'; feedback.textContent = 'Correct. The temple opens the next path.';
  setTimeout(() => {
    state.trial++;
    if (state.trial >= 5) { showScene('doors'); setTimeout(() => document.querySelector('.stone-doors').classList.add('open'), 400); }
    else { renderProgress(); renderQuestion(); }
  }, 1100);
}

function startTrials(level) {
  state.level = level; state.trial = 0; state.used.clear();
  renderProgress(); showScene('trial'); renderQuestion();
}

function renderFragmentSlots() {
  document.querySelector('#fragment-count').textContent = `Relic puzzle: ${state.fragments.size} / 5`;
  document.querySelector('#fragment-slots').innerHTML = Array.from({ length: 5 }, (_, i) => `<span class="${i < state.fragments.size ? 'found' : ''}">${i < state.fragments.size ? '◆' : '◇'}</span>`).join('');
}

function setupRelicPuzzle() {
  state.fragments.clear(); renderFragmentSlots();
  const room = document.querySelector('#puzzle-room');
  const board = document.querySelector('#puzzle-board');
  const container = document.querySelector('#puzzle-pieces');
  const targets = document.querySelector('#puzzle-targets');
  const message = document.querySelector('#puzzle-message');
  container.innerHTML = ''; targets.innerHTML = ''; message.textContent = 'Drag each fragment onto the relic silhouette.'; message.className = 'puzzle-message';
  const boardWidth = board.clientWidth;
  const boardHeight = board.clientHeight;
  const pieceHeight = boardHeight / 5;
  const shapes = [
    'polygon(0 0,100% 0,100% 78%,82% 78%,77% 100%,64% 100%,59% 78%,0 78%)',
    'polygon(0 0,59% 0,64% 22%,77% 22%,82% 0,100% 0,100% 82%,38% 82%,33% 100%,20% 100%,15% 82%,0 82%)',
    'polygon(0 0,15% 0,20% 18%,33% 18%,38% 0,100% 0,100% 78%,72% 78%,67% 100%,54% 100%,49% 78%,0 78%)',
    'polygon(0 0,49% 0,54% 22%,67% 22%,72% 0,100% 0,100% 82%,43% 82%,38% 100%,25% 100%,20% 82%,0 82%)',
    'polygon(0 0,20% 0,25% 18%,38% 18%,43% 0,100% 0,100% 100%,0 100%)'
  ];
  const order = shuffle([0,1,2,3,4]);
  order.forEach((pieceIndex, trayIndex) => {
    const target = document.createElement('div'); target.className = 'puzzle-target'; target.style.cssText = `top:${pieceIndex * 20}%;height:20%;`; targets.append(target);
    const piece = document.createElement('button');
    piece.type = 'button'; piece.className = 'puzzle-piece'; piece.dataset.piece = pieceIndex;
    piece.setAttribute('aria-label', `Relic puzzle fragment ${pieceIndex + 1}`);
    piece.style.width = `${boardWidth}px`; piece.style.height = `${pieceHeight * 1.28}px`;
    piece.style.backgroundSize = `${boardWidth}px ${boardHeight}px`;
    piece.style.backgroundPosition = `0 -${pieceIndex * pieceHeight}px`;
    piece.style.clipPath = shapes[pieceIndex];
    container.append(piece);
    placeInTray(piece, trayIndex, boardWidth, pieceHeight);
    piece.addEventListener('pointerdown', startPieceDrag);
    piece.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') snapPiece(piece); });
  });
}

function placeInTray(piece, trayIndex, pieceWidth, pieceHeight) {
  const room = document.querySelector('#puzzle-room');
  const board = document.querySelector('#puzzle-board');
  const mobile = room.clientWidth < 820;
  let x, y;
  if (mobile) {
    const leftSide = trayIndex % 2 === 0;
    x = leftSide ? 8 : room.clientWidth - pieceWidth - 8;
    y = 30 + Math.floor(trayIndex / 2) * (pieceHeight * 1.48) + (leftSide ? 0 : pieceHeight * .55);
  } else {
    const leftSide = trayIndex % 2 === 0;
    x = leftSide ? 25 : room.clientWidth - pieceWidth - 25;
    y = 55 + Math.floor(trayIndex / 2) * (pieceHeight * 1.45) + (leftSide ? 0 : pieceHeight * .5);
  }
  piece.style.left = `${x}px`; piece.style.top = `${y}px`;
}

function layoutPuzzlePieces() {
  const board = document.querySelector('#puzzle-board');
  const pieces = [...document.querySelectorAll('.puzzle-piece')];
  if (!board || !pieces.length) return;
  const pieceHeight = board.clientHeight / 5;
  let trayIndex = 0;
  pieces.forEach(piece => {
    const index = Number(piece.dataset.piece);
    piece.style.width = `${board.clientWidth}px`; piece.style.height = `${pieceHeight * 1.28}px`;
    piece.style.backgroundSize = `${board.clientWidth}px ${board.clientHeight}px`;
    piece.style.backgroundPosition = `0 -${index * pieceHeight}px`;
    if (piece.classList.contains('placed')) {
      const target = correctPiecePosition(piece); piece.style.left = `${target.left}px`; piece.style.top = `${target.top}px`;
    } else placeInTray(piece, trayIndex++, board.clientWidth, pieceHeight);
  });
}

function startPieceDrag(event) {
  const piece = event.currentTarget;
  if (piece.classList.contains('placed')) return;
  event.preventDefault(); piece.setPointerCapture(event.pointerId); piece.classList.add('dragging');
  document.querySelector('#puzzle-board').classList.add('accepting');
  const message = document.querySelector('#puzzle-message');
  message.textContent = 'Move the fragment onto any part of the relic silhouette.'; message.className = 'puzzle-message';
  const room = document.querySelector('#puzzle-room');
  const rect = piece.getBoundingClientRect(); const roomRect = room.getBoundingClientRect();
  const offsetX = event.clientX - rect.left; const offsetY = event.clientY - rect.top;
  const move = moveEvent => {
    const x = Math.max(0, Math.min(room.clientWidth - piece.offsetWidth, moveEvent.clientX - roomRect.left - offsetX));
    const y = Math.max(0, Math.min(room.clientHeight - piece.offsetHeight, moveEvent.clientY - roomRect.top - offsetY));
    piece.style.left = `${x}px`; piece.style.top = `${y}px`;
  };
  const end = endEvent => { piece.classList.remove('dragging'); document.querySelector('#puzzle-board').classList.remove('accepting'); piece.removeEventListener('pointermove', move); piece.removeEventListener('pointerup', end); piece.removeEventListener('pointercancel', end); checkPieceDrop(piece, endEvent); };
  piece.addEventListener('pointermove', move); piece.addEventListener('pointerup', end); piece.addEventListener('pointercancel', end);
}

function correctPiecePosition(piece) {
  const room = document.querySelector('#puzzle-room');
  const board = document.querySelector('#puzzle-board');
  const index = Number(piece.dataset.piece);
  const roomRect = room.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();
  return {
    left: boardRect.left - roomRect.left,
    top: boardRect.top - roomRect.top + index * (boardRect.height / 5)
  };
}

function checkPieceDrop(piece, pointerEvent) {
  const target = correctPiecePosition(piece);
  const board = document.querySelector('#puzzle-board');
  const pieceRect = piece.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();
  const overlapWidth = Math.max(0, Math.min(pieceRect.right, boardRect.right) - Math.max(pieceRect.left, boardRect.left));
  const overlapHeight = Math.max(0, Math.min(pieceRect.bottom, boardRect.bottom) - Math.max(pieceRect.top, boardRect.top));
  const overlapRatio = (overlapWidth * overlapHeight) / (pieceRect.width * pieceRect.height);
  const pointerMargin = Math.max(70, boardRect.width * .4);
  const pointerNearSilhouette = pointerEvent && pointerEvent.clientX >= boardRect.left - pointerMargin && pointerEvent.clientX <= boardRect.right + pointerMargin && pointerEvent.clientY >= boardRect.top - pointerMargin && pointerEvent.clientY <= boardRect.bottom + pointerMargin;
  if (pointerNearSilhouette || overlapRatio >= .08) snapPiece(piece);
  else {
    const message = document.querySelector('#puzzle-message'); message.textContent = 'That fragment does not belong there. Try another position.'; message.className = 'puzzle-message error';
    playTone(145, .18);
    piece.classList.add('rejected'); setTimeout(() => piece.classList.remove('rejected'), 400);
  }
}

function snapPiece(piece) {
  if (piece.classList.contains('placed')) return;
  const target = correctPiecePosition(piece); const index = piece.dataset.piece;
  piece.style.left = `${target.left}px`; piece.style.top = `${target.top}px`; piece.classList.add('placed'); piece.style.zIndex = Number(index) + 5;
  piece.setAttribute('aria-label', `Relic puzzle fragment ${Number(index) + 1}, correctly placed`);
  state.fragments.add(index); renderFragmentSlots();
  playTone(520 + state.fragments.size * 70, .16);
  const message = document.querySelector('#puzzle-message'); message.textContent = `Fragment secured. ${5 - state.fragments.size} remaining.`; message.className = 'puzzle-message success';
  if (state.fragments.size === 5) setTimeout(restoreRelic, 1000);
}

function restoreRelic() {
  playTone(520, .35); playTone(660, .35, .12); playTone(820, .5, .24);
  localStorage.setItem('lostTempleCompleted', 'true');
  localStorage.setItem('lostTempleRelicCollected', 'true');
  let achievements = [];
  try { achievements = JSON.parse(localStorage.getItem('expeditionAchievements') || '[]'); } catch (_) {}
  if (!achievements.includes('temple')) achievements.push('temple');
  localStorage.setItem('expeditionAchievements', JSON.stringify(achievements));
  showScene('restored');
  fadeMusic();
  setTimeout(() => { window.location.href = 'index.html#games'; }, 3200);
}

document.querySelector('#enter-temple').addEventListener('click', () => { startQuestMusic(); showScene('difficulty'); });
document.querySelector('#resume-quest').addEventListener('click', () => { startQuestMusic(); showScene('difficulty'); });
document.querySelectorAll('.difficulty').forEach(button => button.addEventListener('click', () => startTrials(button.dataset.level)));
document.querySelector('#enter-chamber').addEventListener('click', () => { showScene('chamber'); requestAnimationFrame(setupRelicPuzzle); });
document.querySelector('#sound-toggle').addEventListener('click', event => { state.sound = !state.sound; questMusic.muted = !state.sound; localStorage.setItem('questMusicMuted', String(!state.sound)); event.currentTarget.textContent = state.sound ? '♫' : '♪'; if (state.sound) { startQuestMusic(); playTone(620, .12); } });
volumeInput.addEventListener('input', () => { const volume = Number(volumeInput.value); questMusic.volume = volume; volumeLabel.textContent = `${Math.round(volume * 100)}%`; localStorage.setItem('questMusicVolume', String(volume)); if (volume > 0 && state.sound) startQuestMusic(); });
document.querySelectorAll('button,a').forEach(control => control.addEventListener('pointerdown', () => playTone(330, .055)));
window.addEventListener('pagehide', () => stopQuestMusic());
let resizeTimer;
window.addEventListener('resize', () => { if (!document.body.classList.contains('puzzle-active')) return; clearTimeout(resizeTimer); resizeTimer = setTimeout(layoutPuzzlePieces, 120); });

if (localStorage.getItem('lostTempleCompleted') === 'true') document.querySelector('#resume-quest').classList.remove('hidden');
const devScene = new URLSearchParams(location.search).get('scene');
if (localStorage.getItem('developerMode') === 'true' && devScene) {
  if (devScene === 'difficulty') showScene('difficulty');
  else if (devScene === 'trial') { state.level = 'medium'; state.trial = 0; renderProgress(); showScene('trial'); renderQuestion(); }
  else if (devScene === 'doors') { showScene('doors'); requestAnimationFrame(() => document.querySelector('.stone-doors').classList.add('open')); }
  else if (devScene === 'chamber') { showScene('chamber'); requestAnimationFrame(setupRelicPuzzle); }
  else showScene(devScene === 'restored' ? 'restored' : 'start');
} else showScene('start');
startQuestMusic();
