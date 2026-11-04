// Datos de la sección Pricing
// Podés personalizar planes, textos y features desde este archivo.
window.pricingPlans = [
    {
        nombre: 'inicial',
        titulo: 'Inicial',
        subtitulo: 'Para gimnasios en crecimiento',
        valor: {
            moneda: '$',
            mensual: 45000,
            anual: 450000,
            periodoMensual: '/mes',
            periodoAnual: '/año'
        },
        cuerpo: [
            'Hasta 300 socios',
            'Pagos y membresías',
            'Pantalla cliente',
            'Panel básico',
            'Soporte por email'
        ],
        ctaTexto: 'Empezar',
        ctaEstilo: 'secondary',
        destacada: false
    },
    {
        nombre: 'intermedia',
        titulo: 'Intermedia',
        subtitulo: 'Para gimnasios establecidos',
        valor: {
            moneda: '$',
            mensual: 60000,
            anual: 600000,
            periodoMensual: '/mes',
            periodoAnual: '/año'
        },
        cuerpo: [
            'Hasta 500 socios',
            'Todos los módulos',
            'Control de acceso',
            'Reportes avanzados',
            'Integraciones API',
            'Soporte prioritario'
        ],
        ctaTexto: 'Empezar',
        ctaEstilo: 'primary',
        destacada: true,
        badge: 'Más popular'
    },
    {
        nombre: 'pro',
        titulo: 'Pro',
        subtitulo: 'Para cadenas de gimnasios',
        valor: {
            moneda: '$',
            mensual: 70000,
            anual: 700000,
            periodoMensual: '/mes',
            periodoAnual: '/año'
        },
        cuerpo: [
            'Socios ilimitados',
            'Multi-sede',
            'White label',
            'API completa',
            'Cuenta dedicada',
            'Soporte 24/7'
        ],
        ctaTexto: 'Empezar',
        ctaEstilo: 'secondary',
        destacada: false
    }
];
