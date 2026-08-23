document.addEventListener('DOMContentLoaded', () => {
  let lang = localStorage.getItem('language') || 'es';

  const translations = {
    en: {
      'name-required': 'Name is required',
      'email-invalid': 'Please enter a valid email address',
    },
    es: {
      'name-required': 'El nombre es requerido',
      'email-invalid': 'Por favor ingresa un correo electonico válido',
    },
  };

  const contactForm = document.querySelector('#contact form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');

  const createErrorElement = () => {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';

    return errorElement;
  };
  const nameError = createErrorElement();
  const emailError = createErrorElement();

  nameInput.insertAdjacentElement('afterend', nameError);
  emailInput.insertAdjacentElement('afterend', emailError);

  /**
   * Validates the name field and shows or clears its error message.
   *
   * The message is written into the DOM as a side effect, so callers that only need the boolean
   * still update the visible error state.
   *
   * @returns {boolean}: true when the field holds a non-blank value.
   */
  const validateName = () => {
    if (nameInput.value.trim() === '') {
      nameError.textContent = translations[lang]['name-required'];
      return false;
    }
    nameError.textContent = '';
    return true;
  };

  /**
   * Validates the email field and shows or clears its error message.
   *
   * The pattern only checks for `text@text.text`. It is a typo catcher, not an RFC 5322 validator,
   * and deliberately stays permissive: real delivery is confirmed by the form backend, so a stricter
   * rule here would reject valid addresses for no gain.
   *
   * The message is written into the DOM as a side effect.
   *
   * @returns {boolean}: true when the field holds a plausible address.
   */
  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(emailInput.value.trim())) {
      emailError.textContent = translations[lang]['email-invalid'];
      return false;
    }
    emailError.textContent = '';
    return true;
  };
  // Real-time validation
  nameInput.addEventListener('blur', validateName);
  nameInput.addEventListener('input', validateName);
  emailInput.addEventListener('blur', validateEmail);
  emailInput.addEventListener('input', validateEmail);

  contactForm.addEventListener('submit', (e) => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();

    if (!isNameValid || !isEmailValid) {
      e.preventDefault();
      return;
    }
  });

  document.getElementById('language-btn').addEventListener('click', () => {
    lang = lang === 'en' ? 'es' : 'en';
    if (nameError.textContent) {
      validateName();
    }
    if (emailError.textContent) {
      validateEmail();
    }
  });
});
