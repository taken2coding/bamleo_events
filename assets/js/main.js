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

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', setYear);
handleScroll();
