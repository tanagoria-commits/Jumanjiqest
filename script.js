const cards = [...document.querySelectorAll('.game-card')];
const profileButton = document.querySelector('#profile-button');
const profileMenu = document.querySelector('#profile-menu');
const resetModal = document.querySelector('#reset-modal');
const devToggle = document.querySelector('#developer-toggle');
const devPanel = document.querySelector('#dev-panel');
const nameModal = document.querySelector('#name-modal');
const nameForm = document.querySelector('#player-name-form');
const nameInput = document.querySelector('#player-name-input');
const nameError = document.querySelector('#name-error');
const finalExitButton = document.querySelector('#final-exit-button');
const finalVideoModal = document.querySelector('#final-video-modal');
const finalVideo = document.querySelector('#final-video');

document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  document.querySelectorAll('.nav-link').forEach(item => item.classList.remove('active'));
  if (link.classList.contains('nav-link')) link.classList.add('active');
}));

function getCompletedQuests() {
  let achievements = [];
  try { achievements = JSON.parse(localStorage.getItem('expeditionAchievements') || '[]'); } catch (_) {}
  return {
    temple: localStorage.getItem('lostTempleCompleted') === 'true' || achievements.includes('temple'),
    code: localStorage.getItem('jungleCodeCompleted') === 'true' || achievements.includes('code'),
    trail: localStorage.getItem('hiddenTrailCompleted') === 'true' || achievements.includes('trail')
  };
}

function renderProgress() {
  const completed = getCompletedQuests();
  const values = [completed.temple, completed.code, completed.trail];
  const count = values.filter(Boolean).length;
  document.querySelectorAll('#progress-stars span').forEach((star, index) => { star.textContent = values[index] ? '★' : '☆'; star.classList.toggle('complete', values[index]); });
  document.querySelector('#header-progress-label').textContent = `${count} / 3 trials`;
  const ranks = ['Jungle Newcomer', 'Temple Pathfinder', 'Jungle Trailblazer', 'Legend of the Vault'];
  document.querySelector('#profile-rank').textContent = ranks[count];
  document.querySelectorAll('.achievement').forEach(card => {
    const complete = completed[card.dataset.achievement]; card.classList.toggle('unlocked', complete);
    card.querySelector('.achievement-state').textContent = complete ? 'UNLOCKED' : 'LOCKED';
  });
  const countEl = document.querySelector('#completed-count'), bar = document.querySelector('#progress-bar'), rank = document.querySelector('#rank');
  if (countEl) countEl.textContent = count; if (bar) bar.style.width = `${count / 3 * 100}%`; if (rank) rank.textContent = ranks[count];
  finalExitButton.hidden = count !== 3;
}

function renderPlayerName() {
  const playerName = localStorage.getItem('expeditionPlayerName') || 'Explorer';
  document.querySelector('#profile-button strong').textContent = playerName;
  document.querySelector('.profile-avatar').textContent = Array.from(playerName)[0]?.toUpperCase() || 'E';
}

function showToast(message) {
  const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400);
}

function setDeveloperMode(enabled) {
  localStorage.setItem('developerMode', String(enabled));
  document.body.classList.toggle('developer-mode', enabled); devToggle.checked = enabled; devPanel.classList.toggle('open', enabled);
}

profileButton.addEventListener('click', () => {
  const open = profileMenu.classList.toggle('open'); profileButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('click', event => { if (!event.target.closest('.profile-wrap')) { profileMenu.classList.remove('open'); profileButton.setAttribute('aria-expanded', 'false'); } });
document.querySelector('[data-profile-action="progress"]').addEventListener('click', () => { document.querySelector('#games').scrollIntoView({ behavior: 'smooth' }); profileMenu.classList.remove('open'); });
document.querySelector('[data-profile-action="name"]').addEventListener('click', () => {
  nameInput.value = localStorage.getItem('expeditionPlayerName') || 'Explorer';
  nameError.textContent = '';
  nameModal.classList.add('open'); profileMenu.classList.remove('open');
  setTimeout(() => { nameInput.focus(); nameInput.select(); }, 0);
});
document.querySelector('[data-profile-action="reset"]').addEventListener('click', () => { resetModal.classList.add('open'); profileMenu.classList.remove('open'); });
document.querySelectorAll('[data-reset]').forEach(button => button.addEventListener('click', () => {
  if (button.dataset.reset === 'confirm') {
    ['lostTempleCompleted','lostTempleRelicCollected','expeditionAchievements','jungleCodeCompleted','hiddenTrailCompleted'].forEach(key => localStorage.removeItem(key));
    renderProgress(); showToast('Expedition progress has been reset.');
  }
  resetModal.classList.remove('open');
}));
devToggle.addEventListener('change', () => setDeveloperMode(devToggle.checked));
document.querySelector('#dev-close').addEventListener('click', () => setDeveloperMode(false));

nameForm.addEventListener('submit', event => {
  event.preventDefault();
  const value = nameInput.value.trim();
  if (!value || value.length > 24 || !/^[\p{L}\p{N} '\-]+$/u.test(value)) {
    nameError.textContent = 'Use 1–24 letters, numbers, spaces, hyphens or apostrophes.';
    return;
  }
  localStorage.setItem('expeditionPlayerName', value);
  renderPlayerName(); nameModal.classList.remove('open'); profileButton.focus();
  showToast('Explorer name saved.');
});
document.querySelector('[data-name-action="cancel"]').addEventListener('click', () => { nameModal.classList.remove('open'); profileButton.focus(); });

function closeFinalVideo() {
  finalVideo.pause(); finalVideo.currentTime = 0; finalVideoModal.hidden = true;
  document.body.classList.remove('video-open'); finalExitButton.focus();
}
finalExitButton.addEventListener('click', () => {
  finalVideoModal.hidden = false; document.body.classList.add('video-open');
  finalVideo.play().catch(() => {}); document.querySelector('#final-video-close').focus();
});
document.querySelector('#final-video-close').addEventListener('click', closeFinalVideo);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nameModal.classList.contains('open')) { nameModal.classList.remove('open'); profileButton.focus(); }
  if (event.key === 'Escape' && !finalVideoModal.hidden) closeFinalVideo();
  if (event.key === 'Tab' && !finalVideoModal.hidden) {
    const focusable = [document.querySelector('#final-video-close'), finalVideo];
    const index = focusable.indexOf(document.activeElement);
    event.preventDefault(); focusable[(index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length].focus();
  }
});

renderPlayerName(); renderProgress(); setDeveloperMode(localStorage.getItem('developerMode') === 'true');
window.addEventListener('pageshow', renderProgress);
