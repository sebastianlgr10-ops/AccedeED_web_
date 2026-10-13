/**
 * AccedeED - Lógica Interactiva del Prototipo Web
 * 100% funcional: Pestañas de módulos, Acordeón FAQ, Modales, Accesibilidad y Simulador.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initModuleTabs();
  initFaqAccordion();
  initAccessibilityTools();
  initModals();
  initWhiteboard();
  initNewsletter();
});

/* ==========================================================================
   1. Navegación y Scroll Spy
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Sombra al hacer scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Menú móvil
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const isOpen = navLinks.classList.contains('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Cerrar al hacer clic en un enlace
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // Scroll suave y activación de enlace
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

/* ==========================================================================
   2. Pestañas de Módulos (Ecosistema Integral)
   ========================================================================== */
const MODULES_DATA = {
  'aula-virtual': {
    title: 'Aula Virtual Interactiva ',
    desc: 'Permite a los docentes crear pizarras dinámicas en donde cada estudiante interviene a su propio ritmo, incorporando actividades lúdicas con recompensas pedagógicas, soporte multicanal y adaptación para dificultades del aprendizaje.',
    topTags: ['Pizarra interactiva en tiempo real', 'Forma más divertida de aprender'],
    footerPills: [
      { text: 'Libre: Apache 2.0 / MIT', icon: 'check-circle' },
      { text: 'Interoperable con SCORM', icon: 'check-circle' },
      { text: 'Modo sin datos móviles', icon: 'check-circle' }
    ],
    mockupType: 'whiteboard'
  },
  'biblioteca-rea': {
    title: 'Biblioteca de Recursos Educativos Abiertos (REA)',
    desc: 'Repositorio indexado con más de 25,000 libros de texto abiertos, simulaciones científicas interactivas PhET, laboratorios virtuales y cuadernos de trabajo descargables organizados por grados y áreas curriculares.',
    topTags: ['Licencias Creative Commons', 'Simuladores PhET de Ciencias'],
    footerPills: [
      { text: 'Filtro por nivel escolar', icon: 'check-circle' },
      { text: 'Descarga en lote para USB', icon: 'check-circle' },
      { text: 'Formatos accesibles ePub y PDF', icon: 'check-circle' }
    ],
    mockupType: 'library'
  },
  'tutoria-acompanante': {
    title: 'Tutoría Pedagógica Inteligente y Acompañante 24/7',
    desc: 'Modelo de lenguaje socrático optimizado para entornos educativos que guía paso a paso al estudiante sin darle la respuesta directa, fomentando el razonamiento crítico, la metacognición y el aprendizaje autónomo.',
    topTags: ['IA Socrática Ética', '100% Libre de Rastreadores'],
    footerPills: [
      { text: 'Sin recopilación de datos de menores', icon: 'check-circle' },
      { text: 'Soporte bilingüe y lenguas originarias', icon: 'check-circle' },
      { text: 'Explicaciones visuales y auditivas', icon: 'check-circle' }
    ],
    mockupType: 'tutor'
  },
  'portal-docente': {
    title: 'Portal Docente y Analíticas Formativas de Aprendizaje',
    desc: 'Panel de control intuitivo que detecta tempranamente rezagos en competencias clave, automatiza la creación de rúbricas de evaluación inclusivas y genera material de refuerzo adaptado a la diversidad del aula.',
    topTags: ['Detección temprana de rezago', 'Generador de fichas pedagógicas'],
    footerPills: [
      { text: 'Reducción de burocracia docente (-60%)', icon: 'check-circle' },
      { text: 'Informes para directores y familias', icon: 'check-circle' },
      { text: 'Cumplimiento normativo ODS 4', icon: 'check-circle' }
    ],
    mockupType: 'analytics'
  },
  'modo-ligero': {
    title: 'Modo Ultraligero & Sincronización Local Sin Conexión',
    desc: 'Arquitectura P2P y servidores locales escolares de bajo costo (Raspberry Pi/mini PC) que permiten una experiencia pedagógica rica sin requerir internet permanente. Sincronización transparente cuando hay señal.',
    topTags: ['Consumo de datos cero (0 MB)', 'Sincronización P2P / USB'],
    footerPills: [
      { text: 'Funciona en equipos de 1GB RAM', icon: 'check-circle' },
      { text: 'Red local autónoma para el colegio', icon: 'check-circle' },
      { text: 'Respaldo automático de progreso', icon: 'check-circle' }
    ],
    mockupType: 'offline'
  }
};

