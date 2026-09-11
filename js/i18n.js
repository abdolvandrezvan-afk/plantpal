// PlantPal - مدیریت ترجمه (i18n)
// این فایل مسئول ترجمه متن‌های برنامه بین فارسی و انگلیسی است.

// ============================================
// بخش ۱: تنظیمات اولیه
// ============================================

const TRANSLATIONS = {
  fa: {
    appTitle: '🌱 PlantPal',
    appSubtitle: 'گیاه‌یار — همراه شما در مراقبت از گیاهان',

    myPlants: 'گیاهان من',
    addPlant: '+ افزودن گیاه',
    emptyPlantsTitle: 'هنوز گیاهی ثبت نکرده‌اید.',
    emptyPlantsHint: 'برای شروع، روی «افزودن گیاه» کلیک کنید.',

    addPlantTitle: 'افزودن گیاه جدید',
    back: '← بازگشت',
    plantName: 'نام گیاه *',
    plantType: 'نوع گیاه',
    plantLocation: 'محل نگهداری',
    plantImage: 'تصویر گیاه (اختیاری)',
    plantNotes: 'یادداشت (اختیاری)',
    save: 'ذخیره',
    cancel: 'انصراف',

    plantDetails: 'جزئیات گیاه',
    name: 'نام گیاه:',
    type: 'نوع گیاه:',
    location: 'محل نگهداری:',
    notes: 'یادداشت:',
    edit: 'ویرایش',
    delete: 'حذف',

    careHistory: 'تاریخچه آبیاری',
    addCare: '+ ثبت آبیاری جدید',
    emptyCareLogs: 'هنوز آبیاری ثبت نشده است.',

    confirmDelete: 'آیا مطمئنی می‌خواهی این گیاه را حذف کنی؟',
    plantNotFound: 'گیاه پیدا نشد.',

    version: 'نسخه ۰.۱.۰ — در حال ساخت'
  },

  en: {
    appTitle: '🌱 PlantPal',
    appSubtitle: 'Your companion in plant care',

    myPlants: 'My Plants',
    addPlant: '+ Add Plant',
    emptyPlantsTitle: 'No plants added yet.',
    emptyPlantsHint: 'Click "Add Plant" to start.',

    addPlantTitle: 'Add New Plant',
    back: '← Back',
    plantName: 'Plant Name *',
    plantType: 'Plant Type',
    plantLocation: 'Location',
    plantImage: 'Plant Image (optional)',
    plantNotes: 'Notes (optional)',
    save: 'Save',
    cancel: 'Cancel',

    plantDetails: 'Plant Details',
    name: 'Name:',
    type: 'Type:',
    location: 'Location:',
    notes: 'Notes:',
    edit: 'Edit',
    delete: 'Delete',

    careHistory: 'Watering History',
    addCare: '+ Add Watering',
    emptyCareLogs: 'No watering recorded yet.',

    confirmDelete: 'Are you sure you want to delete this plant?',
    plantNotFound: 'Plant not found.',

    version: 'Version 0.1.0 — In progress'
  }
};

let currentLang = 'fa';

// ============================================
// بخش ۲: توابع ترجمه
// ============================================

function t(key) {
  const lang = TRANSLATIONS[currentLang];
  if (lang && lang[key]) {
    return lang[key];
  }
  return key;
}

function setLanguage(lang) {
  if (TRANSLATIONS[lang]) {
    currentLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    console.log('✓ زبان تغییر کرد:', lang);
    return true;
  }
  return false;
}

function getCurrentLanguage() {
  return currentLang;
}

function translatePage() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(function(element) {
    const key = element.getAttribute('data-i18n');
    element.textContent = t(key);
  });
  console.log('✓ صفحه ترجمه شد. تعداد:', elements.length);
}