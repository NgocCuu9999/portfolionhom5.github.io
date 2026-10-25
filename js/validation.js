/**
 * ==========================================================================
 * VALIDATION.JS - FORM VALIDATION & INTERACTIVE FEEDBACK
 * Real-time input validation, error handling, local draft auto-saving,
 * and toast notification engine.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactFormValidation();
});

function initContactFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const topicSelect = document.getElementById('contactTopic');
  const messageInput = document.getElementById('contactMessage');
  const charCounter = document.getElementById('messageCharCount');
  const toast = document.getElementById('formSuccessToast');
  const submitBtn = document.getElementById('submitBtn');

  // Nạp lại bản nháp từ LocalStorage nếu có
  loadSavedDraft();

  // Đếm ký tự và tự động lưu bản nháp
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 500 ký tự`;
      saveDraft();
      validateField(messageInput, validateMessage);
    });
  }

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      saveDraft();
      validateField(nameInput, validateName);
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      saveDraft();
      validateField(emailInput, validateEmail);
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      saveDraft();
      validateField(subjectInput, validateSubject);
    });
  }

  if (topicSelect) {
    topicSelect.addEventListener('change', () => saveDraft());
  }

  // Hàm kiểm tra logic
  function validateName(val) {
    const trimmed = val.trim();
    if (!trimmed) return 'Vui lòng nhập họ và tên của bạn.';
    if (trimmed.length < 2) return 'Họ và tên phải có ít nhất 2 ký tự.';
    const regex = /^[\p{L}\s'-]+$/u;
    if (!regex.test(trimmed)) return 'Họ tên không được chứa số hoặc ký tự đặc biệt.';
    return '';
  }

  function validateEmail(val) {
    const trimmed = val.trim();
    if (!trimmed) return 'Vui lòng nhập địa chỉ email.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return 'Địa chỉ email không hợp lệ (Ví dụ: ban@gmail.com).';
    return '';
  }

  function validateSubject(val) {
    const trimmed = val.trim();
    if (!trimmed) return 'Vui lòng nhập tiêu đề liên hệ.';
    if (trimmed.length < 5) return 'Tiêu đề cần tối thiểu 5 ký tự để người nhận dễ theo dõi.';
    return '';
  }

  function validateMessage(val) {
    const trimmed = val.trim();
    if (!trimmed) return 'Vui lòng nhập nội dung tin nhắn.';
    if (trimmed.length < 15) return 'Nội dung tin nhắn nên có tối thiểu 15 ký tự.';
    return '';
  }

  function validateField(field, validator) {
    const errorEl = field.parentElement.querySelector('.form-error-msg');
    const error = validator(field.value);

    if (error) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      if (errorEl) errorEl.textContent = error;
      return false;
    } else {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  function saveDraft() {
    const draft = {
      name: nameInput ? nameInput.value : '',
      email: emailInput ? emailInput.value : '',
      subject: subjectInput ? subjectInput.value : '',
      topic: topicSelect ? topicSelect.value : '',
      message: messageInput ? messageInput.value : ''
    };
    try {
      localStorage.setItem('portfolio-contact-draft', JSON.stringify(draft));
    } catch (e) {}
  }

  function loadSavedDraft() {
    try {
      const saved = localStorage.getItem('portfolio-contact-draft');
      if (!saved) return;
      const draft = JSON.parse(saved);
      if (draft.name && nameInput) nameInput.value = draft.name;
      if (draft.email && emailInput) emailInput.value = draft.email;
      if (draft.subject && subjectInput) subjectInput.value = draft.subject;
      if (draft.topic && topicSelect) topicSelect.value = draft.topic;
      if (draft.message && messageInput) {
        messageInput.value = draft.message;
        if (charCounter) charCounter.textContent = `${draft.message.length} / 500 ký tự`;
      }
    } catch (e) {}
  }

  function clearDraft() {
    try {
      localStorage.removeItem('portfolio-contact-draft');
    } catch (e) {}
  }

  // Xử lý nộp form
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, validateName);
    const isEmailValid = validateField(emailInput, validateEmail);
    const isSubjectValid = validateField(subjectInput, validateSubject);
    const isMsgValid = validateField(messageInput, validateMessage);

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMsgValid) {
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
        if (submitBtn) {
          submitBtn.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(0)' }
          ], { duration: 300 });
        }
      }
      return;
    }

    if (submitBtn) {
      const origHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Đang gửi thông điệp...</span> ⏳`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origHtml;

        showToast();
        if (window.playSfx) window.playSfx('success');

        form.reset();
        [nameInput, emailInput, subjectInput, messageInput].forEach(f => {
          if (f) f.classList.remove('is-valid');
        });
        if (charCounter) charCounter.textContent = '0 / 500 ký tự';
        clearDraft();
      }, 700);
    }
  });

  function showToast() {
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }
}