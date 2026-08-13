document.addEventListener('DOMContentLoaded', () => {
  const currentLanguage = localStorage.getItem('language') || 'es';

  const translations = {
    en: {
      // Navigation
      'nav-home': 'home',
      'nav-blog': 'blog',
      'nav-contact': 'contact',

      // Hero section
      'hero-greeting': 'Hi, I am',
      'hero-desc-profile':
        'Systems Engineering student with hands-on experience in full-stack development, data automation and software delivery.',
      'hero-desc-experience':
        'At Endava, I contributed to an internal analytics MVP using Python, .NET 8, React, TypeScript, PostgreSQL and Docker, working across requirements analysis, data-flow modeling, backlog definition and maintainable solution development within Scrum. I also mentored first-semester students in programming fundamentals, Git, Docker and independent learning, with a strong interest in open-source culture.',
      'hero-desc-joke': 'Also: I use Arch, btw. Responsibly? Debatable.',

      // Projects section
      'projects-title': 'Projects',
      'project-code': 'Code',
      'project-live': 'Live',

      // Contact section
      'contact-title': 'Contact',
      'contact-name': 'Name',
      'contact-email': 'Email',
      'contact-message': 'Message',
      'contact-send': 'Send',

      // Footer
      footer: 'Created by Brandon',
    },
    es: {
      // Navigation
      'nav-home': 'inicio',
      'nav-blog': 'blog',
      'nav-contact': 'contactos',

      // Hero section
      'hero-greeting': 'Hola, soy',
      'hero-desc-profile':
        'Estudiante de Ingeniería de Sistemas con experiencia práctica en desarrollo full-stack, automatización de datos y software delivery.',
      'hero-desc-experience':
        'En Endava, colaboré en un MVP de análisis interno utilizando Python, .NET 8, React, TypeScript, PostgreSQL y Docker, trabajando en el análisis de requisitos, el modelado de flujos de datos, la definición del backlog y el desarrollo de soluciones mantenibles dentro del método Scrum. También fui mentor de estudiantes de primer semestre en fundamentos de programación, Git, Docker y aprendizaje autónomo, mostrando un gran interés por la cultura del código abierto.',
      'hero-desc-joke': 'También: I use Arch, btw. ¿Responsablemente? Discutible.',

      // Projects section
      'projects-title': 'Proyectos',
      'project-code': 'Código',
      'project-live': 'Demo',

      // Contact section
      'contact-title': 'Contacto',
      'contact-name': 'Nombre',
      'contact-email': 'Correo',
      'contact-message': 'Mensaje',
      'contact-send': 'Enviar',

      // Footer
      footer: 'Creado por Brandon',
    },
  };

  const setLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach((e) => {
      const key = e.getAttribute('data-lang');
      if (translations[lang][key]) {
        e.textContent = translations[lang][key];
      } else {
        console.warn(`Missing translation for key: ${lang}.${key}`);
      }
    });
    document.getElementById('current-lang').textContent = lang.toUpperCase();
    localStorage.setItem('language', lang);

    document.querySelectorAll('[data-en]').forEach((e) => {
      e.textContent = e.dataset[lang];
    });
  };

  const toggleLanguage = () => {
    const currentLang = localStorage.getItem('language') || 'es';
    const newLang = currentLang === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  setLanguage(currentLanguage);

  document.getElementById('language-btn').addEventListener('click', toggleLanguage);
});
