// ── Petals ──
(function() {
  const canvas = document.getElementById('petals');
  const ctx = canvas.getContext('2d');
  let petals = [];
  const max = 60;
  const colors = ['#a8e6cf', '#ffd3b6', '#ffaaa5', '#7ecb76', '#fff5d1'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Petal {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 4 + 2;
      this.speed = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.4 + 0.15;
      this.drift = (Math.random() - 0.5) * 0.5;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.y += this.speed;
      this.wobble += this.wobbleSpeed;
      this.x += this.drift + Math.sin(this.wobble) * 0.3;
      if (this.y > canvas.height + 20) this.reset();
      if (this.x < -20) this.x = canvas.width + 20;
      if (this.x > canvas.width + 20) this.x = -20;
    }
    draw() {
      ctx.beginPath();
      ctx.ellipse(this.x, this.y, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace(')', `, ${this.opacity})`).replace('rgb', 'rgba');
      if (this.color.startsWith('#')) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < max; i++) petals.push(new Petal());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── 3D Tilt ──
(function() {
  const card = document.getElementById('card');
  const container = document.querySelector('.container');
  const maxTilt = 5;

  document.addEventListener('mousemove', e => {
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotateX = ((e.clientY - cy) / rect.height) * -maxTilt;
    const rotateY = ((e.clientX - cx) / rect.width) * maxTilt;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
})();

// ── Password toggle ──
(function() {
  const pwInput = document.getElementById('password');
  const eyeOff = document.getElementById('eyeOff');
  const eyeOn  = document.getElementById('eyeOn');

  document.getElementById('togglePw').addEventListener('click', () => {
    const isHidden = pwInput.type === 'password';
    pwInput.type = isHidden ? 'text' : 'password';
    eyeOff.style.display = isHidden ? 'none' : 'block';
    eyeOn.style.display  = isHidden ? 'block' : 'none';
  });
})();

// ── Focus label glow ──
(function() {
  document.querySelectorAll('.field input').forEach(input => {
    input.addEventListener('focus', () => input.closest('.field').classList.add('focused'));
    input.addEventListener('blur',  () => input.closest('.field').classList.remove('focused'));
  });
})();

// ── Shake helper ──
function shakeField(fieldEl) {
  fieldEl.classList.add('error', 'shake');
  fieldEl.addEventListener('animationend', () => fieldEl.classList.remove('shake'), { once: true });
}

function clearErrors() {
  document.querySelectorAll('.field.error').forEach(el => el.classList.remove('error'));
}

// ── Form submit ──
(function() {
  const form     = document.getElementById('loginForm');
  const btn      = document.getElementById('loginBtn');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const overlay  = document.getElementById('overlay');

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    let hasError = false;

    if (!username.value.trim()) {
      shakeField(document.getElementById('fieldUsername'));
      hasError = true;
    }
    if (!password.value.trim()) {
      shakeField(document.getElementById('fieldPassword'));
      hasError = true;
    }

    if (hasError) return;

    btn.classList.add('loading');

    setTimeout(() => {
      btn.classList.remove('loading');
      overlay.classList.add('show');
    }, 2000);
  });
})();

// ── Modal close ──
(function() {
  const overlay = document.getElementById('overlay');
  document.getElementById('closeModal').addEventListener('click', () => {
    overlay.classList.remove('show');
  });
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('show');
  });
})();