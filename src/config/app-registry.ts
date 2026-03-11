/**
 * App Registry – single source of truth for all user-facing text.
 * See docs/WEBSITE_TEXT_CONTENT.md for inventory.
 * No hardcoded strings in components; components receive data from here.
 */

export const APP_REGISTRY = {
  status: {
    loading: "Cargando..."
  },
  comingSoon: {
    metadata: {
      title: "KumiBox | Muy pronto",
      description: "KumiBox esta por llegar: skincare coreano curado, explicado paso a paso y entregado directo a tu puerta."
    },
    brand: {
      name: "KumiBox",
      imagePath: "Logo sin BG.png"
    },
    launchDateIso: "2026-03-21T12:00:00",
    badgeText: "Algo increible viene en camino",
    headingPrefix: "Tu ritual coreano de skincare,",
    headingHighlight: "directo a tu puerta",
    description: "Estamos preparando algo especial para ti. Una caja de skincare coreano curada y explicada paso a paso, para que cuidar tu piel se sienta simple, divertido y efectivo.",
    countdownLabels: {
      days: "Dias",
      hours: "Horas",
      minutes: "Min",
      seconds: "Seg"
    },
    featurePills: [
      {
        emoji: "🇰🇷",
        text: "Directo de Seul"
      },
      {
        emoji: "📦",
        text: "Entrega cada 2 meses"
      },
      {
        emoji: "🌿",
        text: "Productos premium"
      },
      {
        emoji: "📖",
        text: "Guia paso a paso"
      }
    ],
    socialCtaPrefix: "Siguenos en",
    socialHandle: "@kumibox.mx",
    socialCtaSuffix: "para ser la primera en enterarte 💌"
  },
  nav: {
    logoText: "KumiBox",
    logoImagePath: "Logo sin BG.png",
    announcementBar: "¡Envío GRATIS a todo México!",
    announcementBarEmoji: "",
    links: [
      {
        label: "Tienda",
        href: "#pricing"
      },
      {
        label: "Nosotros",
        href: "#why"
      },
      {
        label: "Preguntas",
        href: "#faq"
      }
    ],
    logIn: {
      label: "Inicia Sesión",
      href: "/login"
    },
    getStarted: {
      label: "Registrarme",
      href: "/register"
    }
  },
  hero: {
    badgeText: "0",
    imageBadgeLeft: "Directo de Seúl",
    imageBadgeRight: "⭐ 4.9/5",
    rotatingQuotes: {
      "0": "¿Estoy eligiendo lo correcto para mi piel?",
      "1": "He probado tanto… y nada se siente claro.",
      "2": "Hay muchas opciones. ¿Por dónde empiezo?"
    },
    heading: "Descubre el ritual coreano que simplifica el cuidado de tu piel.",
    description: "Tu rutina completa de skincare directo a la puerta de tu casa, cuidadosamente seleccionada y explicada paso a paso. ",
    primaryCta: {
      label: "Quiero unirme",
      href: "#pricing"
    },
    secondaryCta: {
      label: "¿Cómo funciona?",
      href: "#how-it-works"
    },
    footer: "Cancela cuando quieras · Envíos cada 2 meses · Sin contratos"
  },
  why: {
    title: "Por eso existimos",
    ctaButton: "Descubre si esta experiencia es para ti",
    impactLine1: "El skincare no debería ser confuso.",
    impactLine2: "Descúbrelo sin estrés.",
    cards: {
      "0": {
        beforeText: "Buscas algo que realmente funcione para tu piel.",
        frictionText: "Pero cada recomendación es distinta. Cada dia hay una nueva tendencia.",
        costText: "Y elegir se vuelve más complicado de lo que debería ser."
      },
      "1": {
        beforeText: "Compras con ilusión.",
        frictionText: "Algunos productos funcionan. Otros se quedan a medias.",
        costText: "Tu repisa se llena de productos en los que ya no confías y sientes que haz desperdiciado tu dinero."
      },
      "2": {
        beforeText: "Con el tiempo, lo simple se vuelve confuso.",
        frictionText: "Entre consejos y opiniones, la constancia se pierde.",
        costText: "Y el cuidado personal deja de sentirse como algo relajante y se vuelve una tarea abrumadora."
      }
    }
  },
  compatibilityTest: {
    subtitle: "Test de Compatibilidad",
    title: "¿Es esta experiencia para ti?",
    triggerLabel: "Responde 4 preguntas y descúbrelo",
    questions: [
      "¿Estás actualmente bajo tratamiento dermatológico especializado?",
      "¿Te sientes cómoda usando fórmulas suaves y sin fragancia en tu rutina diaria?",
      "¿Buscas hidratación, luminosidad y cuidado de la barrera más que tratamientos intensivos?",
      "¿Puedes dedicar alrededor de 4 minutos al día a una rutina sencilla?"
    ],
    resultDermatologist: "Te recomendamos consultar a tu dermatólogo antes de probar nuevos productos",
    resultGoodFit: "Perfecto. Esta experiencia fue diseñada para alguien como tú",
    ctaButton: "Quiero unirme"
  },
  howItWorks: {
    title: "Como Funciona",
    ctaButton: {
      label: "Ve un ejemplo de rutina",
      href: "#experience"
    },
    steps: [
      {
        label: "Subscríbete",
        title: "Únete y comienza tu ritual coreano",
        description: "Te acompañamos paso a paso, desde el primer día"
      },
      {
        label: "Elegimos",
        title: "Seleccionamos los mejores productos originales",
        description: "Fórmulas pensadas para funcionar en todos los tipos de piel"
      },
      {
        label: "Recibe",
        title: "Cada caja sigue una rutina clara y fácil de integrar",
        description: "Limpia · Hidrata · Trata · Protege — productos diseñados para trabajar juntos. Hasta tu puerta, cada 2 meses"
      },
      {
        label: "Disfruta",
        title: "Descubre nuevos productos sin abrumarte",
        description: "Instrucciones claras. Pasos simples. Sin culpa"
      }
    ]
  },
  whatYouReceive: {
    subtitle: "What You Receive",
    subtitleBadgeEmoji: "📦",
    title: "Lo que recibes cada mes",
    description: "4 ó 5 productos coreanos. Una rutina completa. Diseñada para acompañarte hasta tu próxima entrega.",
    products: [
      {
        number: "1",
        emoji: "🧴",
        category: "Limpia",
        description: "Un limpiador suave de uso diario, pensado para mantener equilibrio sin alterar tu piel"
      },
      {
        number: "2",
        emoji: "💧",
        category: "Prepara o Trata",
        description: "Un paso ligero — tónico, esencia o suero — que aporta hidratación y soporte diario"
      },
      {
        number: "3",
        emoji: "🛡️",
        category: "Refuerza",
        description: "Un producto que fortalece la barrera y mantiene la piel cómoda y estable"
      },
      {
        number: "4",
        emoji: "☀️",
        category: "Sella o Protege",
        description: "Una crema o paso final que integra la rutina y mantiene los beneficios durante el día"
      },
      {
        number: "5",
        emoji: "🌸",
        category: "Complementa",
        description: "Un producto de uso ocasional que potencia la rutina sin complicarla. Nunca recibirás pasos repetidos o innecesarios"
      }
    ]
  },
  pastEditions: {
    subtitleEmoji: "📚",
    subtitle: "Ediciones pasadas",
    title: "Nuestras ediciones pasadas",
    fallbackImage: "https://placehold.co/590x640/e8e4de/2d2620?text=Edicion+pasada",
    editions: [
      {
        name: "Impulso de hidratacion",
        category: "Hidratacion",
        month: "Enero 2024",
        image: "https://picsum.photos/seed/hydration/590/640"
      },
      {
        name: "Esenciales de luminosidad",
        category: "Luminosidad",
        month: "Febrero 2024",
        image: "https://picsum.photos/seed/glow/590/640"
      },
      {
        name: "Reparacion de barrera",
        category: "Reparacion",
        month: "Marzo 2024",
        image: "https://picsum.photos/seed/barrier/590/640"
      },
      {
        name: "Limpieza suave",
        category: "Limpieza",
        month: "Abril 2024",
        image: "https://picsum.photos/seed/cleanse/590/640"
      },
      {
        name: "Luminosidad de verano",
        category: "Proteccion",
        month: "Mayo 2024",
        image: "https://picsum.photos/seed/summer/590/640"
      },
      {
        name: "Hidratacion profunda",
        category: "Hidratacion",
        month: "Junio 2024",
        image: "https://picsum.photos/seed/deep/590/640"
      },
      {
        name: "Rutina calmante",
        category: "Piel sensible",
        month: "Julio 2024",
        image: "https://picsum.photos/seed/calming/590/640"
      },
      {
        name: "Preparacion de otono",
        category: "Reparacion",
        month: "Agosto 2024",
        image: "https://picsum.photos/seed/autumn/590/640"
      }
    ]
  },
  experience: {
    subtitle: "La experiencia",
    title: "Más que una caja. Un reinicio mensual",
    topBody: "No es solo un envío. Es una experiencia pensada para que tu rutina fluya sin esfuerzo.",
    ctaButton: {
      label: "Quiero vivir esta experiencia",
      href: "#pricing"
    },
    closing: {
      overline: "Tu rutina empieza aquí",
      title: "Simple. Claro.",
      highlight: "Tuyo.",
      body: "Sin complicaciones. Sin excesos. Solo lo que necesitas, cuando lo necesitas.",
      ctaLabel: "Comenzar",
      ctaHref: "#pricing"
    },
    steps: [
      {
        number: "1",
        title: "Llega cuando lo esperas",
        description: "Sin incertidumbre. Sin perseguir envíos. Se integra naturalmente en tu mes."
      },
      {
        number: "2",
        title: "Todo tiene un propósito",
        description: "Cada producto cumple una función dentro de la rutina. Nada sobra. Nada confunde."
      },
      {
        number: "3",
        title: "Sabes exactamente cómo usarlo",
        description: "Instrucciones claras. Pasos simples. Sin presión por hacerlo perfecto."
      },
      {
        number: "4",
        title: "La rutina se completa. Justo a tiempo para tu siguiente mes",
        description: "Usas lo necesario. Sin acumulación. La continuidad se vuelve parte de tu cuidado."
      }
    ]
  },
  deliveryWindows: {
    title: "Cuando recibiré mi skincare?",
    description: "Elige la fecha de tu suscripción para ver tus próximas 6 ventanas de envío. Las cajas se envían cada 2 meses, según la quincena en la que te unas.",
    datePickerLabel: "Fecha de suscripción",
    subscriptionGroupLabel: "Te tocaría recibir en:",
    firstHalf: "Primera quincena",
    secondHalf: "Segunda quincena",
    deliveryListHeading: "Tus próximas 6 ventanas de envío",
    windowFormatFirst: "Primera mitad de {month} {year}",
    windowFormatSecond: "Segunda mitad de {month} {year}"
  },
  testimonials: {
    subtitleEmoji: "⭐",
    subtitle: "Trusted by Skincare Enthusiasts",
    fallbackAvatar: "https://placehold.co/100x100/E0E7FF/4338CA?text=Error",
    people: [
      {
        id: 1,
        name: "Albert Einstein",
        role: "Theoretical Physicist",
        email: "einstein@example.com",
        quote: "“The most beautiful experience we can have is the mysterious.”",
        profile: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg"
      },
      {
        id: 2,
        name: "Isaac Newton",
        role: "Physicist & Mathematician",
        email: "newton@example.com",
        quote: "“Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.”",
        profile: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/1200px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg"
      },
      {
        id: 3,
        name: "Marie Curie",
        role: "Physicist & Chemist",
        email: "curie@example.com",
        quote: "“Nothing in life is to be feared, it is only to be understood.”",
        profile: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Marie_Curie_c1920.jpg"
      },
      {
        id: 4,
        name: "Nikola Tesla",
        role: "Inventor & Engineer",
        email: "tesla@example.com",
        quote: "“If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.”",
        profile: "https://upload.wikimedia.org/wikipedia/commons/d/d4/N.Tesla.JPG"
      },
      {
        id: 5,
        name: "Charles Darwin",
        role: "Naturalist & Biologist",
        email: "darwin@example.com",
        quote: "“In the long history of humankind those who learned to collaborate and improvise most effectively have prevailed.”",
        profile: "https://hips.hearstapps.com/hmg-prod/images/gettyimages-79035252.jpg?crop=1xw:1.0xh;center,top&resize=640:*"
      },
      {
        id: 6,
        name: "Galileo Galilei",
        role: "Astronomer & Physicist",
        email: "galileo@example.com",
        quote: "“Wine is sunlight, held together by water.”",
        profile: "https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/galileo-galilei-gettyimages-51246872?_a=BAVAZGDX0"
      },
      {
        id: 7,
        name: "Stephen Hawking",
        role: "Theoretical Physicist",
        email: "hawking@example.com",
        quote: "“Intelligence is the ability to adapt to change.”",
        profile: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg"
      },
      {
        id: 8,
        name: "Richard Feynman",
        role: "Theoretical Physicist",
        email: "feynman@example.com",
        quote: "“The pleasure of finding things out is the greatest joy of science.”",
        profile: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiz7DeuUmHN7TiT3xf7cV7UPBJNDtEvjNZcgMmNElTmOJYaec6zQI0UiLU04jZP6hqkeLcrnaC5NP4WC_zRQzP3_QhLumNxyzPOsC-WEmWQyYsadq1Eg_V_jEjDfCdddeQgJjY_OOB1KLMj6o2ShA6ycHwM91I430Yr9tkYTn6759jDmcGAsONOACbi/w1200-h630-p-k-no-nu/richard%20feynman%20quotes%20atheism%20religion%20science.png"
      }
    ],
    items: [
      {
        quote: "Finally, a skincare routine that doesn't overwhelm me. Everything just works together.",
        author: "Sarah M."
      },
      {
        quote: "I've tried so many products, but this is the first time I've actually stuck with a routine.",
        author: "Jessica L."
      },
      {
        quote: "No more decision fatigue. My skin has never looked better.",
        author: "Emily K."
      }
    ]
  },
  pricing: {
    subtitle: "Elige tu experiencia",
    title: "Tu ritual, a tu medida",
    plans: [
      {
        id: "gift",
        name: "Kumi Gift",
        emoji: "🎁",
        priceAmount: "$899",
        pricePeriod: "1 vez",
        description: "Perfecta para descubrir la experiencia Kumi",
        features: [
          "3 ó 4 productos full size",
          "Guía de rutina paso a paso",
          "Empaque especial de regalo"
        ],
        badge: null,
        ctaButton: "Regalar ahora",
        accentColor: "lavender"
      },
      {
        id: "monthly",
        name: "Kumi Essential",
        emoji: "✨",
        priceAmount: "$1199",
        pricePeriod: "/ cada 2 meses",
        description: "La rutina ideal para resultados consistentes",
        features: [
          "5 productos complementarios",
          "Rutina completa sin repeticiones",
          "Tamaños que duran hasta tu próxima caja",
          "Envío incluido"
        ],
        badge: "Más popular 🔥",
        ctaButton: "Comenzar mi rutina",
        accentColor: "peach"
      },
      {
        id: "premium",
        name: "Kumi Ritual",
        emoji: "👑",
        priceAmount: "$1799",
        pricePeriod: "/ cada 2 meses",
        description: "Para las obsesionadas del K-beauty",
        features: [
          "Todo lo de Kumi Essential",
          "2 ó 3 productos adicionales",
          "Acceso a ediciones limitadas",
          "Descuento exclusivo en tienda",
          "Envío prioritario"
        ],
        badge: "Mejor valor 💎",
        ctaButton: "Unirme al club",
        accentColor: "mint"
      }
    ],
    shippingLabel: "Envío",
    shippingValue: "Incluido",
    commitmentLabel: "Compromiso",
    commitmentValue: "Ninguno"
  },
  faq: {
    subtitle: "Preguntas",
    title: "Preguntas frecuentes, respuestas claras",
    items: [
      {
        question: "¿Los productos están personalizados para mi tipo de piel?",
        answer: "Cada caja está diseñada como una rutina universal, equilibrada y suave, pensada para la mayoría de pieles sanas. En lugar de complejidad, priorizamos compatibilidad y claridad."
      },
      {
        question: "¿Son tamaño completo o muestras?",
        answer: "Los tamaños pueden variar. Lo importante es la duración: cada producto está pensado para durar hasta que llegue tu siguiente caja con un uso normal. Nunca recibirás dos productos de un solo uso."
      },
      {
        question: "¿Recibiré el mismo tipo de producto dos veces?",
        answer: "No. Cada caja incluye 4 ó 5 categorías de productos distintas que funcionan como una sola rutina. No repetimos categorías en la misma caja."
      },
      {
        question: "¿Y si un producto no me funciona?",
        answer: "Priorizamos skincare suave y de uso diario para minimizar irritación e incompatibilidad. Si algo no te convence, escríbenos: estamos para ayudarte."
      },
      {
        question: "¿Cuándo se envía mi caja?",
        answer: "Las cajas se envían cada 2 meses en una fecha previsible. Recibirás el seguimiento en cuanto tu caja esté en camino."
      },
      {
        question: "¿Puedo cancelar o saltarme un mes?",
        answer: "Sí. Puedes cancelar cuando quieras o saltarte un mes si lo necesitas: sin penalizaciones ni preguntas."
      },
      {
        question: "¿Hay compromiso a largo plazo?",
        answer: "No. Tu suscripción es mes a mes."
      },
      {
        question: "¿Los productos son seguros para usarlos juntos?",
        answer: "Sí. Cada caja está pensada como una rutina coherente, no como una mezcla aleatoria de productos."
      }
    ]
  },
  finalCta: {
    title: "¿Lista para simplificar tu skincare?",
    descriptionPrimary: "Una rutina completa. En tu puerta cada que lo necesitas.",
    descriptionSecondary: "Diseñada para usarse — no para olvidarse.",
    ctaButton: {
      label: "Quiero unirme",
      href: "#pricing"
    },
    footer: "Cancela cuando quieras · Sin compromisos · Envíos cada 2 meses"
  },
  footer: {
    mission: {
      title: "Kumi",
      description: "Rutinas de skincare con sentido, entregadas con intención."
    },
    navigate: {
      title: "Navegar",
      links: [
        {
          label: "Tienda",
          href: "#pricing"
        },
        {
          label: "Nuestra historia",
          href: "#why"
        },
        {
          label: "Cómo funciona",
          href: "#how-it-works"
        },
        {
          label: "Preguntas",
          href: "#faq"
        },
        {
          label: "Envíos",
          href: "#"
        }
      ]
    },
    connect: {
      title: "Conectar",
      links: [
        {
          label: "Instagram",
          href: "https://www.instagram.com/kumibox.mx/"
        },
        {
          label: "TikTok",
          href: "https://www.tiktok.com/@kumibox.mx"
        }
      ]
    },
    newsletter: {
      title: "Mantente al día",
      placeholder: "tu@correo.com"
    },
    bottomBar: {
      copyright: "© 2026 Kumi. Todos los derechos reservados.",
      links: [
        {
          label: "Privacidad",
          href: "privacy"
        },
        {
          label: "Términos",
          href: "/terms"
        },
        {
          label: "Accesibilidad",
          href: "#"
        }
      ]
    }
  },
  privacy: {
    contactEmail: "contacto@kumibox.com"
  },
  terms: {
    contactEmail: "soporte@kumibox.com"
  },
  login: {
    title: "Bienvenida de nuevo",
    subtitle: "Inicia sesion en tu cuenta de KumiBox",
    emailLabel: "Correo electronico",
    emailPlaceholder: "tu@correo.com",
    passwordLabel: "Contrasena",
    passwordPlaceholder: "••••••••",
    rememberMe: "Recordarme",
    forgotPassword: "Olvidaste tu contrasena?",
    forgotPasswordHref: "/forgot-password",
    submitButton: "Iniciar sesion",
    submitLoading: "Iniciando sesion...",
    noAccountText: "Todavia no tienes una cuenta?",
    signUpLink: "Registrarme",
    signUpHref: "/register",
    socialDividerText: "o continua con",
    googleButton: "Continuar con Google",
    facebookButton: "Continuar con Facebook",
    socialErrorGeneric: "No se pudo iniciar sesion con este proveedor. Intenta de nuevo.",
    errorTitle: "Error al iniciar sesion",
    errorGeneric: "Correo electronico o contrasena invalidos. Intenta de nuevo."
  },
  register: {
    title: "Crear cuenta",
    subtitle: "Registrate para comenzar tu experiencia con KumiBox",
    nameLabel: "Nombre (opcional)",
    namePlaceholder: "Tu nombre",
    emailLabel: "Correo electronico",
    emailPlaceholder: "tu@correo.com",
    passwordLabel: "Contrasena",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirmar contrasena",
    confirmPasswordPlaceholder: "••••••••",
    submitButton: "Crear cuenta",
    submitLoading: "Creando cuenta...",
    alreadyHaveAccount: "Ya tienes una cuenta?",
    signInLink: "Iniciar sesion",
    signInHref: "/login",
    socialDividerText: "o continua con",
    googleButton: "Continuar con Google",
    facebookButton: "Continuar con Facebook",
    socialErrorGeneric: "No se pudo iniciar sesion con este proveedor. Intenta de nuevo.",
    errorTitle: "Error al registrarte",
    errorGeneric: "No se pudo completar el registro. Intenta de nuevo."
  },
  forgotPassword: {
    title: "Restablecer contrasena",
    subtitle: "Ingresa tu correo electronico y te enviaremos un enlace para restablecer tu contrasena.",
    emailLabel: "Correo electronico",
    emailPlaceholder: "tu@correo.com",
    submitButton: "Enviar enlace de recuperacion",
    submitLoading: "Enviando...",
    rememberPassword: "Ya recordaste tu contrasena?",
    signInLink: "Iniciar sesion",
    signInHref: "/login",
    successTitle: "Revisa tu correo",
    successMessage: "Te enviamos un enlace para restablecer tu contrasena. Revisa tu bandeja de entrada y sigue las instrucciones.",
    backToLogin: "Volver a iniciar sesion",
    errorTitle: "No se pudo enviar el enlace",
    errorGeneric: "No se pudo enviar el correo de recuperacion. Intenta de nuevo."
  },
  resetPassword: {
    title: "Definir nueva contrasena",
    subtitle: "Ingresa tu nueva contrasena aqui abajo.",
    newPasswordLabel: "Nueva contrasena",
    newPasswordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirmar contrasena",
    confirmPasswordPlaceholder: "••••••••",
    submitButton: "Restablecer contrasena",
    submitLoading: "Restableciendo...",
    backToLogin: "Volver a iniciar sesion",
    backToLoginHref: "/login",
    successTitle: "Contrasena actualizada",
    successMessage: "Tu contrasena ya se actualizo. Redirigiendo al inicio de sesion...",
    goToLogin: "Ir a iniciar sesion",
    errorTitle: "No se pudo restablecer la contrasena",
    errorInvalidLink: "El enlace es invalido o ya expiro. Solicita uno nuevo.",
    errorGeneric: "No se pudo restablecer la contrasena. Intenta de nuevo."
  },
  dashboard: {
    welcomeTitle: "Bienvenida de nuevo",
    emailLabel: "Correo electronico",
    nameLabel: "Nombre",
    memberSinceLabel: "Miembro desde",
    subscriptionLabel: "Suscripcion",
    subscriptionActive: "Activa",
    subscriptionInactive: "Inactiva",
    nextBoxLabel: "Proxima caja",
    accountInfoTitle: "Informacion de la cuenta",
    editProfileTitle: "Editar perfil",
    editProfileButton: "Editar perfil",
    profileNameLabel: "Nombre visible",
    profileNamePlaceholder: "Tu nombre",
    saveProfile: "Guardar cambios",
    saveProfileLoading: "Guardando...",
    cancelEdit: "Cancelar",
    profileUpdatedSuccess: "Perfil actualizado correctamente.",
    profileUpdateError: "No se pudo actualizar el perfil. Intenta de nuevo.",
    changePasswordLabel: "Cambiar contrasena",
    changePasswordHref: "/forgot-password",
    quickActionsTitle: "Acciones rapidas",
    orderHistoryTitle: "Historial de pedidos",
    orderHistoryDesc: "Revisa tus pedidos anteriores",
    subscriptionActionTitle: "Suscripcion",
    subscriptionActionDesc: "Administra tu plan",
    settingsTitle: "Configuracion",
    settingsDesc: "Preferencias de la cuenta",
    notificationsTitle: "Notificaciones",
    notificationsDesc: "Administra tus alertas",
    logOut: "Cerrar sesion",
    backToHome: "Volver al inicio",
    orderHistoryHref: "/orders",
    subscriptionActionHref: "/subscription",
    settingsHref: "/settings",
    notificationsHref: "/notifications"
  },
  orderHistory: {
    title: "Historial de pedidos",
    subtitle: "Revisa tus pedidos anteriores de KumiBox.",
    emptyStateTitle: "Aun no hay pedidos",
    emptyStateDescription: "Cuando hagas tu primer pedido, aparecera aqui con su estado, fecha y detalles.",
    orderDateColumn: "Fecha",
    orderSummaryColumn: "Pedido",
    statusColumn: "Estado",
    statusCompleted: "Completado",
    statusPending: "Pendiente",
    statusCancelled: "Cancelado"
  },
  subscriptionManagement: {
    title: "Suscripcion",
    subtitle: "Administra tu plan de KumiBox.",
    body: "Aqui podras ver tu plan actual, la fecha de tu proxima renovacion y las opciones para pausar, cancelar o cambiar tu suscripcion.",
    currentPlanLabel: "Plan actual",
    nextRenewalLabel: "Proxima renovacion",
    planStartedLabel: "Inicio del plan",
    pausePlan: "Pausar plan",
    cancelPlan: "Cancelar suscripcion",
    changePlan: "Cambiar plan"
  },
  settings: {
    title: "Configuracion",
    subtitle: "Ajusta las preferencias de tu cuenta.",
    body: "Actualiza opciones como idioma, preferencias de comunicacion y otros detalles que personalizan tu experiencia."
  },
  notifications: {
    title: "Notificaciones",
    subtitle: "Controla como KumiBox se mantiene en contacto contigo.",
    body: "Elige que actualizaciones quieres recibir sobre pedidos, cambios en tu suscripcion y novedades de producto.",
    orderUpdatesLabel: "Actualizaciones de pedidos",
    orderUpdatesDesc: "Novedades de envio y entrega para tus cajas",
    subscriptionChangesLabel: "Cambios en la suscripcion",
    subscriptionChangesDesc: "Renovaciones, cambios de plan y cobros",
    productNewsLabel: "Novedades de producto",
    productNewsDesc: "Productos nuevos, consejos y ofertas"
  },
  checkout: {
    title: "Completa tu pedido",
    subtitle: "Estás a un paso de comenzar tu ritual ✨",
    backLink: "← Volver a planes",
    orderSummary: "Resumen de tu pedido",
    contactTitle: "Información de contacto",
    nameLabel: "Nombre completo",
    namePlaceholder: "Tu nombre",
    emailLabel: "Correo electronico",
    emailPlaceholder: "tu@correo.com",
    addressTitle: "Dirección de envío",
    addressLabel: "Dirección",
    addressPlaceholder: "Calle, número, colonia",
    cityLabel: "Ciudad",
    cityPlaceholder: "Tu ciudad",
    stateLabel: "Estado",
    statePlaceholder: "Tu estado",
    zipLabel: "Código postal",
    zipPlaceholder: "00000",
    payButton: "Confirmar pedido 🎉",
    payButtonSaving: "Redirigiendo a pago seguro…",
    secureNote: "🔒 Pago seguro · Tus datos están protegidos",
    saveOrderError: "No se pudo iniciar el pago. Intenta de nuevo o contacta soporte.",
    stripeError: "Error al conectar con el pago. Intenta de nuevo.",
    successTitle: "¡Pedido confirmado! 🎊",
    successMessage: "Tu caja está en camino. Revisa tu correo para los detalles.",
    cancelTitle: "Pago cancelado",
    cancelMessage: "Has cancelado el pago. Puedes volver a intentar cuando quieras.",
    cancelBackToCheckout: "Volver al checkout",
    cancelBackToPricing: "Ver planes",
    loginRequiredMessage: "Inicia sesión para continuar con este plan."
  },
  account: {
    title: "Cuenta",
    subtitle: "Administra tu perfil, seguridad y preferencias.",
    profileTitle: "Resumen del perfil",
    profileDesc: "Consulta los detalles de tu cuenta. Edita tu nombre y correo desde el panel.",
    emailLabel: "Correo electronico",
    nameLabel: "Nombre",
    memberSinceLabel: "Miembro desde",
    editProfileLabel: "Editar perfil",
    editProfileHref: "/dashboard",
    securityTitle: "Seguridad",
    securityDesc: "Manten tu cuenta protegida.",
    changePasswordLabel: "Cambiar contrasena",
    changePasswordHref: "/forgot-password",
    preferencesTitle: "Preferencias",
    preferencesDesc: "Opciones de notificaciones y visualizacion (proximamente).",
    backToDashboard: "Volver al panel",
    backToDashboardHref: "/dashboard",
    placeholder: "Cuenta protegida. Agrega aqui tu flujo."
  }
} as const;

export type AppRegistry = typeof APP_REGISTRY;
