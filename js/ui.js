// PlantPal - مدیریت رابط کاربری (UI)
// این فایل مسئول نمایش و مخفی کردن صفحه‌هاست.

// ============================================
// بخش ۱: تنظیمات اولیه
// ============================================

const PAGES = {
  HOME: 'page-home',
  ADD: 'page-add',
  DETAILS: 'page-details'
};

// ============================================
// بخش ۲: مدیریت صفحه‌ها
// ============================================

// نمایش یک صفحه خاص و مخفی کردن بقیه
function showPage(pageId) {
  // مخفی کردن همه صفحه‌ها
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(function(page) {
    page.classList.remove('active');
  });

  // نمایش صفحه مورد نظر
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, 0);
    console.log('✓ صفحه نمایش داده شد:', pageId);
  } else {
    console.error('✗ صفحه پیدا نشد:', pageId);
  }
}

// رفتن به صفحه اصلی
function showHomePage() {
  showPage(PAGES.HOME);
}

// رفتن به صفحه افزودن
function showAddPage() {
  showPage(PAGES.ADD);
}

// رفتن به صفحه جزئیات
function showDetailsPage() {
  showPage(PAGES.DETAILS);
}

// ============================================
// بخش ۳: مدیریت پیام‌های خالی
// ============================================

// نمایش یا مخفی کردن پیام «هیچ گیاهی نیست»
function toggleEmptyPlantsState(isEmpty) {
  const emptyState = document.getElementById('empty-state');
  const plantsList = document.getElementById('plants-list');

  if (!emptyState || !plantsList) return;

  if (isEmpty) {
    emptyState.style.display = 'block';
    plantsList.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    plantsList.style.display = 'grid';
  }
}

// نمایش یا مخفی کردن پیام «هیچ آبیاری نیست»
function toggleEmptyCareLogsState(isEmpty) {
  const emptyState = document.getElementById('empty-care-logs');
  const careLogsList = document.getElementById('care-logs-list');

  if (!emptyState || !careLogsList) return;

  if (isEmpty) {
    emptyState.style.display = 'block';
    careLogsList.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    careLogsList.style.display = 'block';
  }
}

// ============================================
// بخش ۴: پاک کردن و پر کردن فرم
// ============================================

function clearAddForm() {
  const form = document.getElementById('form-add-plant');
  if (form) {
    form.reset();
    console.log('✓ فرم پاک شد');
  }
}

function fillAddForm(plant) {
  document.getElementById('add-name').value = plant.name || '';
  document.getElementById('add-type').value = plant.type || '';
  document.getElementById('add-location').value = plant.location || '';
  document.getElementById('add-notes').value = plant.notes || '';
}