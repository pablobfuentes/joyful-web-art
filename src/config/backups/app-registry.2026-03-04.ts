/**
 * App Registry – single source of truth for all user-facing text.
 * See docs/WEBSITE_TEXT_CONTENT.md for inventory.
 * No hardcoded strings in components; components receive data from here.
 */

export const APP_REGISTRY = {
  nav: {
    logoText: "KumiBox",
    logoEmoji: "🦊",
    announcementBar: "¡Envío GRATIS a todo México!",
    announcementBarEmoji: "",
    links: [
      {
        label: "Tienda",
        href: "#how-it-works"
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
    ctaButton: "Quiero acceso anticipado"
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
        description: "Limpia · Hidrata · Trata · Protege — productos diseñados para trabajar juntos"
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
    description: "Cinco productos coreanos. Una rutina completa. Diseñada para acompañarte hasta tu próxima entrega.",
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
    subtitle: "Past Editions",
    title: "See what we've curated",
    /** Fallback image URL when an edition has no image or load fails. */
    fallbackImage: "https://placehold.co/590x640/e8e4de/2d2620?text=Past+Edition",
    editions: [
      {
        name: "Hydration Boost",
        category: "Moisturizing",
        month: "January 2024",
        image: "https://picsum.photos/seed/hydration/590/640"
      },
      {
        name: "Glow Essentials",
        category: "Brightening",
        month: "February 2024",
        image: "https://picsum.photos/seed/glow/590/640"
      },
      {
        name: "Barrier Repair",
        category: "Repair",
        month: "March 2024",
        image: "https://picsum.photos/seed/barrier/590/640"
      },
      {
        name: "Gentle Cleanse",
        category: "Cleansing",
        month: "April 2024",
        image: "https://picsum.photos/seed/cleanse/590/640"
      },
      {
        name: "Summer Glow",
        category: "Protection",
        month: "May 2024",
        image: "https://picsum.photos/seed/summer/590/640"
      },
      {
        name: "Deep Hydration",
        category: "Moisturizing",
        month: "June 2024",
        image: "https://picsum.photos/seed/deep/590/640"
      },
      {
        name: "Calming Routine",
        category: "Sensitive",
        month: "July 2024",
        image: "https://picsum.photos/seed/calming/590/640"
      },
      {
        name: "Autumn Prep",
        category: "Repair",
        month: "August 2024",
        image: "https://picsum.photos/seed/autumn/590/640"
      }
    ]
  },
  experience: {
    subtitle: "The Experience",
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
  testimonials: {
    subtitleEmoji: "⭐",
    subtitle: "Trusted by Skincare Enthusiasts",
    fallbackAvatar: "https://placehold.co/100x100/E0E7FF/4338CA?text=Error",
    // Orbiting carousel people data (adapted from example)
    people: [
      {
        id: 1,
        name: "Albert Einstein",
        role: "Theoretical Physicist",
        email: "einstein@example.com",
        quote: "“The most beautiful experience we can have is the mysterious.”",
        profile:
          "https://upload.wikimedia.org/wikipedia/commons/d/d3/Albert_Einstein_Head.jpg"
      },
      {
        id: 2,
        name: "Isaac Newton",
        role: "Physicist & Mathematician",
        email: "newton@example.com",
        quote: "“Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.”",
        profile:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg/1200px-Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg"
      },
      {
        id: 3,
        name: "Marie Curie",
        role: "Physicist & Chemist",
        email: "curie@example.com",
        quote: "“Nothing in life is to be feared, it is only to be understood.”",
        profile:
          "https://upload.wikimedia.org/wikipedia/commons/7/7e/Marie_Curie_c1920.jpg"
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
        profile:
          "https://hips.hearstapps.com/hmg-prod/images/gettyimages-79035252.jpg?crop=1xw:1.0xh;center,top&resize=640:*"
      },
      {
        id: 6,
        name: "Galileo Galilei",
        role: "Astronomer & Physicist",
        email: "galileo@example.com",
        quote: "“Wine is sunlight, held together by water.”",
        profile:
          "https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/galileo-galilei-gettyimages-51246872?_a=BAVAZGDX0"
      },
      {
        id: 7,
        name: "Stephen Hawking",
        role: "Theoretical Physicist",
        email: "hawking@example.com",
        quote: "“Intelligence is the ability to adapt to change.”",
        profile:
          "https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg"
      },
      {
        id: 8,
        name: "Richard Feynman",
        role: "Theoretical Physicist",
        email: "feynman@example.com",
        quote: "“The pleasure of finding things out is the greatest joy of science.”",
        profile:
          "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiz7DeuUmHN7TiT3xf7cV7UPBJNDtEvjNZcgMmNElTmOJYaec6zQI0UiLU04jZP6hqkeLcrnaC5NP4WC_zRQzP3_QhLumNxyzPOsC-WEmWQyYsadq1Eg_V_jEjDfCdddeQgJjY_OOB1KLMj6o2ShA6ycHwM91I430Yr9tkYTn6759jDmcGAsONOACbi/w1200-h630-p-k-no-nu/richard%20feynman%20quotes%20atheism%20religion%20science.png"
      }
    ]
  },
  pricing: {
    subtitle: "Elige tu experiencia",
    title: "Tu ritual, a tu medida",
    plans: [
      {
        id: "gift",
        name: "Caja Regalo",
        emoji: "🎁",
        priceAmount: "$599",
        pricePeriod: "una vez",
        description: "Perfecta para regalar o probar la experiencia",
        features: [
          "5 productos coreanos premium",
          "Guía de rutina paso a paso",
          "Empaque especial de regalo"
        ],
        badge: null,
        ctaButton: "Regalar ahora",
        accentColor: "lavender"
      },
      {
        id: "monthly",
        name: "Suscripción Mensual",
        emoji: "✨",
        priceAmount: "$499",
        pricePeriod: "/ mes",
        description: "La forma más popular de cuidar tu piel",
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
        name: "Premium Anual",
        emoji: "👑",
        priceAmount: "$399",
        pricePeriod: "/ mes",
        description: "El mejor valor · Paga anual, ahorra más",
        features: [
          "Todo lo de la suscripción mensual",
          "2 productos extra cada caja",
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
        answer: "Sizes may vary. What matters is duration — each product is selected to last until your next box arrives with normal use. You'll never receive two single-use products."
      },
      {
        question: "Will I receive the same type of product twice?",
        answer: "No. Each box includes five different product categories that work together as one routine. No repeated categories in the same box."
      },
      {
        question: "What if a product doesn't work for me?",
        answer: "We focus on gentle, daily-use skincare to minimize irritation and incompatibility. If something feels off, reach out — we're here to help."
      },
      {
        question: "When does my box ship?",
        answer: "Boxes ship monthly, on a predictable schedule. You'll receive tracking information as soon as your box is on the way."
      },
      {
        question: "Can I cancel or skip a month?",
        answer: "Yes. You can cancel anytime or skip a month if you need to — no penalties, no questions asked."
      },
      {
        question: "Is there a long-term commitment?",
        answer: "No. Your subscription is month-to-month."
      },
      {
        question: "Are the products safe to use together?",
        answer: "Yes. Each box is built as a cohesive routine, not a random assortment of products."
      }
    ]
  },
  finalCta: {
    title: "Ready to simplify your skincare?",
    descriptionPrimary: "A complete routine. Delivered monthly.",
    descriptionSecondary: "Designed to be finished — not forgotten.",
    ctaButton: {
      label: "Reserve my spot",
      href: "#pricing"
    },
    footer: "Cancel anytime · No commitments · Ships monthly"
  },
  footer: {
    mission: {
      title: "Ritual",
      description: "Thoughtful skincare routines, delivered with intention."
    },
    navigate: {
      title: "Navigate",
      links: [
        {
          label: "Shop",
          href: "#"
        },
        {
          label: "Our Story",
          href: "#why"
        },
        {
          label: "How It Works",
          href: "#how-it-works"
        },
        {
          label: "FAQ",
          href: "#faq"
        },
        {
          label: "Shipping",
          href: "#"
        }
      ]
    },
    connect: {
      title: "Connect",
      links: [
        {
          label: "Instagram",
          href: "#"
        },
        {
          label: "TikTok",
          href: "#"
        }
      ]
    },
    newsletter: {
      title: "Stay Updated",
      placeholder: "your@email.com"
    },
    bottomBar: {
      copyright: "© 2025 Ritual. All rights reserved.",
      links: [
        {
          label: "Privacy",
          href: "#"
        },
        {
          label: "Terms",
          href: "#"
        },
        {
          label: "Accessibility",
          href: "#"
        }
      ]
    }
  },
  login: {
    title: "Welcome Back",
    subtitle: "Sign in to your KumiBox account",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    forgotPasswordHref: "/forgot-password",
    submitButton: "Sign In",
    noAccountText: "Don't have an account?",
    signUpLink: "Get Started",
    signUpHref: "/register",
    errorTitle: "Sign in failed",
    errorGeneric: "Invalid email or password. Please try again."
  },
  register: {
    title: "Create Account",
    subtitle: "Sign up to start your KumiBox journey",
    nameLabel: "Name (Optional)",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "••••••••",
    submitButton: "Create Account",
    submitLoading: "Creating account...",
    alreadyHaveAccount: "Already have an account?",
    signInLink: "Sign In",
    signInHref: "/login",
    errorTitle: "Registration failed",
    errorGeneric: "Registration failed. Please try again."
  },
  forgotPassword: {
    title: "Reset Password",
    subtitle: "Enter your email address and we'll send you a link to reset your password.",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    submitButton: "Send Reset Link",
    submitLoading: "Sending...",
    rememberPassword: "Remember your password?",
    signInLink: "Sign In",
    signInHref: "/login",
    successTitle: "Check your email",
    successMessage: "We've sent a password reset link to your email address. Please check your inbox and follow the instructions.",
    backToLogin: "Back to Login",
    errorTitle: "Unable to send reset link",
    errorGeneric: "Failed to send reset email. Please try again."
  },
  resetPassword: {
    title: "Set New Password",
    subtitle: "Enter your new password below.",
    newPasswordLabel: "New Password",
    newPasswordPlaceholder: "••••••••",
    confirmPasswordLabel: "Confirm Password",
    confirmPasswordPlaceholder: "••••••••",
    submitButton: "Reset Password",
    submitLoading: "Resetting...",
    backToLogin: "Back to Login",
    backToLoginHref: "/login",
    successTitle: "Password Reset Successful",
    successMessage: "Your password has been reset. Redirecting to login...",
    goToLogin: "Go to Login",
    errorTitle: "Password reset failed",
    errorInvalidLink: "Invalid or expired reset link. Please request a new password reset link.",
    errorGeneric: "Failed to reset password. Please try again."
  },
  dashboard: {
    welcomeTitle: "Welcome back",
    emailLabel: "Email",
    nameLabel: "Name",
    memberSinceLabel: "Member Since",
    subscriptionLabel: "Subscription",
    subscriptionActive: "Active",
    subscriptionInactive: "Inactive",
    nextBoxLabel: "Next Box",
    accountInfoTitle: "Account Information",
    editProfileTitle: "Edit profile",
    editProfileButton: "Edit profile",
    profileNameLabel: "Display name",
    profileNamePlaceholder: "Your name",
    saveProfile: "Save changes",
    saveProfileLoading: "Saving...",
    cancelEdit: "Cancel",
    profileUpdatedSuccess: "Profile updated successfully.",
    profileUpdateError: "Failed to update profile. Please try again.",
    changePasswordLabel: "Change password",
    changePasswordHref: "/forgot-password",
    quickActionsTitle: "Quick Actions",
    orderHistoryTitle: "Order History",
    orderHistoryDesc: "View past orders",
    subscriptionActionTitle: "Subscription",
    subscriptionActionDesc: "Manage your plan",
    settingsTitle: "Settings",
    settingsDesc: "Account preferences",
    notificationsTitle: "Notifications",
    notificationsDesc: "Manage alerts",
    logOut: "Log Out",
    backToHome: "Back to Home"
  },
  checkout: {
    title: "Completa tu pedido",
    subtitle: "Estás a un paso de comenzar tu ritual ✨",
    backLink: "← Volver a planes",
    orderSummary: "Resumen de tu pedido",
    contactTitle: "Información de contacto",
    nameLabel: "Nombre completo",
    namePlaceholder: "Tu nombre",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
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
    successMessage: "Tu caja está en camino. Revisa tu email para los detalles.",
    cancelTitle: "Pago cancelado",
    cancelMessage: "Has cancelado el pago. Puedes volver a intentar cuando quieras.",
    cancelBackToCheckout: "Volver al checkout",
    cancelBackToPricing: "Ver planes",
    loginRequiredMessage: "Inicia sesión para continuar con este plan."
  },
  account: {
    title: "Account",
    placeholder: "Account — protected. Add your flow here."
  }
} as const;

export type AppRegistry = typeof APP_REGISTRY;
