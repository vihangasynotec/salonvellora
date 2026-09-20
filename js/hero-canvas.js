/**
 * SALON VELLORA - NEXT-LEVEL INTERACTIVE LUXURY HERO CANVAS
 * Features:
 * - 3D Fluttering Silk Rose Petals with Wind Turbulence & Cosine Tilt
 * - Shimmering 24K Gold Stardust & Diamond Sparkles
 * - Floating Gossamer Silk Filament Constellations
 * - Fluid Magnetic Mouse Spotlight & Repulsion Physics
 * - Interactive Cursor Sparkle Particle Trail
 * - Luxury Golden Floral Bloom Ripples on Click / Touch
 * - High-DPI Retina Support & Battery-saving IntersectionObserver
 */

(function initHeroCanvas() {
  const heroSection = document.getElementById('hero');
  const canvas = document.getElementById('heroCanvas');
  if (!heroSection || !canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrameId = null;
  let isVisible = true;

  // Smooth mouse coordinates with lerping
  const mouse = {
    x: -1000,
    y: -1000,
    smoothX: -1000,
    smoothY: -1000,
    targetAlpha: 0,
    currentAlpha: 0,
    isHovering: false,
    radius: 190
  };

  // Particles collections
  const petals = [];
  const sparkles = [];
  const trails = [];
  const ripples = [];

  // Configuration tuned for elegance & luxury
  const PETAL_COUNT = prefersReducedMotion ? 12 : 26;
  const SPARKLE_COUNT = prefersReducedMotion ? 18 : 42;

  // Luxury Color Palette
  const PALETTE = {
    roseLight: '#fde8ed',
    roseMid: '#f8b4c4',
    roseDeep: '#e86a8a',
    goldLight: '#fff2b3',
    goldMid: '#e6be64',
    goldDeep: '#b88928',
    pearl: '#ffffff'
  };

  /* --------------------------------------------------------------------------
     1. HIGH-DPI RESIZING & BOUNDS
     -------------------------------------------------------------------------- */
  function resize() {
    const rect = heroSection.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
  }

  /* --------------------------------------------------------------------------
     2. PETAL CLASS (Organic fluttering rose petals with 3D tilt)
     -------------------------------------------------------------------------- */
  class RosePetal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = 11 + Math.random() * 13;
      this.vx = (Math.random() - 0.45) * 0.75;
      this.vy = 0.55 + Math.random() * 0.95;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.022;
      this.tilt = Math.random() * Math.PI * 2;
      this.tiltSpeed = 0.015 + Math.random() * 0.025;
      this.alpha = 0.35 + Math.random() * 0.45;
      this.swaySeed = Math.random() * 100;
      this.swaySpeed = 0.012 + Math.random() * 0.018;
      this.colorIndex = Math.floor(Math.random() * 3);
      this.pushX = 0;
      this.pushY = 0;
    }

    update(time) {
      // Wind turbulence using sine wave
      const sway = Math.sin(time * this.swaySpeed + this.swaySeed) * 0.65;

      // Mouse interactive physics (fluid dispersion)
      if (mouse.currentAlpha > 0.05) {
        const dx = this.x - mouse.smoothX;
        const dy = this.y - mouse.smoothY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 1) {
          const power = (1 - dist / mouse.radius);
          const pushForce = power * 2.8;
          this.pushX += (dx / dist) * pushForce;
          this.pushY += (dy / dist) * pushForce;
          this.tiltSpeed += 0.025 * power;
          this.angleSpeed += (Math.random() - 0.5) * 0.035;
        }
      }

      // Smooth decay of interactive push
      this.pushX *= 0.92;
      this.pushY *= 0.92;

      this.x += this.vx + sway + this.pushX;
      this.y += this.vy + this.pushY;
      this.angle += this.angleSpeed;
      this.tilt += this.tiltSpeed;

      // Boundary wraps
      if (this.y > height + 40 || this.x < -50 || this.x > width + 50) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      // 3D cosine tilt scale
      ctx.scale(Math.cos(this.tilt), 1);
      ctx.globalAlpha = this.alpha;

      // Organic curved petal path
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.75, -this.size * 0.5, this.size * 0.85, this.size * 0.45, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.85, this.size * 0.45, -this.size * 0.75, -this.size * 0.5, 0, -this.size);
      ctx.closePath();

      // Delicate luxury petal gradient
      const grad = ctx.createLinearGradient(-this.size * 0.5, -this.size, this.size * 0.5, this.size);
      if (this.colorIndex === 0) {
        grad.addColorStop(0, PALETTE.roseLight);
        grad.addColorStop(0.65, PALETTE.roseMid);
        grad.addColorStop(1, PALETTE.roseDeep);
      } else if (this.colorIndex === 1) {
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, PALETTE.roseLight);
        grad.addColorStop(1, PALETTE.roseMid);
      } else {
        grad.addColorStop(0, PALETTE.goldLight);
        grad.addColorStop(0.6, PALETTE.roseMid);
        grad.addColorStop(1, PALETTE.roseDeep);
      }

      ctx.fillStyle = grad;
      ctx.fill();

      // Soft spine highlight for realism
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.75);
      ctx.quadraticCurveTo(this.size * 0.1, 0, 0, this.size * 0.7);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 0.9;
      ctx.stroke();

      ctx.restore();
    }
  }

  /* --------------------------------------------------------------------------
     3. SPARKLE CLASS (24K Gold Stardust & 4-Point Diamonds)
     -------------------------------------------------------------------------- */
  class GoldenSparkle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = 2 + Math.random() * 4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = -(0.25 + Math.random() * 0.55); // float upward softly
      this.baseAlpha = 0.25 + Math.random() * 0.55;
      this.alpha = this.baseAlpha;
      this.pulseSpeed = 0.02 + Math.random() * 0.035;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.isDiamond = Math.random() > 0.45;
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }

    update(time) {
      // Gentle pulsing glimmer
      this.alpha = this.baseAlpha + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 0.25;
      this.alpha = Math.max(0.1, Math.min(1, this.alpha));

      // Mouse interactive magnetic float
      if (mouse.currentAlpha > 0.05) {
        const dx = this.x - mouse.smoothX;
        const dy = this.y - mouse.smoothY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius * 0.85 && dist > 1) {
          const power = (1 - dist / (mouse.radius * 0.85));
          this.x += (dx / dist) * power * 2.2;
          this.y += (dy / dist) * power * 2.2;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
      this.angle += this.rotSpeed;

      if (this.y < -30 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = this.alpha;

      if (this.isDiamond) {
        // 4-point diamond sparkle
        ctx.fillStyle = PALETTE.goldMid;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2);
        ctx.quadraticCurveTo(0, 0, this.size * 0.4, 0);
        ctx.quadraticCurveTo(0, 0, 0, this.size * 2);
        ctx.quadraticCurveTo(0, 0, -this.size * 0.4, 0);
        ctx.quadraticCurveTo(0, 0, 0, -this.size * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-this.size * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, this.size * 0.4);
        ctx.quadraticCurveTo(0, 0, this.size * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -this.size * 0.4);
        ctx.quadraticCurveTo(0, 0, -this.size * 2, 0);
        ctx.fill();

        // Glowing center diamond core
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = PALETTE.goldLight;
        ctx.shadowBlur = 8;
        ctx.fill();
      } else {
        // Soft glowing pearl orb
        const radGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        radGrad.addColorStop(0, '#FFFFFF');
        radGrad.addColorStop(0.4, PALETTE.goldLight);
        radGrad.addColorStop(1, 'rgba(230, 190, 100, 0)');
        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /* --------------------------------------------------------------------------
     4. CURSOR TRAIL STARDUST
     -------------------------------------------------------------------------- */
  class CursorSparkle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 16;
      this.y = y + (Math.random() - 0.5) * 16;
      this.vx = (Math.random() - 0.5) * 1.6;
      this.vy = (Math.random() - 0.5) * 1.6 - 0.4;
      this.size = 2 + Math.random() * 3.2;
      this.alpha = 0.95;
      this.decay = 0.022 + Math.random() * 0.024;
      this.angle = Math.random() * Math.PI * 2;
      this.color = Math.random() > 0.5 ? PALETTE.goldMid : PALETTE.roseDeep;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.95;
      this.vy *= 0.95;
      this.alpha -= this.decay;
      this.size *= 0.97;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.globalAlpha = Math.max(0, this.alpha);

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.8);
      ctx.quadraticCurveTo(0, 0, this.size * 0.35, 0);
      ctx.quadraticCurveTo(0, 0, 0, this.size * 1.8);
      ctx.quadraticCurveTo(0, 0, -this.size * 0.35, 0);
      ctx.quadraticCurveTo(0, 0, 0, -this.size * 1.8);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      ctx.restore();
    }
  }

  /* --------------------------------------------------------------------------
     5. FLORAL BLOOM CLICK RIPPLE
     -------------------------------------------------------------------------- */
  class BloomRipple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 4;
      this.maxRadius = 140 + Math.random() * 40;
      this.alpha = 0.85;
      this.lineWidth = 2.4;
    }

    update() {
      this.radius += 3.6;
      this.alpha = Math.max(0, 1 - (this.radius / this.maxRadius));
      this.lineWidth = Math.max(0.4, 2.4 * this.alpha);
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha * 0.65;
      ctx.lineWidth = this.lineWidth;

      // Expanding iridescent gold & rose ring
      const grad = ctx.createRadialGradient(
        this.x, this.y, Math.max(0, this.radius - 12),
        this.x, this.y, this.radius + 6
      );
      grad.addColorStop(0, 'rgba(255, 235, 179, 0)');
      grad.addColorStop(0.5, 'rgba(238, 125, 156, 0.75)');
      grad.addColorStop(0.9, 'rgba(230, 190, 100, 0.85)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }
  }

  /* --------------------------------------------------------------------------
     6. INITIALIZE COLLECTIONS
     -------------------------------------------------------------------------- */
  function initParticles() {
    petals.length = 0;
    sparkles.length = 0;

    for (let i = 0; i < PETAL_COUNT; i++) {
      petals.push(new RosePetal());
    }

    for (let i = 0; i < SPARKLE_COUNT; i++) {
      sparkles.push(new GoldenSparkle());
    }
  }

  /* --------------------------------------------------------------------------
     7. DRAW INTERACTIVE AURORA SPOTLIGHT
     -------------------------------------------------------------------------- */
  function drawInteractiveGlow() {
    if (mouse.currentAlpha <= 0.01) return;

    ctx.save();
    ctx.globalAlpha = mouse.currentAlpha;

    // Outer subtle gold & rose radiance
    const radial = ctx.createRadialGradient(
      mouse.smoothX, mouse.smoothY, 0,
      mouse.smoothX, mouse.smoothY, mouse.radius * 1.7
    );
    radial.addColorStop(0, 'rgba(255, 235, 240, 0.32)');
    radial.addColorStop(0.3, 'rgba(247, 208, 217, 0.22)');
    radial.addColorStop(0.65, 'rgba(240, 220, 155, 0.12)');
    radial.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  }

  /* --------------------------------------------------------------------------
     8. DRAW SILK FILAMENT CONSTELLATIONS
     -------------------------------------------------------------------------- */
  function drawFilaments() {
    const maxDist = 95;
    const count = sparkles.length;

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = sparkles[i].x - sparkles[j].x;
        const dy = sparkles[i].y - sparkles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.14 * sparkles[i].alpha * sparkles[j].alpha;
          if (alpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.75;
            ctx.strokeStyle = PALETTE.goldMid;
            ctx.beginPath();
            ctx.moveTo(sparkles[i].x, sparkles[i].y);
            ctx.lineTo(sparkles[j].x, sparkles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }
  }

  /* --------------------------------------------------------------------------
     9. ANIMATION LOOP (Optimized 60 FPS)
     -------------------------------------------------------------------------- */
  function render(time = 0) {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Smooth cursor interpolation (lerp)
    if (mouse.isHovering) {
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.12;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.12;
      mouse.targetAlpha = 1;
    } else {
      mouse.targetAlpha = 0;
    }
    mouse.currentAlpha += (mouse.targetAlpha - mouse.currentAlpha) * 0.08;

    // Draw ambient interactive cursor glow
    drawInteractiveGlow();

    // Draw connecting silk gossamer lines
    drawFilaments();

    // Draw & update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].draw();
      if (ripples[i].alpha <= 0) {
        ripples.splice(i, 1);
      }
    }

    // Draw & update golden sparkles
    for (let i = 0; i < sparkles.length; i++) {
      sparkles[i].update(time * 0.001);
      sparkles[i].draw();
    }

    // Draw & update cursor trail stardust
    for (let i = trails.length - 1; i >= 0; i--) {
      trails[i].update();
      trails[i].draw();
      if (trails[i].alpha <= 0) {
        trails.splice(i, 1);
      }
    }

    // Draw & update floating rose petals
    for (let i = 0; i < petals.length; i++) {
      petals[i].update(time * 0.001);
      petals[i].draw();
    }

    animationFrameId = requestAnimationFrame(render);
  }

  /* --------------------------------------------------------------------------
     10. EVENT LISTENERS (Pointer, Click & Touch)
     -------------------------------------------------------------------------- */
  function onPointerMove(e) {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      if (!mouse.isHovering) {
        mouse.smoothX = x;
        mouse.smoothY = y;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.isHovering = true;

      // Spawn stardust trail particles
      if (!prefersReducedMotion && Math.random() < 0.65) {
        trails.push(new CursorSparkle(x, y));
        if (trails.length > 40) trails.shift();
      }
    } else {
      mouse.isHovering = false;
    }
  }

  function onPointerLeave() {
    mouse.isHovering = false;
  }

  function onPointerDown(e) {
    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add luxury ripple wave
    ripples.push(new BloomRipple(x, y));
    if (ripples.length > 5) ripples.shift();

    // Burst of sparkle embers
    const burstCount = prefersReducedMotion ? 4 : 14;
    for (let i = 0; i < burstCount; i++) {
      trails.push(new CursorSparkle(x, y));
    }

    // Gentle dispersion wave on nearby petals
    petals.forEach(petal => {
      const dx = petal.x - x;
      const dy = petal.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 260 && dist > 1) {
        const force = (1 - dist / 260) * 8;
        petal.pushX += (dx / dist) * force;
        petal.pushY += (dy / dist) * force;
        petal.tiltSpeed += 0.05;
      }
    });
  }

  // Attach pointer handlers to hero
  heroSection.addEventListener('pointermove', onPointerMove, { passive: true });
  heroSection.addEventListener('pointerleave', onPointerLeave, { passive: true });
  heroSection.addEventListener('pointerdown', onPointerDown, { passive: true });

  /* --------------------------------------------------------------------------
     11. INTERSECTION OBSERVER (Zero CPU usage when scrolled away)
     -------------------------------------------------------------------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animationFrameId) {
        animationFrameId = requestAnimationFrame(render);
      }
    });
  }, { threshold: 0.05 });

  observer.observe(heroSection);

  /* --------------------------------------------------------------------------
     12. WINDOW RESIZE WITH DEBOUNCE
     -------------------------------------------------------------------------- */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      initParticles();
    }, 150);
  }, { passive: true });

  // Initialize
  resize();
  initParticles();
  animationFrameId = requestAnimationFrame(render);
})();
