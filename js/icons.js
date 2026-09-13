// PlantPal - مدیریت آیکون‌ها
// این فایل مسئول بارگذاری آیکون‌های SVG است.

// ============================================
// بخش ۱: تنظیمات
// ============================================

const ICONS_PATH = 'assets/icons/';

// ============================================
// بخش ۲: بارگذاری آیکون
// ============================================

async function loadIcon(name) {
  try {
    const response = await fetch(ICONS_PATH + name + '.svg');
    if (!response.ok) {
      throw new Error('آیکون پیدا نشد: ' + name);
    }
    return await response.text();
  } catch (error) {
    console.error('✗ خطا در بارگذاری آیکون:', name, error);
    return '';
  }
}

// ============================================
// بخش ۳: جایگزینی همه آیکون‌ها
// ============================================

async function loadAllIcons() {
  const iconElements = document.querySelectorAll('[data-icon]');

  console.log('✓ تعداد آیکون‌ها:', iconElements.length);

  for (const element of iconElements) {
    const iconName = element.getAttribute('data-icon');
    const svg = await loadIcon(iconName);
    if (svg) {
      element.innerHTML = svg;
    }
  }

  console.log('✓ همه آیکون‌ها بارگذاری شدند');
}