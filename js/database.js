// PlantPal - مدیریت پایگاه داده (IndexedDB)
// این فایل مسئول ذخیره و بازیابی اطلاعات گیاهان و آبیاری‌هاست.

// ============================================
// بخش ۱: تنظیمات اولیه
// ============================================

const DB_NAME = 'PlantPalDB';
const DB_VERSION = 1;
const STORE_PLANTS = 'plants';
const STORE_CARE_LOGS = 'careLogs';

// کاربر فعلی (برای آینده که چند‌کاربره شود)
const CURRENT_USER_ID = 'local-user';

let db = null;

// ============================================
// بخش ۲: باز کردن پایگاه داده
// ============================================

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(event) {
      const database = event.target.result;
      createStores(database);
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      console.log('✓ پایگاه داده با موفقیت باز شد');
      resolve(db);
    };

    request.onerror = function(event) {
      console.error('✗ خطا در باز کردن پایگاه داده:', event.target.error);
      reject(event.target.error);
    };
  });
}

// ============================================
// بخش ۳: ساخت Object Storeها
// ============================================

function createStores(database) {
  if (!database.objectStoreNames.contains(STORE_PLANTS)) {
    const plantsStore = database.createObjectStore(STORE_PLANTS, {
      keyPath: 'id',
      autoIncrement: true
    });

    plantsStore.createIndex('userId', 'userId', { unique: false });
    plantsStore.createIndex('name', 'name', { unique: false });

    console.log('✓ کشوی گیاهان ساخته شد');
  }

  if (!database.objectStoreNames.contains(STORE_CARE_LOGS)) {
    const careLogsStore = database.createObjectStore(STORE_CARE_LOGS, {
      keyPath: 'id',
      autoIncrement: true
    });

    careLogsStore.createIndex('plantId', 'plantId', { unique: false });
    careLogsStore.createIndex('date', 'date', { unique: false });

    console.log('✓ کشوی فعالیت‌های مراقبتی ساخته شد');
  }
}

// ============================================
// بخش ۴: توابع ذخیره
// ============================================

function savePlant(plantData) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();

    const plant = {
      name: plantData.name || '',
      type: plantData.type || '',
      location: plantData.location || '',
      image: plantData.image || null,
      notes: plantData.notes || '',
      userId: CURRENT_USER_ID,
      createdAt: now,
      updatedAt: now
    };

    const transaction = db.transaction([STORE_PLANTS], 'readwrite');
    const store = transaction.objectStore(STORE_PLANTS);
    const request = store.add(plant);

    request.onsuccess = function(event) {
      console.log('✓ گیاه ذخیره شد. شناسه:', event.target.result);
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      console.error('✗ خطا در ذخیره گیاه:', event.target.error);
      reject(event.target.error);
    };
  });
}

function updatePlant(plantId, plantData) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_PLANTS], 'readwrite');
    const store = transaction.objectStore(STORE_PLANTS);
    const getRequest = store.get(plantId);

    getRequest.onsuccess = function(event) {
      const existingPlant = event.target.result;

      if (!existingPlant) {
        reject(new Error('گیاه پیدا نشد'));
        return;
      }

      const updatedPlant = {
        ...existingPlant,
        name: plantData.name !== undefined ? plantData.name : existingPlant.name,
        type: plantData.type !== undefined ? plantData.type : existingPlant.type,
        location: plantData.location !== undefined ? plantData.location : existingPlant.location,
        image: plantData.image !== undefined ? plantData.image : existingPlant.image,
        notes: plantData.notes !== undefined ? plantData.notes : existingPlant.notes,
        updatedAt: new Date().toISOString()
      };

      const putRequest = store.put(updatedPlant);

      putRequest.onsuccess = function() {
        console.log('✓ گیاه ویرایش شد. شناسه:', plantId);
        resolve(updatedPlant);
      };

      putRequest.onerror = function(event) {
        console.error('✗ خطا در ویرایش گیاه:', event.target.error);
        reject(event.target.error);
      };
    };

    getRequest.onerror = function(event) {
      console.error('✗ خطا در پیدا کردن گیاه:', event.target.error);
      reject(event.target.error);
    };
  });
}

