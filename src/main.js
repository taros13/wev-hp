/**
 * 合同会社サンプルクリエイティブ - メインJavaScript
 * ミニマルデザイン対応
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initStickyHeader();
  initHamburgerMenu();
  initSmoothScroll();
  initCounterAnimation();
  initFormHandler();
});

/**
 * スクロールアニメーション（Intersection Observer）
 */
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  document
    .querySelectorAll('.anim-fade, .anim-reveal')
    .forEach((el) => observer.observe(el));
}

/**
 * スティッキーヘッダー
 */
function initStickyHeader() {
  const header = document.getElementById('header');
  window.addEventListener(
    'scroll',
    () => {
      header.classList.toggle('header--scrolled', window.scrollY > 80);
    },
    { passive: true }
  );
}

/**
 * ハンバーガーメニュー
 */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * スムーズスクロール
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const id = anchor.getAttribute('href');
      if (id === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.querySelector(id);
      if (el) {
        const offset = 80;
        const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

/**
 * カウンターアニメーション
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const end = parseInt(target.dataset.count, 10);
          const duration = 2200;
          const start = performance.now();

          function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            target.textContent = Math.floor(end * eased);
            if (t < 1) requestAnimationFrame(tick);
            else target.textContent = end;
          }

          requestAnimationFrame(tick);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

/**
 * フォーム送信（Google Forms連携）
 */
function initFormHandler() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const GOOGLE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScLFiZyJ-yJ0W3nwxm8oEyne42Spkup50RrF4axR1MX0yF_Xw/formResponse';

  const FIELD_MAP = {
    name: 'entry.1000159542',
    company: 'entry.1909823128',
    email: 'entry.590241690',
    phone: 'entry.1079991580',
    service: 'entry.1114781811',
    message: 'entry.495810975',
  };

  const SERVICE_LABELS = {
    youtube: 'YouTube運用代行',
    tiktok: 'TikTok運用代行',
    documentary: '密着系撮影・ドキュメンタリー',
    training: '研修・教育動画制作',
    other: 'その他',
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const original = btn.innerHTML;

    btn.textContent = '送信中...';
    btn.disabled = true;
    btn.style.opacity = '0.6';

    const fd = new FormData();
    fd.append(FIELD_MAP.name, form.name.value);
    fd.append(FIELD_MAP.company, form.company.value);
    fd.append(FIELD_MAP.email, form.email.value);
    fd.append(FIELD_MAP.phone, form.phone.value);
    fd.append(FIELD_MAP.service, SERVICE_LABELS[form.service.value] || '');
    fd.append(FIELD_MAP.message, form.message.value);

    try {
      await fetch(GOOGLE_FORM_URL, { method: 'POST', body: fd, mode: 'no-cors' });
    } catch (_) {
      /* no-corsモードでは常に成功 */
    }

    btn.textContent = '送信しました';
    btn.style.opacity = '1';
    btn.style.background = 'var(--accent)';
    btn.style.color = 'var(--white)';
    btn.style.borderColor = 'var(--accent)';

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
      btn.style.opacity = '';
      form.reset();
    }, 3000);
  });
}
