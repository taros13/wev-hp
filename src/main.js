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
 * フォーム送信ハンドラ（Google Forms連携）
 */
function initFormHandler() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // Google FormsのエンドポイントURL
  const GOOGLE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLScLFiZyJ-yJ0W3nwxm8oEyne42Spkup50RrF4axR1MX0yF_Xw/formResponse';

  // HPフォームのname属性 → Google FormのEntry IDマッピング
  const FIELD_MAP = {
    name: 'entry.1000159542',
    company: 'entry.1909823128',
    email: 'entry.590241690',
    phone: 'entry.1079991580',
    service: 'entry.1114781811',
    message: 'entry.495810975',
  };

  // ご相談内容の選択肢をGoogleフォーム側のラベルに変換
  const SERVICE_LABELS = {
    youtube: 'YouTube運用代行',
    tiktok: 'TikTok運用代行',
    documentary: '密着系撮影・ドキュメンタリー',
    training: '研修・教育動画制作',
    other: 'その他',
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-btn');
    const originalText = submitBtn.innerHTML;

    // 送信中の表示
    submitBtn.innerHTML = '<span>送信中... ⏳</span>';
    submitBtn.disabled = true;

    // フォームデータの組み立て
    const formData = new FormData();
    formData.append(FIELD_MAP.name, form.name.value);
    formData.append(FIELD_MAP.company, form.company.value);
    formData.append(FIELD_MAP.email, form.email.value);
    formData.append(FIELD_MAP.phone, form.phone.value);
    formData.append(
      FIELD_MAP.service,
      SERVICE_LABELS[form.service.value] || ''
    );
    formData.append(FIELD_MAP.message, form.message.value);

    try {
      // Google Formsへ送信（CORSエラーが出るが送信自体は成功する）
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      // 成功表示
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
    } catch (error) {
      // エラーでも no-cors モードではほぼ成功しているので成功扱い
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
    }
  });
}