function initModuleTabs() {
  const tabButtons = document.querySelectorAll('.module-tab-btn');
  const showcasePanel = document.querySelector('.module-showcase-panel');

  if (!tabButtons.length || !showcasePanel) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const moduleKey = btn.getAttribute('data-module');
      if (!moduleKey || !MODULES_DATA[moduleKey]) return;

      // Actualizar estado activo en botones
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Animación suave de salida/entrada
      showcasePanel.style.opacity = '0.5';
      showcasePanel.style.transform = 'translateY(4px)';

      setTimeout(() => {
        renderShowcaseContent(moduleKey);
        showcasePanel.style.opacity = '1';
        showcasePanel.style.transform = 'translateY(0)';
      }, 150);
    });
  });
}

function renderShowcaseContent(key) {
  const data = MODULES_DATA[key];
  if (!data) return;

  // Tags superiores
  const tagsContainer = document.getElementById('showcase-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = data.topTags.map(tag => 
      `<span class="pill-tag cyan-tag">${tag}</span>`
    ).join('');
  }

  // Título y descripción
  const titleEl = document.getElementById('showcase-title');
  const descEl = document.getElementById('showcase-desc');
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;

  // Pills footer
  const pillsContainer = document.getElementById('showcase-pills');
  if (pillsContainer) {
    pillsContainer.innerHTML = data.footerPills.map(p => `
      <div class="showcase-pill-item">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>${p.text}</span>
      </div>
    `).join('');
  }

  // Renderizar cuerpo del mockup interactivo
  renderMockupBody(data.mockupType);
}

