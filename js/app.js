// PlantPal - فایل اصلی برنامه
// این فایل همه بخش‌ها را به هم وصل می‌کند.

console.log('🌱 PlantPal در حال بارگذاری...');

document.addEventListener('DOMContentLoaded', async function() {
  console.log('✓ صفحه بارگذاری شد');

  try {
    // ۱. باز کردن پایگاه داده
    await openDatabase();
    console.log('✓ پایگاه داده آماده است');

    // ۲. ترجمه صفحه
    translatePage();

    // ۳. نمایش فهرست گیاهان
    await renderPlantsList();

    // ۴. وصل کردن رویدادها
    setupEventListeners();

    console.log('✓ PlantPal با موفقیت راه‌اندازی شد');

  } catch (error) {
    console.error('✗ خطا در راه‌اندازی:', error);
  }
});

// ============================================
// اتصال رویدادها
// ============================================

function setupEventListeners() {
  // دکمه «افزودن گیاه» در صفحه اصلی
  const btnAddPlant = document.getElementById('btn-add-plant');
  if (btnAddPlant) {
    btnAddPlant.addEventListener('click', function() {
      clearAddForm();
      isEditMode = false;
      editingPlantId = null;
      showAddPage();
    });
  }

  // دکمه «بازگشت» از صفحه افزودن
  const btnBackFromAdd = document.getElementById('btn-back-from-add');
  if (btnBackFromAdd) {
    btnBackFromAdd.addEventListener('click', function() {
      showHomePage();
      renderPlantsList();
    });
  }

  // دکمه «انصراف» از فرم افزودن
  const btnCancelAdd = document.getElementById('btn-cancel-add');
  if (btnCancelAdd) {
    btnCancelAdd.addEventListener('click', function() {
      showHomePage();
      renderPlantsList();
    });
  }

  // فرم افزودن گیاه
  const formAddPlant = document.getElementById('form-add-plant');
  if (formAddPlant) {
    formAddPlant.addEventListener('submit', function(event) {
      if (isEditMode) {
        handleUpdatePlant(event);
      } else {
        handleAddPlant(event);
      }
    });
  }

  // دکمه «بازگشت» از صفحه جزئیات
  const btnBackFromDetails = document.getElementById('btn-back-from-details');
  if (btnBackFromDetails) {
    btnBackFromDetails.addEventListener('click', function() {
      showHomePage();
      renderPlantsList();
    });
  }

  // دکمه «ویرایش» در صفحه جزئیات
  const btnEditPlant = document.getElementById('btn-edit-plant');
  if (btnEditPlant) {
    btnEditPlant.addEventListener('click', handleEditPlant);
  }

  // دکمه «حذف» در صفحه جزئیات
  const btnDeletePlant = document.getElementById('btn-delete-plant');
  if (btnDeletePlant) {
    btnDeletePlant.addEventListener('click', handleDeletePlant);
  }

  console.log('✓ رویدادها وصل شدند');
}