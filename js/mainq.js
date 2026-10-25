/* ================================
   Portfolio - Main JavaScript (v2)
   Futuristic Dark Theme
   ================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ DOM ELEMENTS ============
    const header      = document.getElementById('header');
    const hamburger   = document.getElementById('hamburger');
    const navLinks    = document.getElementById('navLinks');
    const navItems    = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const contactForm = document.getElementById('contactForm');
    const typingText  = document.getElementById('typingText');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose  = document.getElementById('modalClose');
    const modalBody   = document.getElementById('modalBody');

    // ============ TYPING EFFECT ============
    const titles = [
        "'Front-end Developer'",
        "'Sinh viên CNTT'",
        "'Web Designer'",
        "'Problem Solver'"
    ];
    let titleIdx = 0, charIdx = 0, isDeleting = false, speed = 100;

    function typeEffect() {
        const current = titles[titleIdx];

        if (isDeleting) {
            typingText.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            speed = 40;
        } else {
            typingText.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            speed = 90;
        }

        if (!isDeleting && charIdx === current.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            titleIdx = (titleIdx + 1) % titles.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }
    typeEffect();

    // ============ COUNTER ANIMATION ============
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.count);
            const duration = 1500;
            const step = target / (duration / 16);
            let current = 0;

            function update() {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    return;
                }
                el.textContent = Math.floor(current);
                requestAnimationFrame(update);
            }
            update();
        });
    }

    // Trigger counters when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    const heroSection = document.getElementById('home');
    if (heroSection) heroObserver.observe(heroSection);

    // ============ DARK MODE TOGGLE ============
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // ============ MOBILE MENU ============
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ============ SCROLL EFFECTS ============
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Header
        header.classList.toggle('scrolled', scrollY > 50);

        // Scroll-to-top
        scrollTopBtn.classList.toggle('visible', scrollY > 500);

        // Scroll progress ring
        const scrollPercent = scrollY / (document.body.scrollHeight - window.innerHeight);
        const circle = scrollTopBtn.querySelector('.scroll-progress circle');
        if (circle) {
            const circumference = 289;
            circle.style.strokeDashoffset = circumference - (circumference * scrollPercent);
        }

        // Active nav
        updateActiveNav();
    });

    // ============ SCROLL TO TOP ============
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============ ACTIVE NAV ============
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ============ SCROLL ANIMATIONS (AOS) ============
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Skill rings
                if (entry.target.closest('#skills') || entry.target.querySelector('.skill-ring')) {
                    animateSkillRings();
                }
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

    // ============ SKILL RING ANIMATION ============
    let ringsAnimated = false;

    function animateSkillRings() {
        if (ringsAnimated) return;
        ringsAnimated = true;

        document.querySelectorAll('.skill-ring').forEach(ring => {
            const percent = parseInt(ring.dataset.percent);
            const circle = ring.querySelector('.skill-progress');
            if (circle) {
                const circumference = 2 * Math.PI * 42; // ~264
                const offset = circumference - (circumference * percent / 100);
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 200);
            }
        });
    }

    // ============ SKILL FILTER ============
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            skillCards.forEach((card, i) => {
                const show = filter === 'all' || card.dataset.category === filter;
                if (show) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeUp 0.4s ease ${i * 0.05}s both`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============ PROJECT FILTER ============
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            projectCards.forEach((card, i) => {
                const show = filter === 'all' || card.dataset.category === filter;
                if (show) {
                    card.classList.remove('hidden');
                    card.style.animation = `fadeUp 0.4s ease ${i * 0.08}s both`;
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============ CONTACT FORM VALIDATION ============
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        const formStatus = document.getElementById('formStatus');

        let isValid = true;
        clearErrors();

        // Name
        if (name.value.trim() === '') {
            showError(name, 'nameError', 'Vui lòng nhập họ và tên');
            isValid = false;
        } else if (name.value.trim().length < 2) {
            showError(name, 'nameError', 'Họ tên phải có ít nhất 2 ký tự');
            isValid = false;
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            showError(email, 'emailError', 'Vui lòng nhập email');
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            showError(email, 'emailError', 'Email không hợp lệ');
            isValid = false;
        }

        // Message
        if (message.value.trim() === '') {
            showError(message, 'messageError', 'Vui lòng nhập nội dung');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'messageError', 'Nội dung phải có ít nhất 10 ký tự');
            isValid = false;
        }

        if (isValid) {
            showModal(`
                <div class="success-icon"><i class="fas fa-check"></i></div>
                <h3>Gửi thành công!</h3>
                <p>Cảm ơn <strong>${name.value.trim()}</strong> đã liên hệ. Tôi sẽ phản hồi sớm nhất!</p>
            `);

            formStatus.textContent = '✓ Tin nhắn đã được gửi thành công!';
            formStatus.className = 'form-status success';

            contactForm.reset();
            setTimeout(() => { formStatus.className = 'form-status'; }, 5000);
        }
    });

    function showError(input, errorId, msg) {
        input.classList.add('error');
        document.getElementById(errorId).textContent = msg;
    }

    function clearErrors() {
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
            el.classList.remove('error');
        });
    }

    // Real-time clear errors
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorEl = input.parentElement.querySelector('.error-msg');
            if (errorEl) errorEl.textContent = '';
        });
    });

    // ============ MODAL ============
    function showModal(html) {
        modalBody.innerHTML = html;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ============ SMOOTH SCROLL ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const target = document.querySelector(id);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ============ TILT EFFECT ON PROJECT CARDS ============
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============ PARALLAX ON ORBS ============
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        document.querySelectorAll('.orb').forEach((orb, i) => {
            const speed = (i + 1) * 15;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

});
