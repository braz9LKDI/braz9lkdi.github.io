document.addEventListener("DOMContentLoaded", () => {
  const currentLanguage = localStorage.getItem("language") || "es";

  const translations = {
    en: {
      // Navigation
      "nav-home": "home",
      "nav-blog": "blog",
      "nav-contact": "contact",

      // Hero section
      "hero-greeting": "Hi, I am",
      "hero-desc":
        "I am a Systems Engineer student with a deep passion for Linux, Open Source and programming.",

      // Projects section
      "projects-title": "Projects",
      "portfolio-title": "Portfolio",
      "portfolio-desc": "Website showcasing my projects and skills.",
      "project-code": "Code",
      "project-live": "Live",

      // Contact section
      "contact-title": "Contact",
      "contact-name": "Name",
      "contact-email": "Email",
      "contact-message": "Message",
      "contact-send": "Send",

      // Footer
      footer: "Created by Brandon",
    },
    es: {
      // Navigation
      "nav-home": "inicio",
      "nav-blog": "blog",
      "nav-contact": "contactos",

      // Hero section
      "hero-greeting": "Hola, soy",
      "hero-desc":
        "Soy un estudiante de Ingeniería de Sistemas, me apasiona profundamente Linux, el código abierto y la programación.",

      // Projects section
      "projects-title": "Proyectos",
      "portfolio-title": "Portafolio",
      "portfolio-desc": "Sitio web que muestra mis proyectos y habilidades.",
      "project-code": "Código",
      "project-live": "Demo",

      // Contact section
      "contact-title": "Contacto",
      "contact-name": "Nombre",
      "contact-email": "Correo",
      "contact-message": "Mensaje",
      "contact-send": "Enviar",

      // Footer
      footer: "Creado por Brandon",
    },
  };

  const initializeLanguageElements = () => {
    // Navigation
    document.querySelector("a[href='/'] span").setAttribute("data-lang", "nav-home");
    document.querySelector("a[href='#contact'] span").setAttribute("data-lang", "nav-contact");

    // Hero section
    document
      .querySelector(".hero-section .typewriter div span")
      .setAttribute("data-lang", "hero-greeting");
    document.querySelector(".hero-section .text > p").setAttribute("data-lang", "hero-desc");

    // Project section
    document.querySelector(".projects-section h2").setAttribute("data-lang", "projects-title");
    document
      .querySelector("#portfolio .project-info h3")
      .setAttribute("data-lang", "portfolio-title");
    document
      .querySelector("#portfolio .project-info p")
      .setAttribute("data-lang", "portfolio-desc");

    document.querySelectorAll(".project-links a").forEach((link) => {
      const linkText = link.textContent;

      if (linkText.includes("Code")) {
        const targetElement = link.querySelector("span") || link;
        targetElement.setAttribute("data-lang", "project-code");
      } else if (linkText.includes("Live")) {
        const targetElement = link.querySelector("span") || link;
        targetElement.setAttribute("data-lang", "project-live");
      }
    });

    // Contact section
    document.querySelector(".contact-section h2").setAttribute("data-lang", "contact-title");
    document.querySelector("label[for='name']").setAttribute("data-lang", "contact-name");
    document.querySelector("label[for='email']").setAttribute("data-lang", "contact-email");
    document.querySelector("label[for='message']").setAttribute("data-lang", "contact-message");
    document
      .querySelector(".contact-section form button")
      .setAttribute("data-lang", "contact-send");

    // Footer
    document.querySelector("footer p").setAttribute("data-lang", "footer");
  };

  const setLanguage = (lang) => {
    document.querySelectorAll("[data-lang]").forEach((e) => {
      const key = e.getAttribute("data-lang");
      if (translations[lang][key]) {
        e.textContent = translations[lang][key];
      }
    });
    document.getElementById("current-lang").textContent = lang.toUpperCase();
    localStorage.setItem("language", lang);
  };

  const toggleLanguage = () => {
    const currentLang = localStorage.getItem("language") || "en";
    const newLang = currentLang === "en" ? "es" : "en";
    setLanguage(newLang);
  };

  initializeLanguageElements();
  setLanguage(currentLanguage);

  document.getElementById("language-btn").addEventListener("click", toggleLanguage);
});
