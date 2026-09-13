// PlantPal - مدیریت حالت نمایش (تم)
// این فایل مسئول تغییر بین حالت روشن، تاریک و خودکار است.

// ============================================
// بخش ۱: تنظیمات اولیه
// ============================================

const THEME_KEY = 'plantpal-theme';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// ============================================
// بخش ۲: توابع اصلی
// ============================================

function getSavedTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved && Object.values(THEMES).includes(saved)) {
    return saved;
  }
  return THEMES.AUTO;
}

function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  console.log('✓ تم ذخیره شد:', theme);
}

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return THEMES.DARK;
  }
  return THEMES.LIGHT;
}

function applyTheme(theme) {
  let effectiveTheme = theme;

  if (theme === THEMES.AUTO) {
    effectiveTheme = getSystemTheme();
  }

  document.documentElement.setAttribute('data-theme', effectiveTheme);
  saveTheme(theme);

  console.log('✓ تم اعمال شد:', theme, '(', effectiveTheme, ')');
}

function setTheme(theme) {
  if (!Object.values(THEMES).includes(theme)) {
    console.error('✗ تم نامعتبر:', theme);
    return;
  }

  applyTheme(theme);
  updateThemeButtons(theme);
}

function getCurrentTheme() {
  return getSavedTheme();
}

function getEffectiveTheme() {
  const theme = getSavedTheme();
  if (theme === THEMES.AUTO) {
    return getSystemTheme();
  }
  return theme;
}

// ============================================
// بخش ۳: راه‌اندازی اولیه
// ============================================

function initTheme() {
  const savedTheme = getSavedTheme();
  applyTheme(savedTheme);
  updateThemeButtons(savedTheme);

  // گوش دادن به تغییرات سیستم
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      if (getSavedTheme() === THEMES.AUTO) {
        applyTheme(THEMES.AUTO);
      }
    });
  }

  console.log('✓ تم راه‌اندازی شد. تم فعلی:', savedTheme);
}

// ============================================
// بخش ۴: به‌روزرسانی دکمه‌ها
// ============================================

function updateThemeButtons(theme) {
  const buttons = document.querySelectorAll('[data-theme-option]');
  buttons.forEach(function(btn) {
    const btnTheme = btn.getAttribute('data-theme-option');
    if (btnTheme === theme) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}