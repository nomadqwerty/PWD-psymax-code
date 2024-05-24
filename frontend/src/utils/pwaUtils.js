const registerSW = async (navigator) => {
  if (navigator.serviceWorker) {
    let registeredWorker = await navigator.serviceWorker.getRegistrations();

    if (registeredWorker.length > 0) {
      for (let i = 0; i < registeredWorker.length; i++) {
        let unregisteredWorker = await registeredWorker[i].unregister();
        // let staticV = `static`;
        // let dynamicV = `dynamic`;
        // await caches.delete(staticV);
        // await caches.delete(dynamicV);
        // console.log('Cleared old cache');
        if (unregisteredWorker) {
          // console.log('removed older service worker.');
          const swReg = await navigator.serviceWorker.register(
            '/serviceWorker.js',
            {
              scope: '/',
            }
          );

          if (swReg.active) {
            // console.log('registered service worker');
          }
        } else {
          // console.log('could not remove older service worker.');
          break;
        }
      }
      return;
    } else {
      // console.log('no service worker found');

      const swReg = await navigator.serviceWorker.register(
        '/serviceWorker.js',
        {
          scope: '/',
        }
      );

      if (swReg.active) {
        // console.log('registered service worker');
      }
      return;
    }
  }
};

//
let addToIdb = async (storeName, key, data, type, idb) => {
  if (idb) {
    // clear db of old state.
    const db = await idb;
    const txDelete = db.transaction(storeName, 'readwrite');
    const storeToClear = txDelete.objectStore(storeName);
    await storeToClear.clear();
    txDelete.complete;

    // add new state.
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    store.put(data, key);
    await tx.complete;
  }

  return;
};

//
let getFromIdb = async (idb, storName) => {
  try {
    const db = await idb;
    const tx = db.transaction(storName, 'readonly');

    const store = tx.objectStore(storName);

    const data = await store.getAll();

    return data;
  } catch (error) {
    // console.log(error.message, ': fetch data failed');
    return;
  }
};

//
const createStore = (idbObj, storeName, dbName) => {
  if (idbObj) {
    return idbObj.open(dbName, 1, (db) => {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { KeyPath: 'id' });
      }
    });
  }
};

export { registerSW, addToIdb, getFromIdb, createStore };
