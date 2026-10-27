const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const yearEl = document.getElementById('year');

const setYear = () => {
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
};

const handleScroll = () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};

const closeNav = () => {
    nav.classList.remove('active');
    navToggle.classList.remove('active');
};

navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    navToggle.classList.toggle('active');
});

navLinks.forEach((link) => {
    link.addEventListener('click', closeNav);
});

document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
        closeNav();
    }
});

const initFireworks = () => {
    const canvas = document.querySelector('.fireworks-canvas');
    if (!canvas) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    const resize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width * window.devicePixelRatio;
        canvas.height = height * window.devicePixelRatio;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const colors = ['#f7d88c', '#e2c68a', '#ffffff', '#f5b700'];
    const particles = [];
    let rockets = [];
    let animationId;
    let startTime = Date.now();
    const duration = 2500;

    class Rocket {
        constructor() {
            this.x = Math.random() * width;
            this.y = height;
            this.targetY = Math.random() * height * 0.4 + height * 0.1;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = - (Math.random() * 4 + 6);
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.exploded = false;
        }

        update() {
            if (this.exploded) return;
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.08;
            if (this.vy >= -1 || this.y <= this.targetY) {
                this.explode();
            }
        }

        explode() {
            this.exploded = true;
            const count = 40 + Math.floor(Math.random() * 20);
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const speed = Math.random() * 2 + 1.5;
                particles.push(new Particle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, this.color));
            }
        }

        draw() {
            if (this.exploded) return;
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    class Particle {
        constructor(x, y, vx, vy, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.color = color;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.gravity = 0.02;
        }

        update() {
            this.vx *= 0.98;
            this.vy *= 0.98;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
        }

        draw() {
            if (this.alpha <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const launchInterval = setInterval(() => {
        if (Date.now() - startTime > duration - 400) return;
        rockets.push(new Rocket());
        if (rockets.length > 4) rockets.shift();
    }, 250);

    rockets.push(new Rocket());

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        rockets.forEach((rocket, idx) => {
            rocket.update();
            rocket.draw();
            if (rocket.exploded) rockets.splice(idx, 1);
        });
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) particles.splice(i, 1);
        }

        if (Date.now() - startTime > duration && rockets.length === 0 && particles.length === 0) {
            cancelAnimationFrame(animationId);
            clearInterval(launchInterval);
            canvas.style.transition = 'opacity 1s ease';
            canvas.style.opacity = '0';
            setTimeout(() => {
                canvas.remove();
            }, 1000);
            return;
        }
        animationId = requestAnimationFrame(animate);
    };

    animate();
};

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', () => {
    setYear();
    initFireworks();
});
handleScroll();
