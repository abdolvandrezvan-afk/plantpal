// PlantPal - مدیریت تنظیمات
// این فایل مسئول صفحه تنظیمات است.

// ============================================
// بخش ۱: راه‌اندازی
// ============================================

function initSettings() {
  console.log('✓ تنظیمات راه‌اندازی شد');

  // اتصال دکمه‌های تم
  const themeButtons = document.querySelectorAll('[data-theme-option]');
  themeButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const theme = btn.getAttribute('data-theme-option');
      setTheme(theme);
    });
  });

  console.log('✓ دکمه‌های تم متصل شدند. تعداد:', themeButtons.length);
}