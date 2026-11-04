document.body.classList.add('has-js');

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
    document.body.classList.toggle('menu-open', !open);
});

document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
}));

const money = new Intl.NumberFormat('es-AR');
const pricingGrid = document.querySelector('#pricingGrid');
const pricingToggle = document.querySelector('#pricingToggle');
let annual = false;

function checkIcon() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7"/></svg>'; }

function renderPricing() {
    if (!pricingGrid || !Array.isArray(window.pricingPlans)) return;
    pricingGrid.replaceChildren();
    window.pricingPlans.forEach((plan) => {
        const recurring = typeof plan.valor?.mensual === 'number';
        const value = recurring ? (annual ? plan.valor.anual : plan.valor.mensual) : plan.valor.unico;
        const period = recurring ? (annual ? '/año' : '/mes') : plan.valor.periodoUnico || '';
        const card = document.createElement('article');
        card.className = `price-card ${plan.destacada ? 'is-featured' : ''}`;
        card.innerHTML = `${plan.badge ? `<p class="price-badge">${plan.badge}</p>` : ''}<p class="plan-kicker">PLAN GESTGYM</p><h3>${plan.titulo}</h3><p class="plan-summary">${plan.subtitulo}</p><p class="price"><span>${plan.valor.moneda}</span>${money.format(value)}<small>${period}</small></p><ul>${plan.cuerpo.map((item) => `<li>${checkIcon()}${item}</li>`).join('')}</ul><a class="button ${plan.destacada ? 'button-primary' : 'button-ghost'}" href="#demo">${plan.ctaTexto} <span aria-hidden="true">→</span></a>`;
        pricingGrid.append(card);
    });
}

renderPricing();
pricingToggle?.addEventListener('click', () => {
    annual = !annual;
    pricingToggle.setAttribute('aria-pressed', String(annual));
    pricingToggle.classList.toggle('is-annual', annual);
    renderPricing();
});

const form = document.querySelector('#demoForm');
const formStatus = document.querySelector('#formStatus');
form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Enviando…';
    formStatus.textContent = '';
    try {
        const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error();
        form.reset();
        formStatus.textContent = 'Recibimos tu consulta. Te contactaremos a la brevedad.';
        formStatus.classList.add('is-success');
    } catch {
        formStatus.textContent = 'No pudimos enviar el formulario. Escribinos por WhatsApp para coordinar la demo.';
        formStatus.classList.remove('is-success');
    } finally {
        button.disabled = false;
        button.innerHTML = 'Solicitar mi demo <span aria-hidden="true">→</span>';
    }
});

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const progressBar = document.querySelector('.scroll-progress span');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollProgress() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    if (progressBar) progressBar.style.setProperty('--scroll-progress', Math.min(Math.max(progress, 0), 1));
}

updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);

if (!reduceMotion) {
    const stage = document.querySelector('.product-stage');
    stage?.addEventListener('pointermove', (event) => {
        if (window.innerWidth <= 900) return;
        const bounds = stage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        stage.style.transform = `perspective(1400px) rotateY(${x * 7}px) rotateX(${y * -5}px) translateY(-8px)`;
    });
    stage?.addEventListener('pointerleave', () => { stage.style.transform = ''; });
}