function saveCareLog(logData) {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();

    const careLog = {
      plantId: logData.plantId,
      type: logData.type || 'water',
      date: logData.date || now,
      note: logData.note || '',
      createdAt: now
    };

    const transaction = db.transaction([STORE_CARE_LOGS], 'readwrite');
    const store = transaction.objectStore(STORE_CARE_LOGS);
    const request = store.add(careLog);

    request.onsuccess = function(event) {
      console.log('✓ فعالیت مراقبتی ذخیره شد. شناسه:', event.target.result);
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      console.error('✗ خطا در ذخیره فعالیت مراقبتی:', event.target.error);
      reject(event.target.error);
    };
  });
}

// ============================================
// بخش ۵: توابع خواندن
// ============================================

function getAllPlants() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_PLANTS], 'readonly');
    const store = transaction.objectStore(STORE_PLANTS);
    const request = store.getAll();

    request.onsuccess = function(event) {
      const plants = event.target.result;
      console.log('✓ تعداد گیاهان خوانده شد:', plants.length);
      resolve(plants);
    };

    request.onerror = function(event) {
      console.error('✗ خطا در خواندن گیاهان:', event.target.error);
      reject(event.target.error);
    };
  });
}

function getPlantById(plantId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_PLANTS], 'readonly');
    const store = transaction.objectStore(STORE_PLANTS);
    const request = store.get(plantId);

    request.onsuccess = function(event) {
      const plant = event.target.result;
      if (plant) {
        console.log('✓ گیاه خوانده شد:', plant.name);
      } else {
        console.log('⚠ گیاهی با این شناسه پیدا نشد:', plantId);
      }
      resolve(plant);
    };

    request.onerror = function(event) {
      console.error('✗ خطا در خواندن گیاه:', event.target.error);
      reject(event.target.error);
    };
  });
}

function getCareLogsByPlantId(plantId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_CARE_LOGS], 'readonly');
    const store = transaction.objectStore(STORE_CARE_LOGS);
    const index = store.index('plantId');
    const request = index.getAll(plantId);

    request.onsuccess = function(event) {
      let logs = event.target.result;

      logs.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log('✓ تعداد فعالیت‌های مراقبتی خوانده شد:', logs.length);
      resolve(logs);
    };

    request.onerror = function(event) {
      console.error('✗ خطا در خواندن فعالیت‌های مراقبتی:', event.target.error);
      reject(event.target.error);
    };
  });
}

// ============================================
// بخش ۶: توابع حذف
// ============================================

function deletePlant(plantId) {
  return new Promise((resolve, reject) => {
    deleteCareLogsByPlantId(plantId)
      .then(() => {
        const transaction = db.transaction([STORE_PLANTS], 'readwrite');
        const store = transaction.objectStore(STORE_PLANTS);
        const request = store.delete(plantId);

        request.onsuccess = function() {
          console.log('✓ گیاه و فعالیت‌هایش حذف شد. شناسه:', plantId);
          resolve(true);
        };

        request.onerror = function(event) {
          console.error('✗ خطا در حذف گیاه:', event.target.error);
          reject(event.target.error);
        };
      })
      .catch((error) => {
        console.error('✗ خطا در حذف فعالیت‌های مراقبتی:', error);
        reject(error);
      });
  });
}

function deleteCareLogsByPlantId(plantId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_CARE_LOGS], 'readwrite');
    const store = transaction.objectStore(STORE_CARE_LOGS);
    const index = store.index('plantId');
    const request = index.openCursor(plantId);

    let deletedCount = 0;

    request.onsuccess = function(event) {
      const cursor = event.target.result;

      if (cursor) {
        cursor.delete();
        deletedCount++;
        cursor.continue();
      } else {
        console.log('✓ تعداد فعالیت‌های حذف‌شده:', deletedCount);
        resolve(deletedCount);
      }
    };

    request.onerror = function(event) {
      console.error('✗ خطا در حذف فعالیت‌های مراقبتی:', event.target.error);
      reject(event.target.error);
    };
  });
}

function deleteCareLog(logId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_CARE_LOGS], 'readwrite');
    const store = transaction.objectStore(STORE_CARE_LOGS);
    const request = store.delete(logId);

    request.onsuccess = function() {
      console.log('✓ فعالیت مراقبتی حذف شد. شناسه:', logId);
      resolve(true);
    };

    request.onerror = function(event) {
      console.error('✗ خطا در حذف فعالیت مراقبتی:', event.target.error);
      reject(event.target.error);
    };
  });
}