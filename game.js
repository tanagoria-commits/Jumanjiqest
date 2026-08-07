const games = {
  temple: { title: 'Lost Temple', kicker: 'Artifact Hunt', instructions: 'Find 7 relics in 25 seconds. Each one appears in a new location.', bg: 'assets/temple.jpg' },
  code: { title: 'Jungle Code', kicker: 'Ancient Cipher', instructions: 'Rotate the stone cipher, decode three messages and recover the runes.', bg: 'assets/ruins.jpg' },
  trail: { title: 'Hidden Trail', kicker: 'Path Challenge', instructions: 'Choose the safe stone. Complete 8 steps without falling into the mist.', bg: 'assets/waterfall.jpg' }
};

const type = new URLSearchParams(location.search).get('game') || 'temple';
const data = games[type] || games.temple;
const arena = document.querySelector('#arena');
const scoreEl = document.querySelector('#score');
const action = document.querySelector('#action');
const progressEl = document.querySelector('#progress');
const music = document.querySelector('#jungle-code-music');
const audioControls = document.querySelector('#audio-controls');
const soundToggle = document.querySelector('#sound-toggle');
const volumeControl = document.querySelector('#volume');

document.querySelector('#title').textContent = data.title;
document.querySelector('#kicker').textContent = data.kicker;
document.querySelector('#instructions').textContent = data.instructions;
document.body.style.setProperty('--bg', `url(${data.bg})`);
document.title = `${data.title} — Expedition Vault`;

let score = 0;
let timer;

function unlock(id) {
  let list = [];
  try { list = JSON.parse(localStorage.getItem('expeditionAchievements') || '[]'); } catch (_) {}
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem('expeditionAchievements', JSON.stringify(list));
  }
}

function finish(message, achievement) {
  clearInterval(timer);
  if (achievement) unlock(achievement);
  arena.innerHTML = `<div class="message">${message}</div>`;
  action.textContent = 'Play again';
  action.disabled = false;
}

function temple() {
  score = 0;
  let time = 25;
  scoreEl.textContent = 'Relics: 0 / 7';
  function spawn() {
    arena.innerHTML = '';
    const relic = document.createElement('button');
    relic.className = 'relic';
    relic.textContent = ['✦', '◈', '☀', '⌘'][Math.floor(Math.random() * 4)];
    relic.style.left = `${8 + Math.random() * 82}%`;
    relic.style.top = `${8 + Math.random() * 72}%`;
    relic.onclick = () => {
      score += 1;
      scoreEl.textContent = `Relics: ${score} / 7`;
      score >= 7 ? finish('The temple is open!', 'temple') : spawn();
    };
    arena.append(relic);
  }
  spawn();
  timer = setInterval(() => {
    progressEl.textContent = `${--time} SECONDS LEFT`;
    if (time <= 0) finish('The gates have closed');
  }, 1000);
}

function trail() {
  score = 0;
  function step() {
    arena.innerHTML = '';
    const safe = Math.floor(Math.random() * 3);
    for (let i = 0; i < 3; i += 1) {
      const stone = document.createElement('button');
      stone.className = 'stone';
      stone.textContent = '◆';
      stone.style.setProperty('--r', `${-8 + Math.random() * 16}deg`);
      stone.onclick = () => {
        if (i !== safe) return finish('The mist consumed the trail');
        stone.classList.add('safe');
        score += 1;
        scoreEl.textContent = `Completed: ${score} / 8`;
        score >= 8 ? setTimeout(() => finish('The trail is conquered!', 'trail'), 300) : setTimeout(step, 300);
      };
      arena.append(stone);
    }
  }
  step();
}

