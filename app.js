// ========================================
// Configuration
// ========================================

// TODO: Reemplazar mock por API real
const API_URL = ''; // Configurar endpoint cuando esté disponible
const CHAT_API_URL = ''; // Configurar endpoint de chat cuando esté disponible

// ========================================
// Utility Functions
// ========================================

/**
 * Get or create session ID for chat
 */
function getSessionId() {
    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
}

/**
 * Get chat history from localStorage
 */
function getChatHistory() {
    const history = localStorage.getItem('chatHistory');
    return history ? JSON.parse(history) : [];
}

/**
 * Save chat history to localStorage
 */
function saveChatHistory(history) {
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Header Scroll Effect
// ========================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', debounce(() => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
}, 10));

// ========================================
// Mobile Menu Toggle
// ========================================

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ========================================
// Smooth Scroll & Active Navigation
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Highlight active section in navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', debounce(() => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100));

// ========================================
// Pricing Toggle (Monthly/Annual)
// ========================================

const pricingPlans = Array.isArray(window.pricingPlans) ? window.pricingPlans : [];

const pricingGrid = document.getElementById('pricingGrid');

function renderPricingCards() {
    if (!pricingGrid) {
        return;
    }

    const checkIcon = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    `;

    pricingGrid.innerHTML = pricingPlans.map((plan) => {
        const isRecurring = typeof plan.valor?.mensual === 'number' && typeof plan.valor?.anual === 'number';
        const initialValue = isRecurring ? plan.valor.mensual : plan.valor.unico;
        const periodText = isRecurring ? plan.valor.periodoMensual : plan.valor.periodoUnico;

        const amountHtml = isRecurring
            ? `<span class="price-amount" data-monthly="${plan.valor.mensual}" data-annual="${plan.valor.anual}">${initialValue.toLocaleString('es-AR')}</span>`
            : `<span class="price-amount">${initialValue.toLocaleString('es-AR')}</span>`;

        const featuresHtml = plan.cuerpo
            .map((item) => `<li>${checkIcon}${item}</li>`)
            .join('');

        return `
            <div class="pricing-card ${plan.destacada ? 'pricing-card-featured' : ''} reveal">
                ${plan.badge ? `<div class="pricing-badge">${plan.badge}</div>` : ''}
                <h3 class="pricing-name">${plan.titulo}</h3>
                <p class="pricing-description">${plan.subtitulo}</p>
                <div class="pricing-price">
                    <span class="price-currency">${plan.valor.moneda}</span>
                    ${amountHtml}
                    <span class="price-period">${periodText}</span>
                </div>
                <ul class="pricing-features">
                    ${featuresHtml}
                </ul>
                <a href="#demo" class="btn btn-${plan.ctaEstilo} btn-block" data-plan="${plan.nombre}">${plan.ctaTexto}</a>
            </div>
        `;
    }).join('');
}

renderPricingCards();

const pricingToggle = document.getElementById('pricingToggle');

pricingToggle.addEventListener('click', () => {
    pricingToggle.classList.toggle('active');
    const isAnnual = pricingToggle.classList.contains('active');

    const priceAmounts = document.querySelectorAll('.price-amount[data-monthly][data-annual]');
    const recurringCards = document.querySelectorAll('.pricing-card .price-amount[data-monthly][data-annual]');

    priceAmounts.forEach((amount) => {
        const monthly = amount.getAttribute('data-monthly');
        const annual = amount.getAttribute('data-annual');

        if (!monthly || !annual) {
            return;
        }

        // Animate number change
        const current = parseInt(amount.textContent.replace(/\./g, ''), 10);
        const target = isAnnual ? parseInt(annual, 10) : parseInt(monthly, 10);

        animateValue(amount, current, target, 300);
    });

    recurringCards.forEach((amount) => {
        const card = amount.closest('.pricing-card');
        const period = card?.querySelector('.price-period');

        if (period) {
            period.textContent = isAnnual ? '/año' : '/mes';
        }
    });
});

/**
 * Animate number transition
 */
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current).toLocaleString('es-AR');
    }, 16);
}

// ========================================
// FAQ Accordion
// ========================================

const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const isExpanded = question.getAttribute('aria-expanded') === 'true';

        // Close all other FAQs
        faqQuestions.forEach(q => {
            if (q !== question) {
                q.setAttribute('aria-expanded', 'false');
                q.parentElement.querySelector('.faq-answer').style.maxHeight = '0';
            }
        });

        // Toggle current FAQ
        if (isExpanded) {
            question.setAttribute('aria-expanded', 'false');
            answer.style.maxHeight = '0';
        } else {
            question.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });

    // Keyboard accessibility
    question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            question.click();
        }
    });
});

// ========================================
// Demo Form Validation & Submission
// ========================================

const demoForm = document.getElementById('demoForm');
const formFields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    country: document.getElementById('country'),
    role: document.getElementById('role'),
    gymSize: document.getElementById('gymSize'),
    message: document.getElementById('message'),
    selectedPlan: document.getElementById('selectedPlan')
};

// Capture selected plan from pricing buttons
document.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const plan = e.currentTarget.getAttribute('data-plan');
        formFields.selectedPlan.value = plan;
    });
});

/**
 * Validate email format
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Show error message
 */
function showError(fieldName, message) {
    const field = formFields[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);

    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('visible');
    }
}

/**
 * Clear error message
 */
function clearError(fieldName) {
    const field = formFields[fieldName];
    const errorElement = document.getElementById(`${fieldName}Error`);

    field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
    }
}

/**
 * Validate form
 */
function validateForm() {
    let isValid = true;

    // Clear all errors
    Object.keys(formFields).forEach(key => {
        if (key !== 'message' && key !== 'selectedPlan') {
            clearError(key);
        }
    });

    // Name validation
    if (!formFields.name.value.trim()) {
        showError('name', 'Por favor ingresá tu nombre');
        isValid = false;
    }

    // Email validation
    if (!formFields.email.value.trim()) {
        showError('email', 'Por favor ingresá tu email');
        isValid = false;
    } else if (!isValidEmail(formFields.email.value.trim())) {
        showError('email', 'Por favor ingresá un email válido');
        isValid = false;
    }

    // Country validation
    if (!formFields.country.value) {
        showError('country', 'Por favor seleccioná tu país');
        isValid = false;
    }

    // Role validation
    if (!formFields.role.value) {
        showError('role', 'Por favor seleccioná tu rol');
        isValid = false;
    }

    // Gym size validation
    if (!formFields.gymSize.value) {
        showError('gymSize', 'Por favor seleccioná el tamaño del gimnasio');
        isValid = false;
    }

    return isValid;
}

/**
 * Handle form submission
 */
demoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    // Disable submit button to prevent double submission
    const submitButton = demoForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
        // Get form data
        const formData = new FormData(demoForm);

        // Send to Web3Forms
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            console.log('Formulario enviado correctamente', result, formData);
            // Show success message
            alert('¡Gracias por tu interés! Nos contactaremos pronto.');

            // Reset form
            demoForm.reset();
        } else {
            throw new Error(result.message || 'Error al enviar el formulario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al enviar el formulario. Por favor intentá nuevamente o contactanos directamente a wpiedrabuena@gmail.com');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

// Real-time validation on blur
Object.keys(formFields).forEach(key => {
    if (key !== 'message' && key !== 'selectedPlan') {
        formFields[key].addEventListener('blur', () => {
            if (formFields[key].value.trim()) {
                clearError(key);
            }
        });
    }
});

// ========================================
// Scroll Reveal Animation
// ========================================

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ========================================
// Back to Top Button
// ========================================

const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', debounce(() => {
    if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}, 100));

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// Chat Widget
// ========================================

const chatButton = document.getElementById('chatButton');
const chatPanel = document.getElementById('chatPanel');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');
const chatTyping = document.getElementById('chatTyping');

let chatHistory = getChatHistory();
const sessionId = getSessionId();

// Load chat history
if (chatHistory.length > 0) {
    chatHistory.forEach(msg => {
        addMessageToUI(msg.content, msg.isBot);
    });
}

/**
 * Toggle chat panel
 */
function toggleChat() {
    chatPanel.classList.toggle('active');
    chatButton.classList.toggle('active');

    if (chatPanel.classList.contains('active')) {
        chatInput.focus();
    }
}

chatButton.addEventListener('click', toggleChat);
chatCloseBtn.addEventListener('click', toggleChat);

/**
 * Add message to UI
 */
function addMessageToUI(content, isBot = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isBot ? 'bot-message' : 'user-message'}`;

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;

    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Show typing indicator
 */
function showTyping() {
    chatTyping.style.display = 'flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Hide typing indicator
 */
function hideTyping() {
    chatTyping.style.display = 'none';
}

/**
 * Mock chatbot response based on intent detection
 * TODO: Reemplazar con API real
 */
function getMockResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Intent detection (simple keyword matching)
    if (message.includes('precio') || message.includes('costo') || message.includes('plan')) {
        return 'Tenemos 3 planes: Starter ($49/mes), Pro ($99/mes) y Enterprise ($199/mes). Todos incluyen soporte y migración sin cargo. ¿Te gustaría agendar una demo?';
    }

    if (message.includes('demo') || message.includes('prueba') || message.includes('probar')) {
        return 'Podés agendar una demo personalizada completando el formulario en esta página. Es gratis y sin compromiso. ¿Te ayudo con algo más?';
    }

    if (message.includes('módulo') || message.includes('funcionalidad') || message.includes('características')) {
        return 'GestGym incluye: Pagos & Membresías, Pantalla Cliente, Panel Admin, Panel Supervisor, Control de Acceso y Reportes. ¿Querés saber más sobre algún módulo en particular?';
    }

    if (message.includes('soporte') || message.includes('ayuda') || message.includes('asistencia')) {
        return 'Todos los planes incluyen soporte. Starter tiene soporte por email, Pro soporte prioritario, y Enterprise cuenta dedicada 24/7. ¿Qué plan te interesa?';
    }

    if (message.includes('integra') || message.includes('pago automático') || message.includes('mercadopago')) {
        return 'Nos integramos con MercadoPago, Stripe y débito automático. También podés registrar pagos manualmente. ¿Necesitás alguna integración específica?';
    }

    if (message.includes('importar') || message.includes('migración') || message.includes('excel')) {
        return 'Podés importar tu base de socios desde Excel sin problemas. La migración está incluida sin cargo en todos los planes. ¿Tenés muchos socios actualmente?';
    }

    if (message.includes('hola') || message.includes('buenos días') || message.includes('buenas tardes')) {
        return '¡Hola! 👋 ¿En qué puedo ayudarte con GestGym? Puedo responder sobre precios, módulos, demos y más.';
    }

    if (message.includes('gracias') || message.includes('perfecto') || message.includes('ok')) {
        return '¡De nada! Si tenés más preguntas, estoy acá para ayudarte. 😊';
    }

    // Default response
    return 'Interesante pregunta. Te recomiendo que agendes una demo personalizada donde podemos resolver todas tus dudas en detalle. ¿Te gustaría agendar una?';
}

/**
 * Send chat message
 */
async function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) {
        return;
    }

    // Add user message to UI
    addMessageToUI(message, false);

    // Save to history
    chatHistory.push({
        content: message,
        isBot: false,
        timestamp: Date.now()
    });

    // Clear input
    chatInput.value = '';
    chatSendBtn.disabled = true;

    // Show typing indicator
    showTyping();

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // TODO: Reemplazar con API real
    // try {
    //     const response = await fetch(CHAT_API_URL, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             message: message,
    //             sessionId: sessionId,
    //             timestamp: Date.now()
    //         })
    //     });
    //     
    //     if (!response.ok) {
    //         throw new Error('Error en la respuesta del chat');
    //     }
    //     
    //     const data = await response.json();
    //     const botResponse = data.response;
    // } catch (error) {
    //     console.error('Chat error:', error);
    //     const botResponse = 'Lo siento, hubo un error. Por favor intentá nuevamente.';
    // }

    // Get mock response
    const botResponse = getMockResponse(message);

    // Hide typing
    hideTyping();

    // Add bot message to UI
    addMessageToUI(botResponse, true);

    // Save to history
    chatHistory.push({
        content: botResponse,
        isBot: true,
        timestamp: Date.now()
    });

    // Save history to localStorage
    saveChatHistory(chatHistory);

    // Re-enable send button
    chatSendBtn.disabled = false;
}

/**
 * Handle send button click
 */
chatSendBtn.addEventListener('click', sendMessage);

/**
 * Handle Enter key in chat input
 */
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

/**
 * Enable/disable send button based on input
 */
chatInput.addEventListener('input', () => {
    chatSendBtn.disabled = !chatInput.value.trim();
});

// ========================================
// Initialize
// ========================================

console.log('GestGym Landing Page initialized');
console.log('Session ID:', sessionId);
console.log('Chat history loaded:', chatHistory.length, 'messages');

// TODO: Integración con chatbot externo
// Para integrar un chatbot externo, usar:
// function initChatbot(config) {
//     // config = { apiUrl, apiKey, widgetSettings, etc. }
//     CHAT_API_URL = config.apiUrl;
//     // Configurar widget según settings...
// }
