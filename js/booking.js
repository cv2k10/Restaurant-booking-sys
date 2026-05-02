/* ============================================================
   MAISON DORÉE — BOOKING JS
   WhatsApp-only booking: form validation + URL builder
   ============================================================ */

(function () {
  'use strict';

  const form        = document.getElementById('booking-form');
  const submitBtn   = document.getElementById('booking-submit');
  const successDiv  = document.getElementById('booking-success');
  const fieldsDiv   = document.getElementById('booking-fields');

  if (!form) return;

  /* ---------- Validation rules ---------- */

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[\d\s\+\-\(\)]{7,20}$/;

  function getFieldValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function validateForm() {
    const data = {
      firstName:       getFieldValue('booking-first-name'),
      lastName:        getFieldValue('booking-last-name'),
      email:           getFieldValue('booking-email'),
      phone:           getFieldValue('booking-phone'),
      date:            getFieldValue('booking-date'),
      time:            getFieldValue('booking-time'),
      partySize:       getFieldValue('booking-party-size'),
      specialRequests: getFieldValue('booking-special-requests'),
    };

    const errors = {};

    if (!data.firstName || data.firstName.length < 2) {
      errors['booking-first-name'] = 'Please enter your first name (at least 2 characters).';
    }
    if (!data.lastName || data.lastName.length < 2) {
      errors['booking-last-name'] = 'Please enter your last name (at least 2 characters).';
    }
    if (!data.email || !EMAIL_RE.test(data.email)) {
      errors['booking-email'] = 'Please enter a valid email address.';
    }
    if (!data.phone || !PHONE_RE.test(data.phone)) {
      errors['booking-phone'] = 'Please enter a valid phone number.';
    }
    if (!data.date) {
      errors['booking-date'] = 'Please select a date.';
    } else {
      const selected = new Date(data.date);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors['booking-date'] = 'Please select a future date.';
      } else if (selected.getDay() === 1) {
        errors['booking-date'] = 'We are closed on Mondays. Please choose another day.';
      }
    }
    if (!data.time) {
      errors['booking-time'] = 'Please select a preferred time.';
    }
    if (!data.partySize) {
      errors['booking-party-size'] = 'Please select the number of guests.';
    }

    return { data: data, errors: errors, valid: Object.keys(errors).length === 0 };
  }

  /* ---------- Display / clear error messages ---------- */

  function showErrors(errors) {
    /* Clear all existing errors first */
    document.querySelectorAll('.form-error').forEach(function (el) {
      el.textContent = '';
      el.classList.remove('visible');
    });
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (el) {
      el.classList.remove('error');
    });

    Object.keys(errors).forEach(function (fieldId) {
      const errorEl = document.getElementById(fieldId + '-error');
      const inputEl = document.getElementById(fieldId);
      if (errorEl) {
        errorEl.textContent = errors[fieldId];
        errorEl.classList.add('visible');
      }
      if (inputEl) {
        inputEl.classList.add('error');
      }
    });
  }

  function clearFieldError(fieldId) {
    const errorEl = document.getElementById(fieldId + '-error');
    const inputEl = document.getElementById(fieldId);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
    if (inputEl) inputEl.classList.remove('error');
  }

  /* Real-time error clearing on input */
  form.querySelectorAll('input, select, textarea').forEach(function (el) {
    el.addEventListener('input',  function () { clearFieldError(el.id); });
    el.addEventListener('change', function () { clearFieldError(el.id); });
  });

  /* ---------- WhatsApp URL builder ---------- */

  function buildWhatsAppMessage(data) {
    var lines = [
      'Hello! I\'d like to book a table at ' + RESTAURANT.name + '.',
      '',
      'Name: ' + data.firstName + ' ' + data.lastName,
      'Date: ' + formatDate(data.date),
      'Time: ' + data.time,
      'Party size: ' + data.partySize + (data.partySize === '1' ? ' guest' : ' guests'),
      'Phone: ' + data.phone,
      'Email: ' + data.email,
    ];

    if (data.specialRequests) {
      lines.push('Special requests: ' + data.specialRequests);
    }

    lines.push('', 'Please confirm availability. Thank you!');
    return lines.join('\n');
  }

  function buildWhatsAppUrl(phone, message) {
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric',
    });
  }

  /* ---------- Form submission ---------- */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const result = validateForm();

    if (!result.valid) {
      showErrors(result.errors);
      /* Scroll to first error */
      const firstError = form.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    /* Build WhatsApp URL */
    const message = buildWhatsAppMessage(result.data);
    const url     = buildWhatsAppUrl(RESTAURANT.whatsappNumber, message);

    /* Open WhatsApp */
    window.open(url, '_blank', 'noopener,noreferrer');

    /* Show success state */
    showSuccess();
  });

  function showSuccess() {
    if (fieldsDiv)  fieldsDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'block';
  }

  /* ---------- Direct WhatsApp button (right panel) ---------- */

  const waDirectBtn = document.getElementById('wa-direct-btn');
  if (waDirectBtn) {
    waDirectBtn.addEventListener('click', function () {
      const msg = 'Hello! I\'d like to book a table at ' + RESTAURANT.name + '. Could you help me with availability?';
      const url = buildWhatsAppUrl(RESTAURANT.whatsappNumber, msg);
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

  /* ---------- Reset form link ---------- */

  const resetLink = document.getElementById('booking-reset');
  if (resetLink) {
    resetLink.addEventListener('click', function (e) {
      e.preventDefault();
      form.reset();
      if (fieldsDiv)  fieldsDiv.style.display = '';
      if (successDiv) successDiv.style.display = 'none';
    });
  }

})();
