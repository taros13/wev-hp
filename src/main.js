/**
 * 合同会社WEV - メインJavaScript
 * ポップデザイン対応：スクロールアニメーション、ナビゲーション制御、カウンターアニメーション
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
 * Intersection Observerによるスクロールアニメーション
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
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.animate-pop').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * スクロール時のヘッダースタイル変更
 */
function initStickyHeader() {
  const header = document.getElementById('header');

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 80) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    },
    { passive: true }
  );
}

/**
 * ハンバーガーメニューの開閉制御
 */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active')
      ? 'hidden'
      : '';
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
 * アンカーリンクのスムーズスクロール
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

/**
 * 数字のカウントアップアニメーション
 */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-chip__number[data-count]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const countTo = parseInt(target.getAttribute('data-count'), 10);
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress =
              progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            target.textContent = Math.floor(countTo * easedProgress);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              target.textContent = countTo;
            }
          }

          requestAnimationFrame(updateCounter);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

/**
 * フォーム送信ハンドラ（デモ用）
 */
function initFormHandler() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>送信中... ⏳</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = '<span>送信しました ✅</span>';
      submitBtn.style.background = '#00f5d4';
      submitBtn.style.color = '#1a1a2e';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        form.reset();
      }, 3000);
    }, 2000);
  });
}
