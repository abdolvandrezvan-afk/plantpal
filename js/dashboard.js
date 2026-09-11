// PlantPal - داشبورد
// این فایل مسئول نمایش کارهای امروز و گیاهان سالم است.

// ============================================
// بخش ۱: تنظیمات
// ============================================

// آستانه آبیاری (روز)
const WATERING_THRESHOLD_DAYS = 7;

// ============================================
// بخش ۲: توابع کمکی
// ============================================

// محاسبه تعداد روز از آخرین آبیاری
function getDaysSinceLastWatering(careLogs) {
  if (!careLogs || careLogs.length === 0) {
    return null; // هرگز آبیاری نشده
  }

  const lastLog = careLogs[0]; // جدیدترین
  const lastDate = new Date(lastLog.date);
  const now = new Date();
  const diffMs = now - lastDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

// بررسی نیاز به آبیاری
function needsWatering(careLogs) {
  const days = getDaysSinceLastWatering(careLogs);
  if (days === null) return true;
  return days >= WATERING_THRESHOLD_DAYS;
}

// ساخت متن وضعیت
function getWateringStatusText(days) {
  if (days === null) return 'هرگز آبیاری نشده';
  if (days === 0) return 'امروز آبیاری شده';
  if (days === 1) return '۱ روز پیش آبیاری شده';
  return days + ' روز پیش آبیاری شده';
}

// ============================================
// بخش ۳: نمایش داشبورد
// ============================================

async function renderDashboard() {
  try {
    const plants = await getAllPlants();

    const todayTasksDiv = document.getElementById('today-tasks');
    const todayTasksList = document.getElementById('today-tasks-list');
    const healthySection = document.getElementById('healthy-plants-section');
    const emptyState = document.getElementById('empty-state');

    // اگر هیچ گیاهی نیست
    if (plants.length === 0) {
      if (todayTasksDiv) todayTasksDiv.style.display = 'none';
      if (healthySection) healthySection.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    // بررسی هر گیاه
    const plantsNeedingWater = [];
    const healthyPlants = [];

    for (const plant of plants) {
      const careLogs = await getCareLogsByPlantId(plant.id);
      const days = getDaysSinceLastWatering(careLogs);

      if (needsWatering(careLogs)) {
        plantsNeedingWater.push({
          plant: plant,
          days: days
        });
      } else {
        healthyPlants.push(plant);
      }
    }

    // نمایش کارهای امروز
    if (plantsNeedingWater.length > 0) {
      if (todayTasksDiv) todayTasksDiv.style.display = 'block';
      if (todayTasksList) {
        todayTasksList.innerHTML = '';
        plantsNeedingWater.forEach(function(item) {
          const taskElement = createTodayTaskItem(item.plant, item.days);
          todayTasksList.appendChild(taskElement);
        });
      }
    } else {
      if (todayTasksDiv) todayTasksDiv.style.display = 'none';
    }

    // نمایش گیاهان سالم
    if (healthyPlants.length > 0) {
      if (healthySection) healthySection.style.display = 'block';
      const plantsList = document.getElementById('plants-list');
      if (plantsList) {
        plantsList.innerHTML = '';
        healthyPlants.forEach(function(plant) {
          const card = createPlantCard(plant);
          plantsList.appendChild(card);
        });
      }
    } else {
      if (healthySection) healthySection.style.display = 'none';
    }

    // پیام خالی
    if (emptyState) emptyState.style.display = 'none';

    console.log('✓ داشبورد نمایش داده شد');
    console.log('  - نیاز به آبیاری:', plantsNeedingWater.length);
    console.log('  - سالم:', healthyPlants.length);

  } catch (error) {
    console.error('✗ خطا در نمایش داشبورد:', error);
  }
}

// ساخت آیتم کار امروز
function createTodayTaskItem(plant, days) {
  const item = document.createElement('div');
  item.className = 'today-task-item';

  const info = document.createElement('div');
  info.className = 'today-task-info';

  const name = document.createElement('h4');
  name.className = 'today-task-name';
  name.textContent = '💧 ' + plant.name;
  name.addEventListener('click', function() {
    openPlantDetails(plant.id);
  });

  const status = document.createElement('span');
  status.className = 'today-task-status';
  status.textContent = getWateringStatusText(days);

  info.appendChild(name);
  info.appendChild(status);

  const actions = document.createElement('div');
  actions.className = 'today-task-actions';

  const waterBtn = document.createElement('button');
  waterBtn.className = 'btn btn-primary';
  waterBtn.textContent = 'ثبت آبیاری';
  waterBtn.addEventListener('click', function() {
    currentPlantId = plant.id;
    openAddCareModal();
  });

  actions.appendChild(waterBtn);

  item.appendChild(info);
  item.appendChild(actions);

  return item;
}