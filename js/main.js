document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileNav();
  initTypingEffect();
  initReadingProgressBar();
  initScrollSpyAndHeader();
  initScrollToTop();
  initSkillBars();
  initTimelineTabs();
  initProjectFilter();
  initProjectModal();
  initContactForm();
});

function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(toggleBtn, currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(toggleBtn, newTheme);
    showToast(`Đã chuyển sang giao diện ${newTheme === 'dark' ? 'Tối' : 'Sáng'}`);
  });
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  btn.setAttribute('aria-label', `Chuyển sang giao diện ${theme === 'dark' ? 'sáng' : 'tối'}`);
}

function initMobileNav() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('open');
    }
  });
}

function initTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const roles = [
    "Frontend Developer",
    "Kỹ sư Phần mềm tương lai",
    "UI/UX Web Enthusiast",
    "Người đam mê mã nguồn mở"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseEnd = 1800;

  function type() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let timeout = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      timeout = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      timeout = 400;
    }

    setTimeout(type, timeout);
  }

  type();
}

function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });
}

function initScrollSpyAndHeader() {
  const header = document.querySelector('.header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 350) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function initSkillBars() {
  const progressFills = document.querySelectorAll('.progress-fill');
  if (progressFills.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressFills.forEach(fill => {
          const width = fill.getAttribute('data-width') || '0%';
          fill.style.width = width;
        });
        observer.disconnect(); 
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    observer.observe(skillsSection);
  }
}

function initTimelineTabs() {
  const tabBtns = document.querySelectorAll('.timeline-tab-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterType = btn.getAttribute('data-tab');

      timelineItems.forEach(item => {
        if (filterType === 'all' || item.getAttribute('data-type') === filterType) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

const projectData = {
  1: {
    title: "Nền Tảng Thương Mại Điện Tử - TechStore",
    category: "Fullstack / E-Commerce",
    image: "images/project-ecommerce.svg",
    desc: "Hệ thống mua sắm thiết bị công nghệ trực tuyến toàn diện, hỗ trợ trải nghiệm người dùng tối ưu trên mọi màn hình. Ứng dụng cung cấp đầy đủ chức năng tìm kiếm, giỏ hàng, đặt hàng và quản lý sản phẩm.",
    features: [
      "Giao diện Responsive chuẩn UI/UX, hỗ trợ Dark/Light mode",
      "Quản lý trạng thái giỏ hàng theo thời gian thực với LocalStorage",
      "Bộ lọc nâng cao theo giá, phân loại mặt hàng, nhãn hiệu",
      "Quy trình thanh toán mô phỏng trực quan với xác thực form",
      "Hiệu năng tải trang cao đạt 98 điểm Google Lighthouse"
    ],
    tech: ["HTML5", "CSS3 / Flexbox / Grid", "JavaScript (ES6+)", "LocalStorage", "REST API"],
    demoUrl: "#",
    githubUrl: "https://github.com"
  },
  2: {
    title: "Ứng Dụng Quản Lý Công Việc - FlowMaster Kanban",
    category: "Frontend Web App",
    image: "images/project-taskmanager.svg",
    desc: "Bảng Kanban trực quan giúp các đội nhóm công nghệ theo dõi tiến độ công việc theo phương pháp Agile/Scrum. Hỗ trợ thao tác kéo thả mượt mà, phân loại mức độ ưu tiên và nhắc nhở thời hạn.",
    features: [
      "Hệ thống Drag & Drop API nguyên bản cho phép kéo thả thẻ nhiệm vụ linh hoạt",
      "Phân loại công việc theo trạng thái: Cần làm, Đang làm và Hoàn thành",
      "Gắn nhãn mức độ ưu tiên (Khẩn cấp, Trung bình, Thấp) với mã màu riêng biệt",
      "Tìm kiếm nhanh và lọc thẻ theo thành viên hoặc hạn chót",
      "Tự động lưu trữ tiến độ phiên làm việc trên trình duyệt"
    ],
    tech: ["HTML5 Semantic", "Modern CSS", "HTML Drag & Drop API", "JavaScript OOP", "Git"],
    demoUrl: "#",
    githubUrl: "https://github.com"
  },
  3: {
    title: "Chuyên Trang Tin Tức & Blog Công Nghệ - Dev Insights",
    category: "Frontend / Content",
    image: "images/project-blog.svg",
    desc: "Nền tảng chia sẻ kiến thức lập trình, xu hướng công nghệ và kinh nghiệm kỹ thuật dành cho cộng đồng lập trình viên. Thiết kế tối giản, tập trung vào trải nghiệm đọc bài viết không phân tâm.",
    features: [
      "Layout Typography tinh tế, dễ đọc với kích thước chữ và khoảng cách dòng chuẩn mực",
      "Thanh tiến độ đọc trang (Reading progress bar) thời gian thực",
      "Tính năng ước tính thời gian đọc bài viết tự động theo số từ",
      "Phân mục bài viết theo chuyên đề: Frontend, Backend, UI/UX Design",
      "Tối ưu hóa SEO với đầy đủ thẻ Meta Open Graph và Semantic HTML"
    ],
    tech: ["Semantic HTML5", "CSS Variables", "JavaScript DOM", "Responsive Layout", "SEO Best Practices"],
    demoUrl: "#",
    githubUrl: "https://github.com"
  }
};

function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const detailBtns = document.querySelectorAll('.btn-detail');

  if (!modalOverlay) return;

  detailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];
      if (!data) return;

      document.getElementById('modal-img').src = data.image;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.desc;

      const featuresList = document.getElementById('modal-features');
      featuresList.innerHTML = '';
      data.features.forEach(f => {
        const li = document.createElement('li');
        li.textContent = f;
        featuresList.appendChild(li);
      });

      const techContainer = document.getElementById('modal-tech');
      techContainer.innerHTML = '';
      data.tech.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = t;
        techContainer.appendChild(span);
      });

      modalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');

  function validateInput(input, condition, errorMsg) {
    const formGroup = input.closest('.form-group');
    const errorDisplay = formGroup.querySelector('.error-message');

    if (!condition) {
      formGroup.classList.add('has-error');
      input.classList.add('invalid');
      input.classList.remove('valid');
      if (errorDisplay) errorDisplay.textContent = errorMsg;
      return false;
    } else {
      formGroup.classList.remove('has-error');
      input.classList.remove('invalid');
      input.classList.add('valid');
      return true;
    }
  }

  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateInput(nameInput, nameInput.value.trim().length >= 2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateInput(emailInput, emailRegex.test(emailInput.value.trim()), 'Vui lòng nhập địa chỉ email hợp lệ (vd: ten@domain.com)');
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      
      const val = phoneInput.value.trim();
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      if (val.length > 0) {
        validateInput(phoneInput, phoneRegex.test(val), 'Số điện thoại không hợp lệ (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09)');
      } else {
        const formGroup = phoneInput.closest('.form-group');
        formGroup.classList.remove('has-error');
        phoneInput.classList.remove('invalid');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      validateInput(messageInput, messageInput.value.trim().length >= 10, 'Nội dung tin nhắn cần tối thiểu 10 ký tự');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isNameValid = validateInput(nameInput, nameInput.value.trim().length >= 2, 'Vui lòng nhập họ và tên (tối thiểu 2 ký tự)');
    const isEmailValid = validateInput(emailInput, emailRegex.test(emailInput.value.trim()), 'Vui lòng nhập địa chỉ email hợp lệ');
    const isMessageValid = validateInput(messageInput, messageInput.value.trim().length >= 10, 'Nội dung tin nhắn cần tối thiểu 10 ký tự');

    let isPhoneValid = true;
    if (phoneInput && phoneInput.value.trim().length > 0) {
      const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
      isPhoneValid = validateInput(phoneInput, phoneRegex.test(phoneInput.value.trim()), 'Số điện thoại không hợp lệ');
    }

    if (isNameValid && isEmailValid && isMessageValid && isPhoneValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Đang gửi tin nhắn...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('🎉 Cảm ơn bạn! Tin nhắn đã được gửi thành công.', 'success');
        form.reset();
        document.querySelectorAll('.form-control').forEach(el => el.classList.remove('valid', 'invalid'));
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1000);
    } else {
      showToast('⚠️ Vui lòng kiểm tra lại các trường thông tin bị lỗi.', 'error');
    }
  });
}

function showToast(message, type = 'info') {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '🔔';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '❌';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
