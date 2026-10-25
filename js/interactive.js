/**
 * ==========================================================================
 * INTERACTIVE.JS - INTERACTIVE COMPONENTS & DYNAMIC BEHAVIORS
 * Handles: Skill Matrix Filtering, Journey Tabs, Project Filtering,
 * Project Modal Dialog with ESC/backdrop handling, and 3D Perspective Tilt.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initSkillFiltering();
  initJourneyTabs();
  initProjectFiltering();
  initProjectModal();
  init3DCardTilt();
});

/* 1. LỌC KỸ NĂNG */
function initSkillFiltering() {
  const filterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 2. TABS HỌC VẤN / KINH NGHIỆM */
function initJourneyTabs() {
  const tabBtns = document.querySelectorAll('.journey-tabs-nav .tab-btn');
  const timelineItems = document.querySelectorAll('.timeline-container .timeline-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetType = btn.getAttribute('data-tab');

      timelineItems.forEach(item => {
        if (targetType === 'all' || item.classList.contains(targetType)) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.transition = 'all 0.35s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 40);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* 3. LỌC DANH MỤC DỰ ÁN */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.project-category-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* 4. MODAL CHI TIẾT DỰ ÁN */
const projectData = {
  p1: {
    title: 'DevPulse - Nền Tảng Giám Sát Realtime & Analytics',
    badge: 'Fullstack & SaaS Cloud',
    img: 'images/project1.svg',
    summary: 'Hệ thống Dashboard phân tích số liệu kinh doanh và giám sát sức khỏe dịch vụ theo thời gian thực (Real-time Metric Stream) với độ trễ dưới 50ms.',
    tech: ['React.js 18', 'TypeScript', 'Node.js', 'Express', 'WebSocket', 'Tailwind CSS', 'Chart.js', 'MongoDB'],
    features: [
      'Giao diện trực quan hóa dữ liệu động qua biểu đồ sóng và heatmaps.',
      'Đồng bộ dữ liệu hai chiều real-time qua giao thức WebSocket bảo mật.',
      'Hệ thống cảnh báo thông minh qua webhook Telegram / Discord khi API quá tải.',
      'Tối ưu hóa hiệu năng render 60 FPS với virtualization và memoization.'
    ],
    demoUrl: 'https://github.com',
    codeUrl: 'https://github.com'
  },
  p2: {
    title: 'Nexus AI - Không Gian Làm Việc Đa Tác Tử (Multi-Agent)',
    badge: 'Trí Tuệ Nhân Tạo & LLM',
    img: 'images/project2.svg',
    summary: 'Nền tảng điều phối đa tác tử AI tự động hóa chuỗi quy trình truy xuất dữ liệu, tổng hợp báo cáo và trực quan hóa sơ đồ tư duy cho nhà phát triển.',
    tech: ['Next.js 14', 'Python FastAPI', 'Gemini API', 'LangChain', 'Pinecone Vector DB', 'PostgreSQL', 'Docker'],
    features: [
      'Cấu trúc Pipeline RAG (Retrieval-Augmented Generation) tìm kiếm ngữ nghĩa chính xác.',
      'Điều phối nhiều Agent chuyên biệt: Data Extractor, Analyzer, Visualizer.',
      'Tích hợp Streaming Response với giao diện gõ chữ thời gian thực.',
      'Quản lý Token và chi phí gọi API tối ưu thông qua hệ thống Cache đệm thông minh.'
    ],
    demoUrl: 'https://github.com',
    codeUrl: 'https://github.com'
  },
  p3: {
    title: 'EcoSmart - Hệ Thống Quan Trắc Môi Trường IoT & Mobile',
    badge: 'Hệ Thống IoT & Mobile App',
    img: 'images/project3.svg',
    summary: 'Giải pháp giám sát chất lượng không khí, độ ẩm, nhiệt độ và điều khiển thiết bị tưới tự động tích hợp bảng điều khiển Web và ứng dụng di động.',
    tech: ['ESP32 C++', 'MQTT Protocol', 'React Native', 'Node.js', 'InfluxDB (Time Series)', 'Grafana UI'],
    features: [
      'Thu thập dữ liệu cảm biến (CO2, độ ẩm, nhiệt độ) liên tục với tần số 1Hz.',
      'Truyền tải gói tin nhẹ nhàng và bảo mật qua broker MQTT HiveMQ.',
      'Ứng dụng di động nhận thông báo đẩy tức thời khi chỉ số ô nhiễm vượt ngưỡng.',
      'Cơ chế tự động kích hoạt máy bơm phun sương khi đất đạt ngưỡng khô cài đặt.'
    ],
    demoUrl: 'https://github.com',
    codeUrl: 'https://github.com'
  }
};

function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalContent = document.getElementById('modalProjectBody');
  const openBtns = document.querySelectorAll('.project-btn-details');

  if (!modal || !modalContent) return;

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <div style="margin-bottom:1.5rem; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">
        <img src="${data.img}" alt="${data.title}" style="width:100%; height:auto; display:block; max-height:280px; object-fit:cover;">
      </div>
      <div style="margin-bottom:1rem;">
        <span style="font-size:0.75rem; font-family:var(--font-mono); color:var(--accent-cyan); background:rgba(6,182,212,0.12); padding:0.25rem 0.65rem; border-radius:999px; border:1px solid rgba(6,182,212,0.3);">${data.badge}</span>
      </div>
      <h3 style="font-size:1.45rem; font-weight:800; color:var(--text-main); margin-bottom:0.75rem;">${data.title}</h3>
      <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.65; margin-bottom:1.25rem;">${data.summary}</p>
      
      <h4 style="font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:0.6rem;">💡 Tính năng & Điểm nhấn kỹ thuật:</h4>
      <ul style="list-style:none; padding-left:0; margin-bottom:1.25rem; display:flex; flex-direction:column; gap:0.5rem;">
        ${data.features.map(f => `
          <li style="display:flex; align-items:flex-start; gap:0.6rem; color:var(--text-muted); font-size:0.9rem;">
            <span style="color:var(--accent-emerald); font-weight:bold;">✓</span>
            <span>${f}</span>
          </li>
        `).join('')}
      </ul>

      <h4 style="font-size:1rem; font-weight:700; color:var(--text-main); margin-bottom:0.6rem;">🛠 Công nghệ sử dụng:</h4>
      <div style="display:flex; flex-wrap:wrap; gap:0.45rem; margin-bottom:1.75rem;">
        ${data.tech.map(t => `
          <span style="font-size:0.75rem; font-family:var(--font-mono); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); padding:0.25rem 0.65rem; border-radius:6px; color:var(--text-main);">${t}</span>
        `).join('')}
      </div>

      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        <a href="${data.demoUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="flex:1; font-size:0.9rem; padding:0.65rem 1.25rem;">
          <span>Trải Nghiệm Live Demo</span> ↗
        </a>
        <a href="${data.codeUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-glass" style="flex:1; font-size:0.9rem; padding:0.65rem 1.25rem;">
          <span>Xem Mã Nguồn GitHub</span> ↗
        </a>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.playSfx) window.playSfx('open');
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project');
      openProjectModal(pId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* 5. 3D CARD TILT */
function init3DCardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const tiltCards = document.querySelectorAll('.bento-card, .project-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}