const runeNames = ['sun', 'eye', 'spiral'];
const runeSymbols = { sun: '☀', eye: '◉', spiral: '◎' };
const promptSets = {
  easy: [
    'WHERE DID YOU GO THIS SUMMER?', 'WHAT WAS YOUR BEST SUMMER DAY?', 'WHAT DID YOU DO FOR FUN?', 'WHO DID YOU SPEND TIME WITH?',
    'DID YOU VISIT A NEW PLACE?', 'WHAT FOOD DID YOU ENJOY?', 'DID YOU SWIM THIS SUMMER?', 'WHAT GAME DID YOU PLAY?',
    'WHAT BOOK DID YOU READ?', 'DID YOU MAKE A NEW FRIEND?', 'WHAT MADE YOU LAUGH?', 'WHAT WAS YOUR FAVORITE TRIP?',
    'DID YOU LEARN A NEW SKILL?', 'WHAT DID YOU SEE OUTSIDE?', 'HOW WAS YOUR FIRST SCHOOL DAY?', 'WHAT SONG DID YOU LISTEN TO?',
    'DID YOU TAKE MANY PHOTOS?', 'WHAT WAS THE WEATHER LIKE?', 'WHAT DO YOU MISS ABOUT SUMMER?', 'WHAT WILL YOU DO NEXT SUMMER?'
  ],
  medium: [
    'WHAT WAS THE MOST MEMORABLE PART OF YOUR SUMMER?', 'DID YOU TRY SOMETHING NEW THIS SUMMER?', 'WHAT WOULD YOU CHANGE ABOUT YOUR SUMMER?', 'WHICH PLACE WOULD YOU LIKE TO VISIT AGAIN?',
    'WHAT EXPERIENCE MADE YOU FEEL PROUD?', 'HOW DID YOU SPEND TIME WITH YOUR FRIENDS?', 'WHAT WAS THE BEST MEAL YOU TRIED?', 'WHICH SUMMER DAY SURPRISED YOU MOST?',
    'WHAT NEW HABIT DID YOU DEVELOP?', 'HOW DID YOU PREPARE FOR THE SCHOOL YEAR?', 'WHAT CHALLENGE DID YOU OVERCOME?', 'WHICH MEMORY MAKES YOU SMILE NOW?',
    'WHAT DID YOU DISCOVER ABOUT YOURSELF?', 'HOW DID THE HOLIDAYS CHANGE YOUR ROUTINE?', 'WHAT ADVICE WOULD YOU GIVE A TRAVELER?', 'WHICH ACTIVITY WOULD YOU RECOMMEND?',
    'WHAT DID YOU WISH THE HOLIDAY HAD INCLUDED?', 'HOW WAS THIS SUMMER DIFFERENT FROM LAST YEAR?', 'WHAT STORY WOULD YOU TELL YOUR CLASS?', 'WHICH MOMENT DESERVES A PHOTOGRAPH?'
  ],
  hard: [
    'WHICH SUMMER EXPERIENCE CHANGED YOUR PERSPECTIVE THE MOST?', 'WHAT DO YOU WISH YOU HAD DONE DIFFERENTLY THIS SUMMER?', 'WHICH MOMENT WOULD YOU RELIVE AND WHY?', 'HOW CAN TRAVEL ALTER OUR UNDERSTANDING OF HOME?',
    'WHICH UNEXPECTED EVENT TAUGHT YOU THE GREATEST LESSON?', 'HOW DID YOUR EXPECTATIONS DIFFER FROM REALITY?', 'WHAT MAKES AN ORDINARY EXPERIENCE MEMORABLE?', 'WHICH DECISION HAD THE GREATEST IMPACT ON YOUR HOLIDAY?',
    'HOW WOULD YOU DEFINE A MEANINGFUL ADVENTURE?', 'WHAT RESPONSIBILITY DID YOU LEARN TO APPRECIATE?', 'HOW DID SOLITUDE INFLUENCE YOUR SUMMER EXPERIENCE?', 'WHICH ASSUMPTION DID YOU HAVE TO RECONSIDER?',
    'HOW CAN A DIFFICULT JOURNEY BUILD CONFIDENCE?', 'WHAT WOULD YOU PRESERVE FROM THIS SUMMER FOREVER?', 'HOW DID A CONVERSATION CHANGE YOUR POINT OF VIEW?', 'WHICH EXPERIENCE CHALLENGED YOUR COMFORT ZONE?',
    'WHAT DOES RETURNING TO SCHOOL REPRESENT TO YOU?', 'HOW CAN WE BALANCE REST WITH PERSONAL GROWTH?', 'WHAT DID THE SEASON REVEAL ABOUT YOUR PRIORITIES?', 'WHICH MEMORY WILL BECOME MORE VALUABLE OVER TIME?'
  ]
};

const shiftRanges = { easy: [1, 3], medium: [4, 7], hard: [8, 15] };
const challengeLibrary = {};
Object.entries(promptSets).forEach(([difficulty, prompts]) => {
  challengeLibrary[difficulty] = {};
  runeNames.forEach((rune, runeIndex) => {
    challengeLibrary[difficulty][rune] = prompts.map((text, index) => {
      const [min, max] = shiftRanges[difficulty];
      return { id: `${difficulty}-${rune}-${index + 1}`, text, rune, shift: min + ((index + runeIndex) % (max - min + 1)) };
    });
  });
});

