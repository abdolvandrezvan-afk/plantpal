// PlantPal - مدیریت مراقبت از گیاه
// این فایل مسئول ثبت، نمایش و حذف تاریخچه آبیاری است.

// ============================================
// بخش ۱: متغیرهای سراسری
// ============================================

let currentCarePlantId = null;

// ============================================
// بخش ۲: باز و بسته کردن Modal
// ============================================

function openAddCareModal() {
  if (!currentPlantId) {
    console.error('✗ شناسه گیاه موجود نیست');
    return;
  }

  currentCarePlantId = currentPlantId;

  const dateInput = document.getElementById('care-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
  }

  const noteInput = document.getElementById('care-note');
  if (noteInput) {
    noteInput.value = '';
  }

  const modal = document.getElementById('modal-add-care');
  if (modal) {
    modal.classList.add('active');
    console.log('✓ Modal ثبت آبیاری باز شد');
  }
}

function closeAddCareModal() {
  const modal = document.getElementById('modal-add-care');
  if (modal) {
    modal.classList.remove('active');
    console.log('✓ Modal ثبت آبیاری بسته شد');
  }
}

// ============================================
// بخش ۳: ذخیره آبیاری
// ============================================

async function handleAddCare(event) {
  event.preventDefault();

  try {
    const date = document.getElementById('care-date').value;
    const note = document.getElementById('care-note').value.trim();

    if (!date) {
      alert('تاریخ اجباری است.');
      return;
    }

    const careLogData = {
      plantId: currentCarePlantId,
      type: 'water',
      date: new Date(date).toISOString(),
      note: note
    };

    await saveCareLog(careLogData);
    console.log('✓ آبیاری ثبت شد');

    closeAddCareModal();

    // به‌روزرسانی تاریخچه صفحه جزئیات
    await renderCareLogs(currentCarePlantId);

    // به‌روزرسانی داشبورد (صفحه اصلی)
    await renderDashboard();

  } catch (error) {
    console.error('✗ خطا در ثبت آبیاری:', error);
    alert('خطا در ثبت آبیاری.');
  }
}

// ============================================
// بخش ۴: نمایش تاریخچه آبیاری
// ============================================

async function renderCareLogs(plantId) {
  try {
    const careLogs = await getCareLogsByPlantId(plantId);

    const listContainer = document.getElementById('care-logs-list');
    const emptyState = document.getElementById('empty-care-logs');

    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (careLogs.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      listContainer.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    listContainer.style.display = 'block';

    careLogs.forEach(function(log) {
      const item = createCareLogItem(log);
      listContainer.appendChild(item);
    });

    console.log('✓ تاریخچه آبیاری نمایش داده شد. تعداد:', careLogs.length);

  } catch (error) {
    console.error('✗ خطا در نمایش تاریخچه آبیاری:', error);
  }
}

function createCareLogItem(log) {
  const item = document.createElement('div');
  item.className = 'care-log-item';

  const info = document.createElement('div');
  info.className = 'care-log-info';

  const date = document.createElement('span');
  date.className = 'care-log-date';
  date.textContent = '💧 ' + formatDate(log.date);

  info.appendChild(date);

  if (log.note) {
    const note = document.createElement('span');
    note.className = 'care-log-note';
    note.textContent = log.note;
    info.appendChild(note);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'care-log-delete';
  deleteBtn.textContent = '×';
  deleteBtn.title = 'حذف این آبیاری';
  deleteBtn.addEventListener('click', function(event) {
    event.stopPropagation();
    handleDeleteCareLog(log.id);
  });

  item.appendChild(info);
  item.appendChild(deleteBtn);

  return item;
}

// ============================================
// بخش ۵: حذف آبیاری
// ============================================

async function handleDeleteCareLog(logId) {
  const confirmed = confirm('آیا مطمئنی می‌خواهی این آبیاری را حذف کنی؟');
  if (!confirmed) {
    return;
  }

  try {
    await deleteCareLog(logId);
    console.log('✓ آبیاری حذف شد. شناسه:', logId);

    // به‌روزرسانی تاریخچه
    await renderCareLogs(currentCarePlantId);

    // به‌روزرسانی داشبورد
    await renderDashboard();

  } catch (error) {
    console.error('✗ خطا در حذف آبیاری:', error);
    alert('خطا در حذف آبیاری.');
  }
}

// ============================================
// بخش ۶: فرمت تاریخ
// ============================================

function formatDate(isoString) {
  if (!isoString) return '—';

  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return year + '/' + month + '/' + day;
}