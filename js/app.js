// PlantPal - فایل اصلی برنامه

console.log('🌱 PlantPal در حال بارگذاری...');

document.addEventListener('DOMContentLoaded', async function() {
  console.log('✓ صفحه بارگذاری شد');

  // باز کردن پایگاه داده
  try {
    await openDatabase();
    console.log('✓ پایگاه داده آماده است');

    // آزمایش: خواندن همه گیاهان
    const plants = await getAllPlants();
    console.log('✓ تعداد گیاهان فعلی:', plants.length);

  } catch (error) {
    console.error('✗ خطا در راه‌اندازی:', error);
  }
});