/* ═══════════════════════════════════════════
   JEMAN KALITA — script.js
   ═══════════════════════════════════════════ */

// ─── Cursor-reactive Dotted Background ──────
document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  document.body.style.setProperty('--mouse-x', `${x}px`);
  document.body.style.setProperty('--mouse-y', `${y}px`);
});

// ─── Nav scroll shadow & scroll progress & back-to-top ─
const nav = document.getElementById('main-nav');
const scrollProgress = document.getElementById('scroll-progress');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 10);
  
  // Progress bar
  if (scrollProgress) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (y / totalHeight) * 100 : 0;
    scrollProgress.style.width = `${progress}%`;
  }
  
  // Back to top
  if (backToTop) {
    if (y > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── Scroll-reveal via IntersectionObserver ─
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Stagger children inside the section if any
      const childrenToStagger = entry.target.querySelectorAll('.achieve-block, .sport-block, .fun-project-list li, .work-card, .contact-row');
      childrenToStagger.forEach((child, idx) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(15px)';
        child.style.transition = `opacity 0.5s ease ${idx * 0.1}s, transform 0.5s ease ${idx * 0.1}s`;
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          });
        });
      });
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

function observeSections() {
  document.querySelectorAll('.section-inner, [data-reveal]').forEach(el => {
    el.classList.remove('is-visible');
    revealObserver.observe(el);
  });
}

// ─── Sliding Nav Sync ───────────────────────
function syncNavSlider() {
  const activeLink = document.querySelector('.nav-links a.active');
  const slider = document.querySelector('.nav-slider');
  const navLinksContainer = document.querySelector('.nav-links');
  if (activeLink && slider && navLinksContainer) {
    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = navLinksContainer.getBoundingClientRect();
    const leftOffset = linkRect.left - containerRect.left;
    slider.style.left = `${leftOffset}px`;
    slider.style.width = `${linkRect.width}px`;
  }
}
window.addEventListener('resize', syncNavSlider);

// ─── Split text for word-by-word reveal ─────
function splitTextForReveal(selector, baseDelay = 0.1) {
  document.querySelectorAll(selector).forEach(el => {
    // Only split if not already split
    if (el.classList.contains('text-split')) return;
    
    const text = el.innerText;
    el.innerText = '';
    el.classList.add('text-split');
    
    const words = text.split(' ');
    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word-reveal';
      wordSpan.style.marginRight = '0.25em';
      
      const charSpan = document.createElement('span');
      charSpan.className = 'char-reveal';
      charSpan.style.animationDelay = `${baseDelay + wordIdx * 0.15}s`;
      charSpan.innerHTML = word === '' ? '&nbsp;' : word;
      
      wordSpan.appendChild(charSpan);
      el.appendChild(wordSpan);
    });
  });
}

// ─── Page switching ─────────────────────────
const SITE_BASE_URL = 'https://jeman.vercel.app';
const BLOG_POSTS = {
  'one-tweet-changed-everything': {
    pageId: 'blog-one-tweet-changed-everything',
    title: 'One Tweet Changed Everything',
    slug: '/blog/one-tweet-changed-everything',
    excerpt: 'A cold email, a rejection, and one tweet that unexpectedly changed my summer. How sharing my journey online led to founders reaching out, startup opportunities, and a reminder that visibility creates luck.'
  }
};

const DEFAULT_META = {
  title: 'Jeman Kalita — Architecting Systems, Quant & AI',
  description: 'The personal digital archive of Jeman Kalita. Building at the intersection of quantitative finance, artificial intelligence, and high-performance software systems.',
  url: SITE_BASE_URL + '/',
  type: 'website',
  image: SITE_BASE_URL + '/og-image.jpg'
};