const codeState = {
  difficulty: 'easy', stage: 0, selectedShift: 0, current: null,
  usedIds: new Set(), runes: [], solved: false, currentLetterIndex: 0,
  decodedLetters: [], selectedRune: null, placedRunes: [], wheelLocked: false,
  confirmedIndices: new Set()
};

function encodeCaesar(text, shift) {
  return text.replace(/[A-Z]/g, letter => String.fromCharCode(65 + ((letter.charCodeAt(0) - 65 + shift) % 26)));
}

function decodeCaesar(text, shift) {
  return encodeCaesar(text, (26 - shift) % 26);
}

let audioContext;
let lastStoneSound = 0;
function ensureAudioContext() {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function playStoneSound(kind = 'step') {
  if (type !== 'code' || music.muted || Number(volumeControl.value) === 0) return;
  const now = performance.now();
  if (kind === 'step' && now - lastStoneSound < 70) return;
  lastStoneSound = now;
  const context = ensureAudioContext();
  const duration = kind === 'lock' ? 0.24 : 0.11;
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < channel.length; i += 1) {
    const decay = Math.pow(1 - i / channel.length, kind === 'lock' ? 2 : 4);
    channel[i] = (Math.random() * 2 - 1) * decay;
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  filter.type = 'lowpass';
  filter.frequency.value = kind === 'lock' ? 210 : 320 + codeState.stage * 35;
  gain.gain.value = (Number(volumeControl.value) / 100) * (kind === 'lock' ? 0.28 : 0.2);
  source.buffer = buffer;
  source.connect(filter).connect(gain).connect(context.destination);
  source.start();
}

async function startCodeMusic() {
  if (type !== 'code' || music.muted) return;
  try { await music.play(); } catch (_) {}
}

function configureCodeAudio() {
  audioControls.hidden = false;
  const savedVolume = Number(localStorage.getItem('jungleCodeMusicVolume') ?? 35);
  const muted = localStorage.getItem('jungleCodeMusicMuted') === 'true';
  volumeControl.value = String(savedVolume);
  music.volume = Math.min(1, savedVolume / 100);
  music.muted = muted;
  soundToggle.textContent = muted ? 'Sound off' : 'Sound on';
  soundToggle.onclick = () => {
    music.muted = !music.muted;
    localStorage.setItem('jungleCodeMusicMuted', String(music.muted));
    soundToggle.textContent = music.muted ? 'Sound off' : 'Sound on';
    if (!music.muted) { ensureAudioContext(); startCodeMusic(); }
  };
  volumeControl.oninput = () => {
    music.volume = Number(volumeControl.value) / 100;
    localStorage.setItem('jungleCodeMusicVolume', volumeControl.value);
    if (music.volume > 0 && !music.muted) startCodeMusic();
  };
  document.addEventListener('pointerdown', startCodeMusic, { once: true });
  document.addEventListener('keydown', startCodeMusic, { once: true });
}

function getNextChallenge() {
  const rune = runeNames[codeState.stage];
  const pool = challengeLibrary[codeState.difficulty][rune];
  let available = pool.filter(item => item.id !== codeState.current?.id && !codeState.usedIds.has(item.id));
  if (!available.length) {
    pool.forEach(item => codeState.usedIds.delete(item.id));
    available = pool.filter(item => item.id !== codeState.current?.id);
  }
  const next = available[Math.floor(Math.random() * available.length)];
  codeState.usedIds.add(next.id);
  return next;
}

function renderDifficulty() {
  arena.innerHTML = `<div class="code-intro"><span class="code-seal">◎</span><h2>Choose your path</h2><p>The deeper paths hide stronger ciphers.</p><div class="difficulty-choices"><button data-level="easy"><b>Easy</b><small>A2–B1 · shifts 1–3</small></button><button data-level="medium"><b>Medium</b><small>B1–B2 · shifts 4–7</small></button><button data-level="hard"><b>Hard</b><small>B2–C1 · shifts 8–15</small></button></div></div>`;
  arena.querySelectorAll('[data-level]').forEach(button => button.onclick = () => {
    codeState.difficulty = button.dataset.level;
    codeState.stage = 0;
    codeState.runes = [];
    codeState.usedIds.clear();
    loadChallenge();
  });
}

function loadChallenge(replacement = false) {
  codeState.current = getNextChallenge();
  codeState.selectedShift = 0;
  codeState.solved = false;
  codeState.decodedLetters = Array.from(codeState.current.text, character => /[A-Z]/.test(character) ? '' : character);
  codeState.currentLetterIndex = codeState.decodedLetters.findIndex(character => character === '');
  renderCipher(replacement ? 'A new message has awakened.' : 'Decode the inscription one letter at a time.');
}

function renderCipher(feedback = '') {
  const challenge = codeState.current;
  const encoded = encodeCaesar(challenge.text, challenge.shift);
  const runes = runeNames.map((rune, index) => `<span class="rune-mark ${index < codeState.stage ? 'found' : ''}" title="${rune}">${index < codeState.stage ? runeSymbols[rune] : '◇'}</span>`).join('');
  const cells = Array.from(challenge.text, (character, index) => {
    if (!/[A-Z]/.test(character)) return character === ' ' ? '<span class="letter-space"></span>' : `<span class="letter-punctuation">${character}</span>`;
    const value = codeState.decodedLetters[index];
    const className = index === codeState.currentLetterIndex ? 'letter-cell current' : value ? 'letter-cell solved' : 'letter-cell';
    return `<button class="${className}" data-letter-index="${index}" ${value ? 'disabled' : ''}>${value || '·'}</button>`;
  }).join('');
  const encodedLetter = encoded[codeState.currentLetterIndex] || '';
  const candidateLetter = encodedLetter ? decodeCaesar(encodedLetter, codeState.selectedShift) : '';
  arena.innerHTML = `<div class="cipher-quest">
    <div class="cipher-status"><span>ANCIENT MESSAGE ${codeState.stage + 1} / 3</span><span>${runes}</span></div>
    <div class="encoded-message">${encoded}</div>
    <div class="letter-board" aria-label="Decoded question">${cells}</div>
    <div class="cipher-machine" tabindex="0" aria-label="Caesar cipher wheel. Use left and right arrow keys.">
      <div class="stone-ring outer-ring"><span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span></div>
      <div class="stone-ring inner-ring" style="--turn:${codeState.selectedShift * 13.846}deg"><span>${encodeCaesar('ABCDEFGHIJKLMNOPQRSTUVWXYZ', codeState.selectedShift)}</span></div>
      <div class="shift-number"><b>${candidateLetter}</b><small>LETTER</small></div>
    </div>
    <div class="ring-controls"><button class="turn-left" aria-label="Rotate left">−</button><span>ROTATE THE INNER RING</span><button class="turn-right" aria-label="Rotate right">+</button></div>
    <p class="cipher-hint">${codeState.difficulty === 'easy' ? `Hint: move each letter ${challenge.shift} places back.` : codeState.difficulty === 'medium' ? `The shift is between ${shiftRanges.medium[0]} and ${shiftRanges.medium[1]}.` : 'No shift is revealed on the deepest path.'}</p>
    <p class="code-feedback" aria-live="polite">${feedback}</p>
  </div>`;
  arena.querySelector('.turn-left').onclick = () => rotateCipher(-1);
  arena.querySelector('.turn-right').onclick = () => rotateCipher(1);
  const machine = arena.querySelector('.cipher-machine');
  machine.onkeydown = event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      rotateCipher(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (/^[a-z]$/i.test(event.key)) {
      chooseTypedLetter(event.key.toUpperCase());
    } else if (event.key === 'Enter') {
      checkLetter();
    }
  };
  let dragging = false;
  let lastX = 0;
  machine.onpointerdown = event => { dragging = true; lastX = event.clientX; machine.setPointerCapture(event.pointerId); };
  machine.onpointermove = event => {
    if (!dragging || Math.abs(event.clientX - lastX) < 18) return;
    rotateCipher(event.clientX > lastX ? 1 : -1);
    lastX = event.clientX;
  };
  machine.onpointerup = () => { dragging = false; playStoneSound('lock'); };
  arena.querySelectorAll('[data-letter-index]').forEach(cell => cell.onclick = () => {
    codeState.currentLetterIndex = Number(cell.dataset.letterIndex);
    renderCipher('This letter is now bound to the cipher wheel.');
    arena.querySelector('.cipher-machine')?.focus();
  });
  scoreEl.textContent = `Runes: ${codeState.stage} / 3`;
  action.hidden = false;
  action.textContent = 'Confirm letter';
  action.onclick = checkLetter;
  action.disabled = false;
}

function rotateCipher(direction) {
  codeState.selectedShift = (codeState.selectedShift + direction + 26) % 26;
  playStoneSound('step');
  const challenge = codeState.current;
  const encoded = encodeCaesar(challenge.text, challenge.shift);
  const innerRing = arena.querySelector('.inner-ring');
  const shiftNumber = arena.querySelector('.shift-number');
  const feedback = arena.querySelector('.code-feedback');
  const candidate = codeState.currentLetterIndex >= 0 ? decodeCaesar(encoded[codeState.currentLetterIndex], codeState.selectedShift) : '';
  if (innerRing) {
    innerRing.style.setProperty('--turn', `${codeState.selectedShift * 13.846}deg`);
    innerRing.querySelector('span').textContent = encodeCaesar('ABCDEFGHIJKLMNOPQRSTUVWXYZ', codeState.selectedShift);
  }
  if (shiftNumber) shiftNumber.querySelector('b').textContent = candidate;
  if (feedback) feedback.textContent = 'The stone ring moves beneath your hand.';
}

function chooseTypedLetter(letter) {
  const encoded = encodeCaesar(codeState.current.text, codeState.current.shift);
  const encryptedLetter = encoded[codeState.currentLetterIndex];
  if (!encryptedLetter) return;
  codeState.selectedShift = (encryptedLetter.charCodeAt(0) - letter.charCodeAt(0) + 26) % 26;
  playStoneSound('step');
  renderCipher('The letter has been selected. Confirm it to carve the stone.');
  arena.querySelector('.cipher-machine')?.focus();
}

function checkLetter() {
  const targetIndex = codeState.currentLetterIndex;
  const encoded = encodeCaesar(codeState.current.text, codeState.current.shift);
  const candidate = decodeCaesar(encoded[targetIndex], codeState.selectedShift);
  if (candidate !== codeState.current.text[targetIndex]) {
    arena.querySelector('.cipher-quest')?.classList.add('cipher-reject');
    const feedback = arena.querySelector('.code-feedback');
    const cell = arena.querySelector(`[data-letter-index="${targetIndex}"]`);
    cell?.classList.add('wrong');
    if (feedback) feedback.textContent = 'The rune rejects this letter. Try again.';
    playStoneSound('lock');
    return;
  }
  codeState.decodedLetters[targetIndex] = codeState.current.text[targetIndex];
  playStoneSound('lock');
  codeState.currentLetterIndex = codeState.decodedLetters.findIndex(character => character === '');
  if (codeState.currentLetterIndex === -1) {
    codeState.solved = true;
    renderDecodedMessage();
  } else {
    renderCipher('Letter secured. Continue decoding the inscription.');
  }
}

/* Fixed-wheel cipher: the final declarations below intentionally replace the
   earlier letter-by-letter wheel handlers while keeping the other games intact. */
function fixedRingLetters(alphabet, className) {
  return Array.from(alphabet, (letter, index) => `<span class="ring-letter ${className}" style="--angle:${index * (360 / 26)}deg"><i>${letter}</i></span>`).join('');
}

function loadChallenge(replacement = false) {
  codeState.current = getNextChallenge();
  codeState.selectedShift = 0;
  codeState.solved = false;
  codeState.wheelLocked = false;
  codeState.confirmedIndices.clear();
  codeState.decodedLetters = Array.from(codeState.current.text, character => /[A-Z]/.test(character) ? '' : character);
  codeState.currentLetterIndex = codeState.decodedLetters.findIndex(character => character === '');
  renderCipher(replacement ? 'A new message has awakened.' : 'Align the first encrypted letter with its decoded letter.');
}

function renderCipher(feedback = '') {
  const challenge = codeState.current;
  const encoded = encodeCaesar(challenge.text, challenge.shift);
  const firstIndex = challenge.text.search(/[A-Z]/);
  const firstEncrypted = encoded[firstIndex];
  const runes = [1, 2, 3].map((number, index) => index < codeState.stage ? `<img src="rune${number}.png" alt="Rune ${number}">` : '<span>◇</span>').join('');
  const cells = Array.from(challenge.text, (character, index) => {
    if (character === ' ') return '<span class="letter-space"></span>';
    if (!/[A-Z]/.test(character)) return `<span class="letter-punctuation">${character}</span>`;
    const confirmed = codeState.confirmedIndices.has(index);
    const classes = `letter-cell${index === codeState.currentLetterIndex ? ' current' : ''}${confirmed ? ' solved' : ''}`;
    return `<button class="${classes}" data-letter-index="${index}" ${confirmed ? 'disabled' : ''}>${codeState.decodedLetters[index] || '·'}</button>`;
  }).join('');
  const keyboard = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ', letter => `<button type="button" data-key="${letter}">${letter}</button>`).join('');
  const currentDecoded = decodeCaesar(firstEncrypted, codeState.selectedShift);
  const hint = codeState.difficulty === 'easy'
    ? `First letter: ${challenge.text[firstIndex]}. Shift: ${challenge.shift}.`
    : codeState.difficulty === 'medium'
      ? `First decoded letter: ${challenge.text[firstIndex]}. Find the shift.`
      : `Ancient clue: the message begins with ${challenge.text[firstIndex]}.`;

  arena.innerHTML = `<div class="cipher-quest fixed-wheel-quest">
    <div class="cipher-status"><span>ANCIENT MESSAGE ${codeState.stage + 1} / 3</span><span class="image-rune-progress">${runes}</span></div>
    <div class="cipher-tablet"><small>${codeState.wheelLocked ? 'WHEEL LOCKED' : 'ALIGN THE FIRST LETTER'}</small><div class="encoded-message">${encoded}</div></div>
    <div class="letter-board" aria-label="Decoded question">${cells}</div>
    <div class="cipher-machine ${codeState.wheelLocked ? 'locked' : ''}" tabindex="0" aria-label="Caesar cipher wheel. ${codeState.wheelLocked ? 'The wheel is locked.' : 'Use left and right arrows to align the first letter.'}">
      <div class="stone-ring outer-ring">${fixedRingLetters('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'outer-letter')}</div>
      <div class="stone-ring inner-ring" style="--turn:${codeState.selectedShift * 13.846}deg">${fixedRingLetters('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'inner-letter')}</div>
      <div class="cipher-pointer"><span>${firstEncrypted}</span><b>↕</b><span>${currentDecoded}</span></div>
      <div class="shift-number"><b>${codeState.wheelLocked ? '◆' : currentDecoded}</b><small>${codeState.wheelLocked ? 'LOCKED' : 'FIRST LETTER'}</small></div>
    </div>
    <div class="ring-controls ${codeState.wheelLocked ? 'disabled' : ''}"><button class="turn-left" type="button" ${codeState.wheelLocked ? 'disabled' : ''} aria-label="Rotate left">−</button><span>${codeState.wheelLocked ? 'THE ALIGNMENT IS FIXED' : 'ROTATE THE INNER RING'}</span><button class="turn-right" type="button" ${codeState.wheelLocked ? 'disabled' : ''} aria-label="Rotate right">+</button></div>
    ${codeState.wheelLocked ? `<div class="letter-keyboard" aria-label="Letter keyboard">${keyboard}</div>` : ''}
    <p class="cipher-hint">${hint}</p><p class="code-feedback" aria-live="polite">${feedback}</p>
  </div>`;

  const machine = arena.querySelector('.cipher-machine');
  arena.querySelector('.turn-left').onclick = () => rotateCipher(-1);
  arena.querySelector('.turn-right').onclick = () => rotateCipher(1);
  machine.onkeydown = event => {
    if (!codeState.wheelLocked && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault(); rotateCipher(event.key === 'ArrowLeft' ? -1 : 1);
    } else if (codeState.wheelLocked && /^[a-z]$/i.test(event.key)) {
      event.preventDefault(); enterDecodedLetter(event.key.toUpperCase());
    } else if (event.key === 'Enter') {
      event.preventDefault(); codeState.wheelLocked ? checkMessage() : lockAlignment();
    }
  };
  let dragging = false;
  let lastX = 0;
  machine.onpointerdown = event => {
    if (codeState.wheelLocked) return;
    dragging = true; lastX = event.clientX; machine.setPointerCapture(event.pointerId);
  };
  machine.onpointermove = event => {
    if (codeState.wheelLocked || !dragging || Math.abs(event.clientX - lastX) < 18) return;
    rotateCipher(event.clientX > lastX ? 1 : -1); lastX = event.clientX;
  };
  machine.onpointerup = () => { if (dragging) playStoneSound('lock'); dragging = false; };
  arena.querySelectorAll('[data-key]').forEach(key => key.onclick = () => enterDecodedLetter(key.dataset.key));
  arena.querySelectorAll('[data-letter-index]').forEach(cell => cell.onclick = () => {
    const index = Number(cell.dataset.letterIndex);
    if (!codeState.wheelLocked || codeState.confirmedIndices.has(index)) return;
    codeState.currentLetterIndex = index;
    renderCipher('Find the encrypted letter on the outer ring and read the letter opposite it.');
    arena.querySelector('.cipher-machine')?.focus();
  });
  scoreEl.textContent = `Runes: ${codeState.stage} / 3`;
  action.hidden = false;
  action.textContent = codeState.wheelLocked ? 'Check message' : 'Lock alignment';
  action.onclick = codeState.wheelLocked ? checkMessage : lockAlignment;
  action.disabled = codeState.wheelLocked && codeState.decodedLetters.some(character => character === '');
}

function rotateCipher(direction) {
  if (codeState.wheelLocked) return;
  codeState.selectedShift = (codeState.selectedShift + direction + 26) % 26;
  playStoneSound('step');
  const encoded = encodeCaesar(codeState.current.text, codeState.current.shift);
  const firstIndex = codeState.current.text.search(/[A-Z]/);
  const candidate = decodeCaesar(encoded[firstIndex], codeState.selectedShift);
  arena.querySelector('.inner-ring')?.style.setProperty('--turn', `${codeState.selectedShift * 13.846}deg`);
  const pointerLetters = arena.querySelectorAll('.cipher-pointer span');
  if (pointerLetters[1]) pointerLetters[1].textContent = candidate;
  const display = arena.querySelector('.shift-number b');
  if (display) display.textContent = candidate;
  const feedback = arena.querySelector('.code-feedback');
  if (feedback) feedback.textContent = 'The inner stone ring moves one letter.';
}

function lockAlignment() {
  if (codeState.selectedShift !== codeState.current.shift) {
    arena.querySelector('.fixed-wheel-quest')?.classList.add('cipher-reject');
    arena.querySelector('.code-feedback').textContent = 'The first letter does not align. Turn the wheel again.';
    playStoneSound('lock');
    return;
  }
  const firstIndex = codeState.current.text.search(/[A-Z]/);
  codeState.decodedLetters[firstIndex] = codeState.current.text[firstIndex];
  codeState.confirmedIndices.add(firstIndex);
  codeState.wheelLocked = true;
  codeState.currentLetterIndex = codeState.decodedLetters.findIndex(character => character === '');
  playStoneSound('lock');
  renderCipher('The cipher is aligned. Follow the rings.');
  arena.querySelector('.cipher-machine')?.focus();
}

function enterDecodedLetter(letter) {
  if (!codeState.wheelLocked || codeState.currentLetterIndex < 0) return;
  codeState.decodedLetters[codeState.currentLetterIndex] = letter;
  codeState.currentLetterIndex = codeState.decodedLetters.findIndex((character, index) => character === '' && !codeState.confirmedIndices.has(index));
  renderCipher('Read the next matching pair from the fixed rings.');
  arena.querySelector('.cipher-machine')?.focus();
}

function checkMessage() {
  if (codeState.decodedLetters.some(character => character === '')) return;
  let hasErrors = false;
  Array.from(codeState.current.text).forEach((character, index) => {
    if (!/[A-Z]/.test(character)) return;
    if (codeState.decodedLetters[index] === character) codeState.confirmedIndices.add(index);
    else { codeState.decodedLetters[index] = ''; hasErrors = true; }
  });
  if (hasErrors) {
    codeState.currentLetterIndex = codeState.decodedLetters.findIndex(character => character === '');
    playStoneSound('lock');
    renderCipher('Some letters do not follow the rings. Try again.');
    return;
  }
  codeState.solved = true;
  playStoneSound('lock');
  renderDecodedMessage();
}

function checkLetter() {
  if (codeState.wheelLocked) checkMessage(); else lockAlignment();
}

function renderDecodedMessage() {
  const runeNumber = codeState.stage + 1;
  arena.innerHTML = `<div class="decoded-scene"><span class="kicker">MESSAGE DECODED</span><h2>${codeState.current.text}</h2><p>Answer the question aloud, then claim the rune.</p><img src="rune${runeNumber}.png" alt="Rune ${runeNumber}"></div>`;
  scoreEl.textContent = `Runes: ${codeState.stage} / 3`;
  action.hidden = false;
  action.disabled = false;
  action.textContent = `Claim rune ${runeNumber}`;
  action.onclick = claimRune;
}

function claimRune() {
  codeState.runes.push(runeNames[codeState.stage]);
  codeState.stage += 1;
  if (codeState.stage >= 3) {
    arena.innerHTML = `<div class="all-runes"><div class="collected-rune-images"><img src="rune1.png" alt="Rune 1"><img src="rune2.png" alt="Rune 2"><img src="rune3.png" alt="Rune 3"></div><h2>All runes recovered</h2><p>The ancient hall has opened.</p></div>`;
    scoreEl.textContent = 'Runes: 3 / 3';
    action.hidden = false;
    action.textContent = 'Enter the ruined hall';
    action.onclick = renderRuneHall;
    return;
  }
  loadChallenge();
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function renderRuneHall(message = 'Place the runes in the order in which they were recovered.') {
  document.body.classList.add('rune-hall-page');
  const remaining = shuffle([1, 2, 3].filter(number => !codeState.placedRunes.includes(number)));
  const slots = [1, 2, 3].map(number => `<button class="rune-slot ${codeState.placedRunes.includes(number) ? 'filled' : ''}" data-slot="${number}" aria-label="Rune slot ${number}">${codeState.placedRunes.includes(number) ? `<img src="rune${number}.png" alt="Rune ${number}">` : `<span>SLOT ${number}</span>`}</button>`).join('');
  const runes = remaining.map(number => `<button class="hall-rune" draggable="true" data-rune="${number}" aria-label="Rune ${number}"><img src="rune${number}.png" alt="Rune ${number}"></button>`).join('');
  arena.innerHTML = `<div class="rune-hall"><p class="kicker">THE RUINED HALL</p><h2>The Stone Guardian</h2><div class="stone-idol"><div class="idol-face">◉</div><div class="rune-slots">${slots}</div></div><div class="rune-tray">${runes}</div><p class="hall-feedback" aria-live="polite">${message}</p></div>`;
  action.hidden = true;
  scoreEl.textContent = `Runes placed: ${codeState.placedRunes.length} / 3`;
  arena.querySelectorAll('.hall-rune').forEach(rune => {
    rune.onclick = () => {
      codeState.selectedRune = Number(rune.dataset.rune);
      arena.querySelectorAll('.hall-rune').forEach(item => item.classList.toggle('selected', item === rune));
    };
    rune.ondragstart = event => event.dataTransfer.setData('text/plain', rune.dataset.rune);
  });
  arena.querySelectorAll('.rune-slot:not(.filled)').forEach(slot => {
    slot.ondragover = event => event.preventDefault();
    slot.ondrop = event => {
      event.preventDefault();
      placeRune(Number(event.dataTransfer.getData('text/plain')), Number(slot.dataset.slot));
    };
    slot.onclick = () => {
      if (codeState.selectedRune) placeRune(codeState.selectedRune, Number(slot.dataset.slot));
    };
  });
}

function placeRune(runeNumber, slotNumber) {
  if (runeNumber !== slotNumber) {
    playStoneSound('lock');
    renderRuneHall('The stone rejects this rune.');
    const slot = arena.querySelector(`[data-slot="${slotNumber}"]`);
    slot?.classList.add('wrong');
    return;
  }
  if (!codeState.placedRunes.includes(runeNumber)) codeState.placedRunes.push(runeNumber);
  codeState.selectedRune = null;
  playStoneSound('lock');
  if (codeState.placedRunes.length === 3) {
    completeJungleCode();
  } else {
    renderRuneHall('The rune settles into the ancient stone.');
  }
}

function completeJungleCode() {
  unlock('code');
  localStorage.setItem('jungleCodeCompleted', 'true');
  localStorage.setItem('jungleCodeRunesActivated', 'true');
  renderRuneHall('The ancient path has awakened.');
  arena.querySelector('.stone-idol')?.classList.add('activated');
  const hall = arena.querySelector('.rune-hall');
  hall.insertAdjacentHTML('beforeend', '<a class="return-jungle" href="index.html">RETURN TO THE JUNGLE</a>');
}

function code() {
  configureCodeAudio();
  startCodeMusic();
  document.body.classList.add('jungle-code-page');
  action.hidden = true;
  scoreEl.textContent = 'Runes: 0 / 3';
  renderDifficulty();
}

if (type === 'code') {
  action.onclick = checkLetter;
  code();
} else {
  action.onclick = () => {
    clearInterval(timer);
    action.disabled = true;
    action.textContent = 'Exploring…';
    progressEl.textContent = 'EXPEDITION';
    ({ temple, trail }[type] || temple)();
  };
}

document.querySelector('#back-link').addEventListener('click', () => {
  music.pause();
  music.currentTime = 0;
});
window.addEventListener('pagehide', () => music.pause());
