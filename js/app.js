// Spark Animation Logic
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    this.speedX = Math.cos(angle) * speed;
    this.speedY = Math.sin(angle) * speed;
    this.size = Math.random() * 2.5 + 0.5;
    const colors = [
      "rgba(15, 0, 64, 0.8)",
      "rgba(54, 232, 20, 0.8)",
      "rgba(100, 150, 255, 0.8)",
      "rgba(200, 200, 255, 0.8)",
    ];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.maxLife = Math.random() * 40 + 30;
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY -= 0.02;
    this.speedX *= 0.98;
    this.speedY *= 0.98;
    if (this.size > 0.1) {
      this.size -= 0.02;
    }
    this.life--;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function initSparkAnimation(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  let mouse = { x: -1000, y: -1000, moving: false };
  let timeoutId;
  let animationFrameId;

  const resizeCanvas = () => {
    if (canvas.parentElement) {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    } else {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.moving = true;

    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(mouse.x, mouse.y));
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      mouse.moving = false;
    }, 100);
  };

  const MAX_PARTICLES = 150;

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw(ctx);
    }

    particles = particles.filter((p) => p.life > 0);
    
    if (particles.length > MAX_PARTICLES) {
      particles.splice(0, particles.length - MAX_PARTICLES);
    }

    if (!mouse.moving && Math.random() < 0.05) {
      particles.push(
        new Particle(
          Math.random() * canvas.width,
          canvas.height + 10
        )
      );
    }

    animationFrameId = requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resizeCanvas);
  canvas.addEventListener("mousemove", handleMouseMove);
  
  resizeCanvas();
  animate();
}

// Auto-init on load if canvas exists
document.addEventListener('DOMContentLoaded', () => {
  initSparkAnimation('spark-canvas');
});