function setMeta(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

function updateMetadata(pageId) {
  const post = Object.values(BLOG_POSTS).find(item => item.pageId === pageId);
  const meta = post ? {
    title: `${post.title} | Jeman Kalita`,
    description: post.excerpt,
    url: SITE_BASE_URL + post.slug,
    type: 'article',
    image: DEFAULT_META.image
  } : DEFAULT_META;

  document.title = meta.title;
  setMeta('meta[name="title"]', 'content', meta.title);
  setMeta('meta[name="description"]', 'content', meta.description);
  setMeta('link[rel="canonical"]', 'href', meta.url);
  setMeta('meta[property="og:type"]', 'content', meta.type);
  setMeta('meta[property="og:url"]', 'content', meta.url);
  setMeta('meta[property="og:title"]', 'content', meta.title);
  setMeta('meta[property="og:description"]', 'content', meta.description);
  setMeta('meta[property="og:image"]', 'content', meta.image);
  setMeta('meta[property="twitter:url"]', 'content', meta.url);
  setMeta('meta[property="twitter:title"]', 'content', meta.title);
  setMeta('meta[property="twitter:description"]', 'content', meta.description);
  setMeta('meta[property="twitter:image"]', 'content', meta.image);
}

function getRouteTarget() {
  const path = location.pathname.replace(/\/$/, '');
  const blogPath = path.match(/^\/blog\/([^/]+)$/);
  if (blogPath && BLOG_POSTS[blogPath[1]]) return BLOG_POSTS[blogPath[1]].pageId;

  const pathPage = path.replace(/^\//, '');
  const validPages = ['projects', 'blogs', 'interests', 'contact'];
  if (validPages.includes(pathPage)) return pathPage;

  const rawHash = location.hash.replace(/^#(page-)?/, '') || 'home';
  return ['home', ...validPages].includes(rawHash) ? rawHash : 'home';
}

function routeForPage(pageId) {
  const post = Object.values(BLOG_POSTS).find(item => item.pageId === pageId);
  if (post) return post.slug;
  return pageId === 'home' ? '/' : '/' + pageId;
}

function showPage(pageId, shouldPush = true) {
  const allPages = document.querySelectorAll('.page');
  const allLinks = document.querySelectorAll('.nav-links a, .nav-brand');

  allPages.forEach(p => {
    p.classList.remove('active');
    p.style.display = 'none';
  });

  const target = document.getElementById('page-' + pageId);
  if (!target) return;

  // Force animation restart by briefly removing and re-adding active
  target.style.display = 'block';
  // Trigger reflow so animation re-fires
  void target.offsetWidth;
  target.classList.add('active');

  // Update nav active state
  allLinks.forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId || (pageId.startsWith('blog-') && a.dataset.page === 'blogs'));
  });
  syncNavSlider();

  // Scroll to top smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-observe sections in the newly shown page
  requestAnimationFrame(() => {
    target.querySelectorAll('.section-inner').forEach(el => {
      el.classList.remove('is-visible');
      revealObserver.observe(el);
    });
  });

  // Re-trigger word reveals
  if (pageId === 'home') splitTextForReveal('#page-home .hero-name');
  splitTextForReveal(`#page-${pageId} .page-title`);

  updateMetadata(pageId);

  if (shouldPush) {
    history.pushState({ pageId }, '', routeForPage(pageId));
  }
}

// ─── Bind nav links ──────────────────────────
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

document.querySelectorAll('[data-blog-slug]').forEach(link => {
  link.addEventListener('click', e => {
    const post = BLOG_POSTS[link.dataset.blogSlug];
    if (!post) return;
    e.preventDefault();
    showPage(post.pageId);
  });
});

window.addEventListener('popstate', () => {
  showPage(getRouteTarget(), false);
});

// ─── Parallax on hero image ──────────────────
const heroWrap = document.querySelector('.hero-image-wrap');
if (heroWrap) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroWrap.style.setProperty('--parallax-y', `${y * 0.08}px`);
  }, { passive: true });
}

// ─── Init ────────────────────────────────────
(function init() {
  const startPage = getRouteTarget();

  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
    p.classList.remove('active');
  });

  const startEl = document.getElementById('page-' + startPage);
  if (startEl) {
    startEl.style.display = 'block';
    startEl.classList.add('active');
  }

  document.querySelectorAll('[data-page]').forEach(a => {
    a.classList.toggle('active', a.dataset.page === startPage || (startPage.startsWith('blog-') && a.dataset.page === 'blogs'));
  });

  syncNavSlider();
  updateMetadata(startPage);

  // Initial split text reveals
  splitTextForReveal('.hero-name', 0.2);
  splitTextForReveal('.page-title', 0.2);

  observeSections();
})();


// ─── Smart info-card flip (Above ↔ Below) ───────────────────
(function initInfoCardFlip() {
  const CARD_ESTIMATED_HEIGHT = 160; 
  const V_MARGIN = 12;  
  const H_MARGIN = 10;  

  function positionCard(token) {
    const card = token.querySelector('.info-card');
    if (!card) return;
    card.style.marginLeft = '';
    const tokenRect = token.getBoundingClientRect();
    const spaceAbove  = tokenRect.top;
    const spaceBelow  = window.innerHeight - tokenRect.bottom;
    const cardHeight  = card.offsetHeight || CARD_ESTIMATED_HEIGHT;

    if (spaceAbove < cardHeight + V_MARGIN && spaceBelow > spaceAbove) {
      token.classList.add('card-flip');
    } else {
      token.classList.remove('card-flip');
    }

    const cardRect = card.getBoundingClientRect();
    const vw = window.innerWidth;
    let nudge = 0;
    if (cardRect.left < H_MARGIN) nudge = H_MARGIN - cardRect.left;
    else if (cardRect.right > vw - H_MARGIN) nudge = (vw - H_MARGIN) - cardRect.right;
    if (nudge !== 0) card.style.marginLeft = nudge + 'px';
  }

  function resetCard(token) {
    const card = token.querySelector('.info-card');
    if (card) card.style.marginLeft = '';
  }

  document.querySelectorAll('.info-token').forEach(token => {
    token.addEventListener('mouseenter', () => positionCard(token));
    token.addEventListener('focusin',    () => positionCard(token));
    token.addEventListener('mouseleave', () => resetCard(token));
    token.addEventListener('focusout',   () => resetCard(token));
  });
})();