function renderMockupBody(type) {
  const mockupBody = document.getElementById('mockup-dynamic-body');
  if (!mockupBody) return;

  if (type === 'whiteboard') {
    mockupBody.innerHTML = `
      <div class="whiteboard-mockup">
        <div class="wb-toolbar">
          <button class="wb-tool-btn active" title="Pincel"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg></button>
          <button class="wb-tool-btn" title="Geometría"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 22 22 22"></polygon></svg></button>
          <button class="wb-tool-btn" title="Texto"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg></button>
          <button class="wb-tool-btn" id="btn-clear-canvas" title="Limpiar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
          <span style="font-size:0.75rem; color:#94a3b8; margin-left:auto;">Pizarra Colaborativa en Vivo (¡Dibuja aquí!)</span>
        </div>
        <div class="canvas-container" style="position:relative; width:100%; height:180px; background:#070d1a; border-radius:8px; overflow:hidden;">
          <canvas id="interactive-canvas" width="550" height="180" style="width:100%; height:100%; cursor:crosshair;"></canvas>
          <div class="wb-overlay-students">
            <span class="avatar-tag"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80" alt="Ana"> Ana P.</span>
            <span class="avatar-tag"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80" alt="Carlos"> Carlos M.</span>
            <span class="avatar-tag" style="background:#e63946; color:#fff;">Docente en vivo</span>
          </div>
        </div>
      </div>
    `;
    setupCanvas();
  } else if (type === 'library') {
    mockupBody.innerHTML = `
      <div class="library-mockup" style="display:flex; flex-direction:column; gap:0.75rem;">
        <div style="display:flex; gap:0.5rem;">
          <input type="text" placeholder="Buscar entre 1,000 libros, PDFs y materiales..." style="flex-grow:1; background:#070d1a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:0.45rem 0.8rem; font-size:0.8rem; color:#fff;">
          <button class="btn btn-primary" style="padding:0.4rem 0.9rem; font-size:0.8rem;">Buscar</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.6rem;">
          <div class="rea-card" style="background:#070d1a; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:0.65rem; text-align:left;">
            <div style="font-size:0.7rem; color:#38bdf8; font-weight:700;">CIENCIAS - PhET</div>
            <div style="font-size:0.82rem; font-weight:700; color:#fff; margin:0.2rem 0;">Gravedad y Órbitas</div>
            <div style="font-size:0.72rem; color:#94a3b8;">Simulación 3D interactiva offline.</div>
            <button class="btn-store-dark" style="margin-top:0.5rem; padding:0.25rem 0.6rem; font-size:0.72rem; width:100%; justify-content:center;" onclick="showToast('Simulador PhET listo para abrir sin conexión')">Abrir Recurso</button>
          </div>
          <div class="rea-card" style="background:#070d1a; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:0.65rem; text-align:left;">
            <div style="font-size:0.7rem; color:#e63946; font-weight:700;">MATEMÁTICAS</div>
            <div style="font-size:0.82rem; font-weight:700; color:#fff; margin:0.2rem 0;">Fracciones con Regletas</div>
            <div style="font-size:0.72rem; color:#94a3b8;">Cuaderno descargable con audio guía.</div>
            <button class="btn-store-dark" style="margin-top:0.5rem; padding:0.25rem 0.6rem; font-size:0.72rem; width:100%; justify-content:center;" onclick="showToast('Cuaderno descargado en PDF y ePub')">Descargar</button>
          </div>
          <div class="rea-card" style="background:#070d1a; border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:0.65rem; text-align:left;">
            <div style="font-size:0.7rem; color:#10b981; font-weight:700;">LENGUAJE</div>
            <div style="font-size:0.82rem; font-weight:700; color:#fff; margin:0.2rem 0;">Cuentos Bilingües Quechua</div>
            <div style="font-size:0.72rem; color:#94a3b8;">Lecturas con audio nativo y glosario.</div>
            <button class="btn-store-dark" style="margin-top:0.5rem; padding:0.25rem 0.6rem; font-size:0.72rem; width:100%; justify-content:center;" onclick="showToast('Cuento bilingüe cargado con narración')">Escuchar</button>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'tutor') {
    mockupBody.innerHTML = `
      <div class="tutor-chat-mockup" style="display:flex; flex-direction:column; gap:0.65rem; max-width:500px; margin:0 auto; text-align:left;">
        <div style="background:rgba(255,255,255,0.06); border-radius:12px; padding:0.6rem 0.9rem; align-self:flex-start; max-width:85%;">
          <span style="font-size:0.7rem; color:#94a3b8; display:block; font-weight:600;">Estudiante (Mateo):</span>
          <span style="font-size:0.82rem; color:#e2e8f0;">"¿Por qué el área de un triángulo es (base × altura) / 2?"</span>
        </div>
        <div style="background:rgba(109, 57, 230, 0.15); border:1px solid rgba(109, 57, 230, 0.3); border-radius:12px; padding:0.6rem 0.9rem; align-self:flex-end; max-width:90%;">
          <span style="font-size:0.7rem; color:#ff6b77; display:block; font-weight:700;">AccedeED Tutor IA:</span>
          <span style="font-size:0.82rem; color:#fff;">¡Excelente pregunta! Imagina que tomas un rectángulo completo cuya área es (base × altura). Si lo partes con una línea diagonal de esquina a esquina... ¿cuántos triángulos idénticos obtienes?</span>
        </div>
        <div style="display:flex; gap:0.4rem; margin-top:0.3rem;">
          <input type="text" placeholder="Escribe tu hipótesis aquí..." style="flex-grow:1; background:#070d1a; border:1px solid rgba(255,255,255,0.15); border-radius:6px; padding:0.45rem 0.8rem; font-size:0.8rem; color:#fff;" value="¡Obtengo 2 triángulos iguales!">
          <button class="btn btn-primary" style="padding:0.4rem 0.8rem; font-size:0.78rem;" onclick="showToast('¡Correcto! Por eso dividimos entre dos.')">Responder</button>
        </div>
      </div>
    `;
  } else if (type === 'analytics') {
    mockupBody.innerHTML = `
      <div class="analytics-mockup" style="display:flex; flex-direction:column; gap:0.7rem; text-align:left;">
        <div style="display:flex; justify-content:space-between; align-items:center; background:#070d1a; padding:0.5rem 0.8rem; border-radius:8px;">
          <span style="font-size:0.82rem; font-weight:700; color:#fff;">Resumen del Grupo 5° B - Diagnóstico ODS 4</span>
          <span style="font-size:0.72rem; color:#10b981; background:rgba(16,185,129,0.15); padding:0.2rem 0.5rem; border-radius:4px;">Asistencia: 98%</span>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
          <div style="background:#070d1a; border-radius:8px; padding:0.65rem; border:1px solid rgba(255,255,255,0.06);">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.3rem;">
              <span>Comprensión Lectora</span>
              <strong style="color:#10b981;">88%</strong>
            </div>
            <div style="width:100%; height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
              <div style="width:88%; height:100%; background:#10b981;"></div>
            </div>
          </div>
          <div style="background:#070d1a; border-radius:8px; padding:0.65rem; border:1px solid rgba(255,255,255,0.06);">
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.3rem;">
              <span>Pensamiento Lógico (STEM)</span>
              <strong style="color:#e63946;">64% (Alerta preventiva)</strong>
            </div>
            <div style="width:100%; height:6px; background:#1e293b; border-radius:3px; overflow:hidden;">
              <div style="width:64%; height:100%; background:#e63946;"></div>
            </div>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
          <button class="btn-store-dark" style="font-size:0.75rem; padding:0.35rem 0.8rem;" onclick="showToast('Generando ficha pedagógica diferenciada para 6 alumnos...')">Generar Ficha de Apoyo</button>
          <button class="btn-store-outline" style="font-size:0.75rem; padding:0.35rem 0.8rem;" onclick="showToast('Exportando reporte ministerial ODS 4 en PDF')">Exportar PDF</button>
        </div>
      </div>
    `;
  } else if (type === 'offline') {
    mockupBody.innerHTML = `
      <div class="offline-mockup" style="display:flex; flex-direction:column; gap:0.8rem; text-align:left;">
        <div style="display:flex; align-items:center; gap:0.8rem; background:#070d1a; padding:0.7rem 1rem; border-radius:8px; border:1px solid rgba(56,189,248,0.2);">
          <div style="width:36px; height:36px; border-radius:50%; background:rgba(56,189,248,0.15); color:#38bdf8; display:flex; align-items:center; justify-content:center; font-weight:700;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
          </div>
          <div>
            <div style="font-size:0.85rem; font-weight:700; color:#fff;">Servidor Local Escuela Rural rgb(15, 0, 68)</div>
            <div style="font-size:0.74rem; color:#94a3b8;">Estado: En línea vía Red Mesh Local (Sin gasto de datos móviles)</div>
          </div>
          <span style="margin-left:auto; background:rgba(16,185,129,0.15); color:#10b981; font-size:0.72rem; padding:0.25rem 0.6rem; border-radius:4px; font-weight:700;">CONECTADO</span>
        </div>
        <div style="background:#070d1a; padding:0.8rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:0.82rem; font-weight:600; color:#fff;">Paquete de Descarga Primaria Completa</div>
            <div style="font-size:0.74rem; color:#94a3b8;">1,420 microlecciones + 30 laboratorios interactivos (420 MB)</div>
          </div>
          <button class="btn btn-primary" style="padding:0.4rem 0.9rem; font-size:0.75rem;" onclick="simulateOfflineDownload(this)">Sincronizar a USB</button>
        </div>
      </div>
    `;
  }
}

// Simulador de Canvas para la Pizarra Interactiva
function setupCanvas() {
  const canvas = document.getElementById('interactive-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Dibujar figuras iniciales como en el screenshot (triángulos y fórmulas)
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, 140);
  ctx.lineTo(240, 140);
  ctx.lineTo(160, 40);
  ctx.closePath();
  ctx.stroke();

  // Texto pedagógico inicial en canvas
  ctx.fillStyle = '#ff6b77';
  ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
  ctx.fillText('Triángulo Equilátero', 90, 30);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '11px Plus Jakarta Sans, sans-serif';
  ctx.fillText('Ángulos internos = 180°', 90, 160);

  // Dibujar un segundo triángulo interactivo a la derecha
  ctx.strokeStyle = '#e63946';
  ctx.beginPath();
  ctx.moveTo(320, 140);
  ctx.lineTo(440, 140);
  ctx.lineTo(440, 50);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('Triángulo Rectángulo (90°)', 320, 40);

  // Lógica de dibujo libre para el usuario
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: ((e.clientX || (e.touches && e.touches[0].clientX)) - rect.left) * scaleX,
      y: ((e.clientY || (e.touches && e.touches[0].clientY)) - rect.top) * scaleY
    };
  }

  function startDraw(e) {
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;
  }

  function stopDraw() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stopDraw);

  const clearBtn = document.getElementById('btn-clear-canvas');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      showToast('Pizarra limpiada');
      setupCanvas();
    });
  }
}

function simulateOfflineDownload(btn) {
  btn.disabled = true;
  btn.textContent = 'Descargando 0%...';
  let progress = 0;
  const interval = setInterval(() => {
    progress += 25;
    btn.textContent = `Descargando ${progress}%...`;
    if (progress >= 100) {
      clearInterval(interval);
      btn.textContent = '✓ Guardado en USB';
      btn.style.background = '#10b981';
      showToast('¡Paquete educativo copiado con éxito! Listo para usar sin internet.');
    }
  }, 350);
}

/* ==========================================================================
   3. Acordeón de Preguntas Frecuentes (FAQ)
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answerPanel = item.querySelector('.faq-answer-panel');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Cerrar otros acordeones
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherPanel = otherItem.querySelector('.faq-answer-panel');
        if (otherPanel) {
          otherPanel.style.maxHeight = null;
        }
      });

      // Si no estaba activo, abrirlo
      if (!isActive) {
        item.classList.add('active');
        answerPanel.style.maxHeight = answerPanel.scrollHeight + 'px';
      }
    });
  });
}

/* ==========================================================================
   4. Herramientas de Accesibilidad Universal (WCAG AAA)
   ========================================================================== */
function initAccessibilityTools() {
  const btnFont = document.getElementById('btn-toggle-font-size');
  const btnContrast = document.getElementById('btn-toggle-contrast');
  const btnDyslexia = document.getElementById('btn-toggle-dyslexia');
  const btnReader = document.getElementById('btn-read-screen');

  if (btnFont) {
    btnFont.addEventListener('click', () => {
      document.body.classList.toggle('font-large');
      const active = document.body.classList.contains('font-large');
      btnFont.classList.toggle('active', active);
      showToast(active ? 'Tamaño de texto grande activado' : 'Tamaño normal restablecido');
    });
  }

  if (btnContrast) {
    btnContrast.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const active = document.body.classList.contains('high-contrast');
      btnContrast.classList.toggle('active', active);
      showToast(active ? 'Modo de alto contraste activado (WCAG AAA)' : 'Contraste estándar restablecido');
    });
  }

  if (btnDyslexia) {
    btnDyslexia.addEventListener('click', () => {
      document.body.classList.toggle('dyslexia-font');
      const active = document.body.classList.contains('dyslexia-font');
      btnDyslexia.classList.toggle('active', active);
      showToast(active ? 'Tipografía adaptada para dislexia activada' : 'Tipografía estándar restablecida');
    });
  }

  if (btnReader) {
    btnReader.addEventListener('click', () => {
      toggleScreenReader(btnReader);
    });
  }
}

let isSpeaking = false;
function toggleScreenReader(btn) {
  if (!('speechSynthesis' in window)) {
    showToast('Tu navegador no soporta lectura de voz nativa.');
    return;
  }

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    btn.classList.remove('active');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Leer`;
    showToast('Lectura de voz pausada');
  } else {
    // Tomar texto del hero para la demostración
    const heroTitle = document.querySelector('.hero-title')?.innerText || '';
    const heroDesc = document.querySelector('.hero-description')?.innerText || '';
    const textToRead = `${heroTitle}. ${heroDesc}. AccedeED impulsa la educación inclusiva y accesible para todos.`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-ES';
    utterance.rate = 1.0;

    utterance.onend = () => {
      isSpeaking = false;
      btn.classList.remove('active');
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg> Leer`;
    };

    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    btn.classList.add('active');
    btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg> Detener`;
    showToast('Reproduciendo audio asistido en español...');
  }
}

/* ==========================================================================
   5. Modales Interactivos
   ========================================================================== */
function initModals() {
  // Modal Demo
  const btnOpenDemo = document.querySelectorAll('.js-open-demo');
  const demoModal = document.getElementById('modal-demo');

  // Modal Registro
  const btnOpenRegister = document.querySelectorAll('.js-open-register');
  const registerModal = document.getElementById('modal-register');

  // Modal Descarga
  const btnOpenDownload = document.querySelectorAll('.js-open-download');
  const downloadModal = document.getElementById('modal-download');

  const closeButtons = document.querySelectorAll('.modal-close-btn, .modal-overlay, .modal-close-btn-action');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  }

  btnOpenDemo.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openModal(demoModal); }));
  btnOpenRegister.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openModal(registerModal); }));
  btnOpenDownload.forEach(b => b.addEventListener('click', (e) => { e.preventDefault(); openModal(downloadModal); }));

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target === btn || btn.classList.contains('modal-close-btn') || btn.classList.contains('modal-close-btn-action')) {
        closeModal();
      }
    });
  });

  // Escuchar tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Formulario de registro interactivo
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const role = regForm.querySelector('input[name="user_role"]:checked')?.value || 'Estudiante';
      const name = document.getElementById('reg-name')?.value || 'Usuario';
      closeModal();
      showToast(`¡Bienvenido/a a AccedeED, ${name}! Tu cuenta como ${role} ha sido habilitada.`);
    });
  }
}

/* ==========================================================================
   6. Inicializar Pizarra por defecto
   ========================================================================== */
function initWhiteboard() {
  setupCanvas();
}

/* ==========================================================================
   7. Formulario de Newsletter
   ========================================================================== */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value) {
        showToast(`✓ ¡Gracias! Te has suscrito con: ${input.value}`);
        input.value = '';
      }
    });
  }
}

/* ==========================================================================
   Notificación Toast Flotante
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}
