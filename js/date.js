// PlantPal - مدیریت تاریخ
// این فایل مسئول فرمت تاریخ (شمسی و میلادی) است.

// ============================================
// بخش ۱: تنظیمات اولیه
// ============================================

const DATE_FORMAT_KEY = 'plantpal-date-format';
const DATE_FORMATS = {
  SHAMSI: 'shamsi',
  MILADI: 'miladi'
};

// ============================================
// بخش ۲: توابع اصلی
// ============================================

function getSavedDateFormat() {
  const saved = localStorage.getItem(DATE_FORMAT_KEY);
  if (saved && Object.values(DATE_FORMATS).includes(saved)) {
    return saved;
  }
  return DATE_FORMATS.SHAMSI;
}

function saveDateFormat(format) {
  localStorage.setItem(DATE_FORMAT_KEY, format);
  console.log('✓ فرمت تاریخ ذخیره شد:', format);
}

function getCurrentDateFormat() {
  return getSavedDateFormat();
}

function setDateFormat(format) {
  if (!Object.values(DATE_FORMATS).includes(format)) {
    console.error('✗ فرمت تاریخ نامعتبر:', format);
    return;
  }

  saveDateFormat(format);
  updateDateFormatButtons(format);
  console.log('✓ فرمت تاریخ تغییر کرد:', format);
}

// ============================================
// بخش ۳: فرمت تاریخ
// ============================================

function formatDate(isoString) {
  if (!isoString) return '—';

  const date = new Date(isoString);
  const format = getSavedDateFormat();

  if (format === DATE_FORMATS.SHAMSI) {
    return formatShamsi(date);
  } else {
    return formatMiladi(date);
  }
}

function formatShamsi(date) {
  const formatter = new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;

  return toEnglishDigits(year) + '/' +
         toEnglishDigits(month) + '/' +
         toEnglishDigits(day);
}

function formatMiladi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return year + '/' + month + '/' + day;
}

// ============================================
// بخش ۴: تبدیل اعداد
// ============================================

function toEnglishDigits(str) {
  if (!str) return str;

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  let result = String(str);

  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianDigits[i], 'g'), i);
    result = result.replace(new RegExp(arabicDigits[i], 'g'), i);
  }

  return result;
}

// ============================================
// بخش ۵: راه‌اندازی
// ============================================

function initDate() {
  const savedFormat = getSavedDateFormat();
  updateDateFormatButtons(savedFormat);
  console.log('✓ فرمت تاریخ راه‌اندازی شد:', savedFormat);
}

// ============================================
// بخش ۶: به‌روزرسانی دکمه‌ها
// ============================================

function updateDateFormatButtons(format) {
  const buttons = document.querySelectorAll('[data-date-format]');
  buttons.forEach(function(btn) {
    const btnFormat = btn.getAttribute('data-date-format');
    if (btnFormat === format) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}