// ─── Dynamic Media Cover System ─────────────────────────
const DYNAMIC_MEDIA = {
  sports: [
    '/interests/Sports/d04e6cb8f2aa1c2f13fe4d7085ea8c23.mp4'
  ],
  poker: [
    '/interests/Poker/download (1).jpg',
    '/interests/Poker/download.jpg',
    '/interests/Poker/glowing lights casino chips and cards s Poker cards floating, gambling and casino concept , banner copy space  ,AI_ Stock Photo _ Adobe Stock.jpg'
  ],
  movies: [
    '/interests/movies/Movie Shooting Silhouette Film Festival Poster Background, Film Festival, Tv Series, Film Background Image And Wallpaper for Free Download.jpg',
    '/interests/movies/One of my favorite directors!.jpg',
    '/interests/movies/download (3).jpg',
    '/interests/movies/download.jpg'
  ],
  books: [
    '/interests/books/Free  Books, Retro, Library Background Images, Books Background Photo Background PNG and Vectors.jpg',
    '/interests/books/download (1).jpg',
    '/interests/books/download.jpg'
  ],
  knowledge: [
    '/interests/knowledge stash/basically inside portia\'s head lmao.gif',
    '/interests/knowledge stash/download (1).gif',
    '/interests/knowledge stash/download.gif'
  ],
  people: [
    '/interests/inspiration/Dario-Amodei-copy.png',
    '/interests/inspiration/Elon-Musk.png',
    '/interests/inspiration/GettyImages-1258459705-e1700340943429.png',
    '/interests/inspiration/Jensen-Huang-copy.png',
    '/interests/inspiration/Mark-Zuckerberg.png',
    '/interests/inspiration/Sam-Altman.png',
    '/interests/inspiration/What Peter Thiel Saw in Jeffrey Epstein.jpg',
    '/interests/inspiration/meta-scale-ai-news-inc.png'
  ]
};

function initDynamicMedia() {
  const containers = document.querySelectorAll('.dynamic-media-container');
  containers.forEach(container => {
    const section = container.dataset.portalMedia;
    const files = DYNAMIC_MEDIA[section];
    if (!files || files.length === 0) return;

    // Create DOM elements dynamically based on file type
    files.forEach((file) => {
      let el;
      if (file.endsWith('.mp4') || file.endsWith('.webm')) {
        el = document.createElement('video');
        el.src = file;
        el.autoplay = true;
        el.muted = true;
        el.loop = true;
        el.playsInline = true;
        el.className = 'media-layer video-layer';
      } else {
        el = document.createElement('img');
        el.src = file;
        el.className = 'media-layer ' + (file.endsWith('.gif') ? 'gif-layer' : 'image-layer');
      }
      container.appendChild(el);
    });

    const layers = container.querySelectorAll('.media-layer');
    if (layers.length === 0) return;

    // Start playback & cycling logic
    let currentIndex = 0;
    layers[0].classList.add('active');

    if (layers.length > 1) {
      function showNextLayer() {
        const prevIndex = currentIndex;
        currentIndex = (currentIndex + 1) % layers.length;
        
        layers[prevIndex].classList.remove('active');
        layers[currentIndex].classList.add('active');
        
        scheduleNext();
      }

      function scheduleNext() {
        const currentLayer = layers[currentIndex];
        let delay = 2000; // 2 seconds for smooth deliberate pacing
        
        if (currentLayer.classList.contains('gif-layer')) {
          delay = 6000; // Allow GIF to loop naturally
        } else if (currentLayer.classList.contains('video-layer')) {
          delay = 8000; // Give video breathing room
        } else if (section === 'people') {
          delay = 4000; // Slower cinematic pacing for inspiration
        }
        
        setTimeout(showNextLayer, delay);
      }
      
      // Kickoff the cycle
      setTimeout(() => {
        scheduleNext();
      }, 100);
    }
  });
}

// Initialize on DOM load
initDynamicMedia();




