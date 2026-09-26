(() => {
  const views = [...document.querySelectorAll('.view')];
  const backButton = document.getElementById('backButton');
  const fullscreenButton = document.getElementById('fullscreenButton');
  const instructionOverlay = document.getElementById('instructionOverlay');
  const instructionTitle = document.getElementById('instructionTitle');
  const instructionLead = document.getElementById('instructionLead');
  const instructionSteps = document.getElementById('instructionSteps');
  const instructionStart = document.getElementById('instructionStart');
  const instructionClose = document.getElementById('instructionClose');
  const gameGrid = document.getElementById('gameGrid');
  const partEyebrow = document.getElementById('partEyebrow');
  const partTitle = document.getElementById('partTitle');
  const bonusRevealButton = document.getElementById('bonusRevealButton');
  const bonusBurst = document.getElementById('bonusBurst');
  const bouquetRevealButton = document.getElementById('bouquetRevealButton');
  let currentView = 'homeView';
  let selectedPart = null;
  let pendingView = null;

  const instructions = {
    passwordView: {
      title: '終極密碼',
      lead: '神秘小禮物',
      steps: [
        '後面燈控的小夥伴會接收來自新郎的訊息，請新郎先給小夥伴要輸入的終極密碼。',
        '接下來請目前台上的幾位貴賓排一排，依據目前的順序依序回答唷！',
        '接下來的數字是 0～99 的神秘數字，猜中的貴賓將獲得神秘禮物。'
      ]
    },
    wheelView: {
      title: '捧花花落誰家',
      lead: '一位幸運得主，接住下一份幸福',
      steps: [
        '請各位賓客緊握您的緞帶，倒數三、二、一，究竟是誰抽中捧花呢？'
      ]
    },
    kahootView: {
      title: '新人小故事',
      lead: '用 Kahoot 猜猜新郎與新娘的小故事',
      steps: [
        '請大家準備好自己的手機！接下來除了是跟新郎新娘的熟悉程度，更重要的是手速唷XD'
      ]
    },
    qaView: {
      title: 'QA 加碼時間！',
      lead: '新人小故事之後的婚禮限定加碼挑戰',
      steps: [
        '剛剛的kahoot是否意猶未盡呢？現在新郎加碼時間，請大家注意簡報中的題目唷！'
      ]
    }
  };

  function showView(id) {
    currentView = id;
    views.forEach(view => view.classList.toggle('is-active', view.id === id));
    backButton.classList.toggle('is-hidden', id === 'homeView');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 'wheelView') requestAnimationFrame(drawWheel);
  }

  document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => openInstruction(button.dataset.view));
  });

  document.querySelectorAll('[data-part]').forEach(button => {
    button.addEventListener('click', () => showPart(button.dataset.part));
  });

  function showPart(part) {
    selectedPart = part;
    const isPartOne = part === 'part1';
    partEyebrow.textContent = isPartOne ? 'PART 1' : 'PART 2';
    partTitle.textContent = isPartOne ? '幸運揭曉' : '新人挑戰';
    gameGrid.classList.remove('show-part1', 'show-part2', 'has-bonus');
    gameGrid.classList.add(isPartOne ? 'show-part1' : 'show-part2');
    bonusRevealButton.classList.remove('is-exploding', 'is-done');
    bonusRevealButton.setAttribute('aria-expanded', 'false');
    bonusRevealButton.setAttribute('aria-hidden', String(isPartOne));
    showView('partView');
  }

  bonusRevealButton.addEventListener('click', () => {
    if (bonusRevealButton.classList.contains('is-exploding') || gameGrid.classList.contains('has-bonus')) return;
    const colors = ['#d8b66c', '#f5eee0', '#d6aaa7', '#8da79a', '#8ca6ba'];
    bonusBurst.innerHTML = '';
    for (let index = 0; index < 18; index += 1) {
      const spark = document.createElement('i');
      spark.className = 'bonus-spark';
      spark.style.setProperty('--angle', `${index * 20}deg`);
      spark.style.setProperty('--delay', `${(index % 3) * 25}ms`);
      spark.style.setProperty('--spark-color', colors[index % colors.length]);
      bonusBurst.appendChild(spark);
    }
    bonusRevealButton.classList.add('is-exploding');
    window.setTimeout(() => {
      gameGrid.classList.add('has-bonus');
      bonusRevealButton.classList.add('is-done');
      bonusRevealButton.setAttribute('aria-expanded', 'true');
    }, 360);
    window.setTimeout(() => { bonusBurst.innerHTML = ''; }, 1100);
  });

  function openInstruction(viewId) {
    const detail = instructions[viewId];
    pendingView = viewId;
    instructionTitle.textContent = detail.title;
    instructionLead.textContent = detail.lead;
    instructionSteps.innerHTML = detail.steps.map(step => `<li>${step}</li>`).join('');
    instructionOverlay.classList.add('is-open');
    instructionStart.focus();
  }

  function closeInstruction() {
    instructionOverlay.classList.remove('is-open');
    pendingView = null;
  }

  instructionClose.addEventListener('click', closeInstruction);
  instructionStart.addEventListener('click', () => {
    if (!pendingView) return;
    const destination = pendingView;
    instructionOverlay.classList.remove('is-open');
    pendingView = null;
    showView(destination === 'wheelView' ? 'bouquetTeaseView' : destination);
  });
  bouquetRevealButton.addEventListener('click', () => showView('wheelView'));
  instructionOverlay.addEventListener('click', event => {
    if (event.target === instructionOverlay) closeInstruction();
  });
  backButton.addEventListener('click', () => {
    if (currentView === 'partView') {
      selectedPart = null;
      showView('homeView');
      return;
    }
    if (selectedPart) showPart(selectedPart);
    else showView('homeView');
  });

  fullscreenButton.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch (_) {
      fullscreenButton.textContent = '⛶';
    }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreenButton.textContent = document.fullscreenElement ? '×' : '⛶';
    fullscreenButton.setAttribute('aria-label', document.fullscreenElement ? '離開全螢幕' : '切換全螢幕');
  });

  const secretInput = document.getElementById('secretInput');
  const lockSecretButton = document.getElementById('lockSecretButton');
  const secretSetup = document.getElementById('secretSetup');
  const guessControls = document.getElementById('guessControls');
  const guessInput = document.getElementById('guessInput');
  const confirmGuessButton = document.getElementById('confirmGuessButton');
  const resetPasswordButton = document.getElementById('resetPasswordButton');
  const passwordStatus = document.getElementById('passwordStatus');
  const guessHistory = document.getElementById('guessHistory');
  const rangeMin = document.getElementById('rangeMin');
  const rangeMax = document.getElementById('rangeMax');

  let secret = null;
  let lowerBoundary = -1;
  let upperBoundary = 100;
  let guesses = [];

  function numberFromInput(input) {
    const raw = input.value.trim();
    if (!/^\d{1,2}$/.test(raw)) return null;
    const value = Number(raw);
    return value >= 0 && value <= 99 ? value : null;
  }

  function renderPassword() {
    rangeMin.textContent = Math.max(0, lowerBoundary);
    rangeMax.textContent = Math.min(99, upperBoundary);
    guessHistory.innerHTML = guesses.map(item => (
      `<span class="history-chip"><strong>${item.value}</strong> ${item.hint}</span>`
    )).join('');
  }

  lockSecretButton.addEventListener('click', () => {
    const value = numberFromInput(secretInput);
    if (value === null) {
      passwordStatus.textContent = '請輸入 0～99 之間的整數';
      secretInput.focus();
      return;
    }
    secret = value;
    secretInput.value = '';
    secretSetup.classList.add('is-hidden');
    guessControls.classList.remove('is-hidden');
    passwordStatus.textContent = '答案已鎖定，請開始猜數字';
    guessInput.focus();
  });

  confirmGuessButton.addEventListener('click', () => {
    if (secret === null) return;
    const value = numberFromInput(guessInput);
    if (value === null) {
      passwordStatus.textContent = '請輸入 0～99 之間的整數';
      guessInput.focus();
      return;
    }
    if (guesses.some(item => item.value === value)) {
      passwordStatus.textContent = `${value} 已經猜過了，請換一個數字`;
      guessInput.select();
      return;
    }
    if (value <= lowerBoundary || value >= upperBoundary) {
      passwordStatus.textContent = `請輸入 ${Math.max(0, lowerBoundary)} 與 ${Math.min(99, upperBoundary)} 之間、尚未猜過的數字`;
      guessInput.select();
      return;
    }

    if (value === secret) {
      guesses.push({ value, hint: '猜中了！' });
      renderPassword();
      passwordStatus.textContent = '恭喜中獎！';
      guessInput.value = '';
      guessInput.disabled = true;
      confirmGuessButton.disabled = true;
      openWinner('passwordWinner');
      return;
    }

    if (value < secret) {
      lowerBoundary = value;
      guesses.push({ value, hint: '再大一點' });
      passwordStatus.textContent = '再大一點';
    } else {
      upperBoundary = value;
      guesses.push({ value, hint: '再小一點' });
      passwordStatus.textContent = '再小一點';
    }
    guessInput.value = '';
    renderPassword();
    guessInput.focus();
  });

  function resetPassword() {
    secret = null;
    lowerBoundary = -1;
    upperBoundary = 100;
    guesses = [];
    secretInput.value = '';
    guessInput.value = '';
    guessInput.disabled = false;
    confirmGuessButton.disabled = false;
    secretSetup.classList.remove('is-hidden');
    guessControls.classList.add('is-hidden');
    passwordStatus.textContent = '請先設定新郎指定的秘密數字';
    renderPassword();
  }
  resetPasswordButton.addEventListener('click', () => {
    if (secret !== null && !window.confirm('確定要清除答案與所有猜測紀錄嗎？')) return;
    resetPassword();
  });

  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  const wheelNumbers = document.getElementById('wheelNumbers');
  const applyNumbersButton = document.getElementById('applyNumbersButton');
  const spinWheelButton = document.getElementById('spinWheelButton');
  const resetWheelButton = document.getElementById('resetWheelButton');
  const wheelStatus = document.getElementById('wheelStatus');
  const winnerNumber = document.getElementById('winnerNumber');
  const colors = ['#6f8277', '#e5c9c0', '#8ca3b7', '#d1b078', '#9ca990', '#cda194', '#7898a3', '#ead9b7'];

  let candidates = ['1', '2', '3', '4', '5', '6'];
  let wheelAngle = -Math.PI / 2;
  let spinning = false;
  let wheelFinished = false;

  function parseNumbers(raw) {
    const tokens = raw.split(/[\s,，、]+/).map(value => value.trim()).filter(Boolean);
    const invalid = tokens.filter(value => !/^\d+$/.test(value));
    if (invalid.length) return { error: `請只輸入數字：${invalid.slice(0, 3).join('、')}` };
    const unique = [...new Set(tokens)];
    if (unique.length < 2) return { error: '至少需要輸入兩個不同號碼' };
    if (unique.length > 80) return { error: '為了讓號碼清楚可見，最多輸入 80 個號碼' };
    return { values: unique };
  }

  function drawWheel() {
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 18;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);

    if (!candidates.length) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,253,247,.92)';
      ctx.fill();
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#af8d58';
      ctx.stroke();
      ctx.fillStyle = '#6f7770';
      ctx.font = '38px Iansui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('請先輸入參加號碼', 0, -125);
      ctx.restore();
      return;
    }

    const arc = (Math.PI * 2) / candidates.length;
    const fontSize = candidates.length > 40 ? 18 : candidates.length > 24 ? 24 : candidates.length > 14 ? 31 : 39;
    candidates.forEach((number, index) => {
      const start = wheelAngle + index * arc;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, start + arc);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(255,253,247,.86)';
      ctx.stroke();

      ctx.save();
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = index % 2 === 0 ? '#fff' : '#3f4f48';
      ctx.font = `700 ${fontSize}px Iansui, sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,.13)';
      ctx.shadowBlur = 4;
      ctx.fillText(number, radius - 34, 2);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(0, 0, 78, 0, Math.PI * 2);
    ctx.fillStyle = '#405149';
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(255,255,255,.9)';
    ctx.stroke();
    ctx.restore();
  }

  applyNumbersButton.addEventListener('click', () => {
    const result = parseNumbers(wheelNumbers.value);
    if (result.error) {
      wheelStatus.textContent = result.error;
      return;
    }
    candidates = result.values;
    wheelAngle = -Math.PI / 2;
    wheelFinished = false;
    spinWheelButton.disabled = false;
    wheelNumbers.disabled = true;
    applyNumbersButton.disabled = true;
    wheelStatus.textContent = `已放入 ${candidates.length} 個號碼，準備抽出一位幸運得主`;
    drawWheel();
  });

  function spinWheel() {
    if (spinning || wheelFinished || candidates.length < 2) return;
    spinning = true;
    spinWheelButton.disabled = true;
    wheelStatus.textContent = '輪盤旋轉中…';
    const start = performance.now();
    const duration = 12200 + Math.random() * 1300;
    const rotations = 10 + Math.floor(Math.random() * 4);
    const initial = wheelAngle;
    const circle = Math.PI * 2;
    const arc = circle / candidates.length;
    const boundaryIndex = Math.floor(Math.random() * candidates.length);
    const boundaryNormalized = boundaryIndex * arc;
    const pointerAngle = -Math.PI / 2;
    const initialNormalized = ((initial % circle) + circle) % circle;
    const boundaryAngle = ((pointerAngle - boundaryNormalized) % circle + circle) % circle;
    const distanceToBoundary = (boundaryAngle - initialNormalized + circle) % circle;
    const boundaryTarget = initial + rotations * circle + distanceToBoundary;

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      wheelAngle = initial + (boundaryTarget - initial) * eased;
      drawWheel();
      if (t < 1) requestAnimationFrame(frame);
      else {
        wheelAngle = boundaryTarget;
        drawWheel();
        wheelStatus.textContent = '到底會是哪一號呢？';
        window.setTimeout(() => settleFromBoundary(boundaryIndex, boundaryTarget, arc), 140);
      }
    }
    requestAnimationFrame(frame);
  }

  function settleFromBoundary(boundaryIndex, boundaryTarget, arc) {
    const chooseClockwiseSide = Math.random() < .5;
    const winnerIndex = chooseClockwiseSide
      ? boundaryIndex
      : (boundaryIndex - 1 + candidates.length) % candidates.length;
    const nudge = arc * .1 * (chooseClockwiseSide ? -1 : 1);
    const settleStart = performance.now();
    const settleDuration = 1800;

    function settleFrame(now) {
      const t = Math.min(1, (now - settleStart) / settleDuration);
      const eased = t * t * t * (t * (t * 6 - 15) + 10);
      wheelAngle = boundaryTarget + nudge * eased;
      drawWheel();
      if (t < 1) requestAnimationFrame(settleFrame);
      else finishWheel(winnerIndex);
    }
    requestAnimationFrame(settleFrame);
  }

  function finishWheel(winnerIndex) {
    spinning = false;
    wheelFinished = true;
    const winner = candidates[winnerIndex];
    winnerNumber.textContent = winner;
    wheelStatus.textContent = `恭喜 ${winner} 號！`;
    window.setTimeout(() => openWinner('wheelWinner'), 520);
  }

  spinWheelButton.addEventListener('click', spinWheel);
  canvas.addEventListener('click', spinWheel);
  resetWheelButton.addEventListener('click', () => {
    if ((candidates.length || spinning) && !window.confirm('確定要清除號碼並重新設定嗎？')) return;
    candidates = ['1', '2', '3', '4', '5', '6'];
    spinning = false;
    wheelFinished = false;
    wheelAngle = -Math.PI / 2;
    wheelNumbers.value = '1\n2\n3\n4\n5\n6';
    wheelNumbers.disabled = false;
    applyNumbersButton.disabled = false;
    spinWheelButton.disabled = false;
    wheelStatus.textContent = '已預設 1～6 號，準備抽出一位幸運得主';
    drawWheel();
  });

  function launchConfetti() {
    const layer = document.getElementById('confettiLayer');
    const palette = ['#e4c879', '#d5a9a6', '#8da79a', '#8ca6ba', '#f6eee0'];
    layer.innerHTML = '';
    for (let i = 0; i < 100; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = palette[i % palette.length];
      piece.style.setProperty('--fall', `${3.2 + Math.random() * 2.2}s`);
      piece.style.setProperty('--drift', `${-130 + Math.random() * 260}px`);
      piece.style.animationDelay = `${Math.random() * .7}s`;
      layer.appendChild(piece);
    }
    window.setTimeout(() => { layer.innerHTML = ''; }, 6200);
  }

  function openWinner(id) {
    document.getElementById(id).classList.add('is-open');
    launchConfetti();
  }

  document.querySelectorAll('[data-close-winner]').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById(button.dataset.closeWinner).classList.remove('is-open');
    });
  });

  window.addEventListener('resize', () => {
    if (currentView === 'wheelView') drawWheel();
  });

  renderPassword();
  drawWheel();
})();
